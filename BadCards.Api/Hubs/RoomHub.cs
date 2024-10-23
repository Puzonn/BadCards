using BadCards.Api.Models;
using BadCards.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;
using BadCards.Api.Database;
using BadCards.Api.Models.Hub;
using BadCards.Api.Models.Database;
using BadCards.Api.Models.Hub.Events;

namespace BadCards.Api.Hubs;

[Authorize]
public class RoomHub : Hub
{
    private static readonly List<Room> rooms = new List<Room>();
    private readonly BadCardsContext dbContext;
    private readonly ITokenService tokenService;
    private readonly ICardService cardService;
    private readonly ILogger<RoomHub> logger;
    private const int BOT_PROCESS_DELAY = 300;

    public RoomHub(BadCardsContext _dbContext, ITokenService _tokenService, ICardService _cardService, ILogger<RoomHub> _logger)
    {
        logger = _logger;
        tokenService = _tokenService;
        dbContext = _dbContext;
        cardService = _cardService;
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        Player? player = GetPlayer();

        if (player is null)
        {
            Context.Abort();
            return;
        }

        Room? room = GetRoom(player.UserId);

        if (room is null)
        {
            return;
        }

        if (room.GetPlayers().All(x => !x.IsActive))
        {
            rooms.Remove(room);
            RoomDb? roomDb = dbContext.Rooms.Where(x => x.LobbyCode == room.RoomCode).FirstOrDefault();

            if (roomDb is not null)
            {
                dbContext.Rooms.Remove(roomDb);
                await dbContext.SaveChangesAsync();
            }
        }

        player.IsActive = false;

        foreach (Player lobbyPlayer in room.GetConnectedPlayers())
        {
            await Clients.Client(lobbyPlayer.ConnectionId).SendAsync("OnUserDisconnect", player.DiscordUserId);
        }
    }

    public override async Task OnConnectedAsync()
    {
        var identity = (ClaimsIdentity)Context.GetHttpContext()!.User.Identity!;

        if (!identity.IsAuthenticated)
        {
            Context.Abort();

            return;
        }

        await ValidateDatabase();

        await base.OnConnectedAsync();
    }

    public async Task ValidateDatabase()
    {
        if (dbContext.Cards.Count() == 0)
        {
            logger.LogInformation("Cards are empty, filling database");
            await cardService.FillDatabaseCards();
        }
    }

    public async Task JoinAsGuest(string lobbyCode, string locale, Guid userId, ClaimsIdentity identity)
    {
        string username = identity.FindFirst(ClaimTypes.Name)!.Value;

        Room? room;
        Player player;

        if ((room = rooms.Find(x => x.RoomCode == lobbyCode)) == null)
        {
            /* Guests cannot create new games */
            Context.Abort();

            return;
        }

        /* Create new player on join */
        if (room.GetPlayers().Find(x => x.UserId == userId) == null)
        {
            player = new Player(Context.ConnectionId, username, locale, userId);

            room.AddPlayer(player);
        }
        else
        {
            /* Update connectionId on reconnect to game */
            player = room.GetPlayers().Find(x => x.UserId == userId)!;
            player.ConnectionId = Context.ConnectionId;
            player.IsActive = true;
        }
        /* If player just connected */
        if (player.WhiteCards.Count < 10 && !room.IsWaitingForNextRound)
        {
            IEnumerable<Card> cards = await GetRandomWhiteCards(10 - player.WhiteCards.Count, player);

            player.AppendCards(cards);
        }

        IEnumerable<ApiPlayer> lobbyPlayers = room.GetPlayers().Select(x => x.ToApiPlayer());
        IEnumerable<Card> lobbySelectedCards = room.GetSelectedCards();

        foreach (var lobbyPlayer in room.GetConnectedPlayers())
        {
            if (!room.GameStarted)
            {
                OnJoinEvent onJoinEvent = new OnJoinEvent()
                {
                    SelectedWinnerId = room.SelectedWinnerId,
                    LobbySelectedCards = lobbySelectedCards,
                    HasSelected = false,
                    AnswerCount = room.RequiredAnswerCount,
                    IsWaitingForNextRound = false,
                    IsWaitingForJudge = false,
                    IsJudge = false,
                    PlayerSelectedCards = lobbyPlayer.GetSelectedCards(),
                    Players = lobbyPlayers,
                    WhiteCards = new Card[0],
                    BlackCard = Card.Empty,
                    JudgeUsername = string.Empty,
                    GameStarted = room.GameStarted,
                    RoomCode = room.RoomCode,
                    IsCreator = lobbyPlayer.UserId == room.Creator.UserId
                };

                await Clients.Client(lobbyPlayer.ConnectionId).SendAsync("OnJoinEvent", JsonSerializer.Serialize(onJoinEvent));
            }
            else
            {
                Card translatedBlackCard = new Card(room.BlackCardId, true, cardService.GetCardTranslation(room.BlackCardId, lobbyPlayer.Locale), Guid.Empty);

                OnJoinEvent onJoinEvent = new OnJoinEvent()
                {
                    SelectedWinnerId = room.SelectedWinnerId,
                    LobbySelectedCards = lobbySelectedCards,
                    AnswerCount = room.RequiredAnswerCount,
                    HasSelected = lobbyPlayer.HasSelectedRequired,
                    IsWaitingForNextRound = room.IsWaitingForNextRound,
                    IsWaitingForJudge = room.IsWaitingForJudge,
                    IsJudge = room.Judge == lobbyPlayer,
                    PlayerSelectedCards = lobbyPlayer.GetSelectedCards(),
                    Players = lobbyPlayers,
                    WhiteCards = lobbyPlayer.WhiteCards,
                    BlackCard = translatedBlackCard,
                    JudgeUsername = room.Judge?.Username,
                    GameStarted = room.GameStarted,
                    RoomCode = room.RoomCode,
                    IsCreator = lobbyPlayer.UserId == room.Creator.UserId
                };

                await Clients.Client(lobbyPlayer.ConnectionId).SendAsync("OnJoinEvent", JsonSerializer.Serialize(onJoinEvent));
            }
        }
    }

    public async Task Join(JoinEvent joinEvent)
    {
        try
        {
            var identity = (ClaimsIdentity)Context.User!.Identity!;
            Guid userId = new Guid(identity.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            string role = identity.FindFirst(ClaimTypes.Role)!.Value;

            if (role == Roles.Guest)
            {
                await JoinAsGuest(joinEvent.LobbyCode, joinEvent.Locale, userId, identity);

                return;
            }

            UserDb user = await dbContext.Users.Where(x => x.UserId == userId).FirstAsync();

            Room? room;

            // Check if room is not created in memory
            if ((room = rooms.Find(x => x.RoomCode == joinEvent.LobbyCode)) == null)
            {
                //Check if room is in database
                RoomDb? apiRoom = await dbContext.Rooms.Where(x => x.LobbyCode == joinEvent.LobbyCode).SingleOrDefaultAsync();

                //If not disconnect user
                if (apiRoom == null)
                {
                    await SendAsync(Context.ConnectionId, "ForceDisconnect");
                    return;
                }

                apiRoom.PlayersCount = 1;
                dbContext.Rooms.Update(apiRoom);

                await dbContext.SaveChangesAsync();

                Player player = new Player(Context.ConnectionId, joinEvent.Locale, user);

                room = new Room(apiRoom.LobbyCode, apiRoom.RoomId, player);

                rooms.Add(room);
            }
            else
            {
                /* Create new player on join */
                if (room.GetPlayers().Find(x => x.UserId == userId) == null)
                {
                    Player player = new Player(Context.ConnectionId, joinEvent.Locale, user);

                    room.GetPlayers().Add(player);
                }
                else
                {
                    /* Update connectionId on reconnect to game */
                    Player reconnectedPlayer = room.GetPlayers().Find(x => x.UserId == userId)!;
                    reconnectedPlayer.ConnectionId = Context.ConnectionId;
                    reconnectedPlayer.IsActive = true;
                }
            }

            IEnumerable<Card> lobbySelectedCards = room.GetSelectedCards();

            foreach (var lobbyPlayer in room.GetConnectedPlayers())
            {
                if (!room.GameStarted)
                {
                    OnJoinEvent onJoinEvent = new OnJoinEvent()
                    {
                        SelectedWinnerId = room.SelectedWinnerId,
                        LobbySelectedCards = lobbySelectedCards,
                        HasSelected = false,
                        AnswerCount = room.RequiredAnswerCount,
                        IsWaitingForNextRound = false,
                        IsWaitingForJudge = false,
                        IsJudge = false,
                        PlayerSelectedCards = lobbyPlayer.GetSelectedCards(),
                        Players = room.GetApiPlayers(),
                        WhiteCards = new Card[0],
                        BlackCard = Card.Empty,
                        JudgeUsername = string.Empty,
                        GameStarted = room.GameStarted,
                        RoomCode = room.RoomCode,
                        IsCreator = lobbyPlayer.UserId == room.Creator.UserId
                    };

                    await SendAsync(lobbyPlayer, "OnJoinEvent", JsonSerializer.Serialize(onJoinEvent));
                }
                else
                {
                    Card translatedBlackCard = new Card(room.BlackCardId, true, cardService.GetCardTranslation(room.BlackCardId, lobbyPlayer.Locale), Guid.Empty);

                    OnJoinEvent onJoinEvent = new OnJoinEvent()
                    {
                        SelectedWinnerId = room.SelectedWinnerId,
                        LobbySelectedCards = lobbySelectedCards,
                        AnswerCount = room.RequiredAnswerCount,
                        HasSelected = lobbyPlayer.HasSelectedRequired,
                        IsWaitingForNextRound = room.IsWaitingForNextRound,
                        IsWaitingForJudge = room.IsWaitingForJudge,
                        IsJudge = room.Judge == lobbyPlayer,
                        PlayerSelectedCards = lobbyPlayer.GetSelectedCards(),
                        Players = room.GetApiPlayers(),
                        WhiteCards = lobbyPlayer.WhiteCards,
                        BlackCard = translatedBlackCard,
                        JudgeUsername = room.Judge?.Username,
                        GameStarted = room.GameStarted,
                        RoomCode = room.RoomCode,
                        IsCreator = lobbyPlayer.UserId == room.Creator.UserId
                    };

                    await SendAsync(lobbyPlayer, "OnJoinEvent", JsonSerializer.Serialize(onJoinEvent));
                }
            }
        }
        catch (Exception ex)
        {
            await Clients.Caller.SendAsync("ForcedQuit", ex);
            Context.Abort();
        }
    }

    public async Task VoteNextRound()
    {
        Guid userId = GetUserId();
        Room room = GetRoom(userId);

        if (!room.VoteNextRound(userId))
        {
            OnNextRoundVoteEvent voteEvent = new OnNextRoundVoteEvent()
            {
                SufficientVotes = room.GetNextRoundSufficientVotes(),
                TotalVotes = room.GetNextRoundTotalVotes()
            };

            foreach (Player player in room.GetConnectedPlayers())
            {
                await SendAsync(player, "OnNextRoundVote", JsonSerializer.Serialize(voteEvent));
            }
        }
        else
        {
            await NextRound();
        }
    }

    public async Task KickPlayer(Guid userId)
    {
        Player player = GetPlayer()!;
        Room room = GetRoom(player.UserId);

        if (room.Creator != player)
        {
            return;
        }

        await SendAsync(room.GetPlayer(userId), "ForceDisconnect", "kick");

        room.RemovePlayer(userId);

        foreach (var lobbyPlayer in room.GetConnectedPlayers())
        {
            if (!room.GameStarted)
            {
                OnJoinEvent onJoinEvent = new OnJoinEvent()
                {
                    SelectedWinnerId = room.SelectedWinnerId,
                    LobbySelectedCards = Array.Empty<Card>(),
                    HasSelected = false,
                    AnswerCount = room.RequiredAnswerCount,
                    IsWaitingForNextRound = false,
                    IsWaitingForJudge = false,
                    IsJudge = false,
                    PlayerSelectedCards = lobbyPlayer.GetSelectedCards(),
                    Players = room.GetApiPlayers(),
                    WhiteCards = new Card[0],
                    BlackCard = Card.Empty,
                    JudgeUsername = string.Empty,
                    GameStarted = room.GameStarted,
                    RoomCode = room.RoomCode,
                    IsCreator = lobbyPlayer.UserId == room.Creator.UserId
                };

                await SendAsync(lobbyPlayer, "OnJoinEvent", JsonSerializer.Serialize(onJoinEvent));
            }
        }
    }

    public async Task<bool> StartGame()
    {
        Room room = GetRoom(GetUserId());

        if (room.Creator.UserId != GetUserId())
        {
            return false;
        }

        if (room.GetPlayers().Count <= 1)
        {
#if RELEASE
            return false;
#endif
        }

        room.StartGame(await cardService.GetRandomBlackCard());

        IEnumerable<ApiPlayer> lobbyPlayers = room.GetPlayers().Select(x => x.ToApiPlayer());

        foreach (var lobbyPlayer in room.GetPlayers())
        {
            /* Translated card is only for players not bots */
            Card? translatedBlackCard = null;

            if (!lobbyPlayer.IsBot)
            {
                translatedBlackCard = new Card(room.BlackCardId, true, cardService.GetCardTranslation(room.BlackCardId,
                lobbyPlayer.Locale), lobbyPlayer.UserId);
            }

            OnStartGameEvent startEvent = new OnStartGameEvent()
            {
                AnswerCount = room.RequiredAnswerCount,
                IsJudge = lobbyPlayer == room.Judge,
                WhiteCards = await GetRandomWhiteCards(10, lobbyPlayer),
                Players = lobbyPlayers,
                BlackCard = translatedBlackCard!,
                RoomCode = room.RoomCode,
                JudgeUsername = room.Judge!.Username,
                GameStarted = true,
            };

            lobbyPlayer.SetCards(startEvent.WhiteCards);

            await SendAsync(lobbyPlayer, "OnStartGame", JsonSerializer.Serialize(startEvent));
        }

        await ProcessBots(room);

        return true;
    }

    public async Task AddBot()
    {
        Room room = GetRoom(GetUserId());

        Player bot = new Player(room.CreateUserId())
        {
            IsBot = true
        };

        room.AddPlayer(bot);

        IEnumerable<Card> lobbySelectedCards = room.GetSelectedCards();

        foreach (var lobbyPlayer in room.GetConnectedPlayers())
        {
            OnJoinEvent onJoinEvent = new OnJoinEvent()
            {
                SelectedWinnerId = room.SelectedWinnerId,
                LobbySelectedCards = lobbySelectedCards,
                AnswerCount = room.RequiredAnswerCount,
                HasSelected = lobbyPlayer.HasSelectedRequired,
                IsWaitingForNextRound = room.IsWaitingForNextRound,
                IsWaitingForJudge = room.IsWaitingForJudge,
                IsJudge = room.Judge == lobbyPlayer,
                PlayerSelectedCards = lobbyPlayer.GetSelectedCards(),
                Players = room.GetApiPlayers(),
                WhiteCards = lobbyPlayer.WhiteCards,
                BlackCard = Card.Empty,
                JudgeUsername = room.Judge?.Username,
                GameStarted = room.GameStarted,
                RoomCode = room.RoomCode,
                IsCreator = lobbyPlayer.UserId == room.Creator.UserId
            };

            await SendAsync(lobbyPlayer, "OnJoinEvent", JsonSerializer.Serialize(onJoinEvent));
        }
    }

    private async Task ProcessBots(Room room)
    {
        IReadOnlyCollection<Player> bots = room.GetBots();

        if (!room.IsWaitingForJudge)
        {
            foreach (var bot in bots)
            {
                await Task.Delay(BOT_PROCESS_DELAY);

                var r = bot.WhiteCards.ToList().OrderBy(x => Random.Shared.Next());
                uint[] randomSelectedCards = r.Take(room.RequiredAnswerCount)
                    .Select(x => x.CardId).ToArray();

                await SelectCards(randomSelectedCards, room, bot);
            }
        }

        if (room.IsWaitingForJudge && room.Judge.IsBot)
        {
            IEnumerable<Card> lobbySelectedCards = room.GetSelectedCards().OrderBy(rnd => Random.Shared.Next());
            await JudgeSelectWinner(lobbySelectedCards.ElementAt(Random.Shared.Next(0, lobbySelectedCards.Count() - 1)).OwnerId, room, room.Judge);
        }
    }

    private async Task SendAsync(string connectionId, string method, string data = "")
    {
        await Clients.Client(connectionId).SendAsync(method, data);
    }

    private async Task SendAsync(Player player, string method, string data = "")
    {
        if (player.IsBot)
        {
            return;
        }

        await SendAsync(player.ConnectionId, method, data);
    }

    /// <summary>
    /// Sets all properties to be ready for next round
    /// </summary>
    /// <returns></returns>
    public async Task NextRound()
    {
        Player player = GetPlayer()!;
        Room room = GetRoom(player.UserId);

        room.NextRound((await cardService.GetRandomBlackCard()).Id);

        IEnumerable<ApiPlayer> lobbyApiPlayers = room.GetPlayers().Select(x => x.ToApiPlayer());

        foreach (Player lobbyPlayer in room.GetPlayers())
        {
            lobbyPlayer.SelectedCards = new uint[0];
            lobbyPlayer.HasSelectedRequired = false;

            List<Card> playerCards = lobbyPlayer.WhiteCards;

            if (playerCards.Count < 10)
            {
                playerCards.AddRange(await GetRandomWhiteCards(10 - playerCards.Count, lobbyPlayer));
            }

            Card newBlackCard = new Card(room.BlackCardId, true, cardService.GetCardTranslation(room.BlackCardId, lobbyPlayer.Locale), Guid.Empty);

            OnNextRoundEvent nextRoundEvent = new OnNextRoundEvent()
            {
                Players = lobbyApiPlayers,
                BlackCard = newBlackCard,
                IsJudge = room.Judge == lobbyPlayer,
                IsWaitingForJudge = false,
                IsWaitingForNextRound = false,
                JudgeUsername = room.Judge.Username,
                WhiteCards = lobbyPlayer.WhiteCards,
            };

            await SendAsync(lobbyPlayer, "OnNextRound", JsonSerializer.Serialize(nextRoundEvent));
        }

        await ProcessBots(room);
    }

    public async Task JudgeSelectWinner(Guid ownerId)
    {
        Player? player = GetPlayer();

        if (player is null)
        {
            throw new Exception("Player dose not exist");
        }

        Room room = GetRoom(player.UserId);

        await JudgeSelectWinner(ownerId, room, player);
    }

    private async Task JudgeSelectWinner(Guid ownerId, Room room, Player player)
    {
        if (room.Judge == player)
        {
            if (!room.IsWaitingForJudge)
            {
                return;
            }

            IEnumerable<Card> lobbySelectedCards = room.GetSelectedCards();

            room.SetSelectedCardByJudge(ownerId);
            room.IsWaitingForNextRound = true;

            OnJudgeSelectCardEvent judgeEvent = new OnJudgeSelectCardEvent()
            {
                CardOwnerId = ownerId,
            };

            foreach (Player lobbyPlayer in room.GetConnectedPlayers())
            {
                await SendAsync(lobbyPlayer, "OnJudgeSelectCard", JsonSerializer.Serialize(judgeEvent));
            }
        }
    }

    public async Task LeaveGame()
    {
        Player? player = GetPlayer();

        if (player is null)
        {
            Context.Abort();
            return;
        }

        Room? room = GetRoom(player.UserId);

        if (room is null)
        {
            return;
        }
        
        room.RemovePlayer(player.UserId);

        foreach (Player lobbyPlayer in room.GetConnectedPlayers())
        {
            await Clients.Client(lobbyPlayer.ConnectionId).SendAsync("OnUserDisconnect", player.UserId);
        }

        await SendAsync(player.ConnectionId, "ForceDisconnect");
    }

    public async Task EndGame()
    {
        Player player = GetPlayer()!;
        Room room = GetRoom(player.UserId);

        if(room.Creator != player)
        {
            return;
        }

        foreach(var lobbyPlayer in room.GetConnectedPlayers())
        {
            await SendAsync(lobbyPlayer.ConnectionId, "ForceDisconnect", "gameEnded");
        }

        rooms.Remove(room);
        RoomDb? roomDb = dbContext.Rooms.Where(x => x.LobbyCode == room.RoomCode).FirstOrDefault();

        if (roomDb is not null)
        {
            dbContext.Rooms.Remove(roomDb);
            await dbContext.SaveChangesAsync();
        }
    }

    private async Task SelectCards(uint[] cardsId, Room room, Player player)
    {
        if (room.Judge == player)
        {
            return;
        }

        if (player.SelectCard(cardsId))
        {
            if (player.SelectedCards.Length == room.RequiredAnswerCount)
            {
                player.HasSelectedRequired = true;
            }

            IEnumerable<Card> selectedCards = room.GetSelectedCards();

            if (room.CanJudge)
            {
                selectedCards = selectedCards.OrderBy(rnd => Random.Shared.Next());
                room.IsWaitingForJudge = true;
            }

            OnSelectCardEvent selectCardEvent = new OnSelectCardEvent()
            {
                HasSelectedRequired = player.HasSelectedRequired,
                IsWaitingForJudge = room.IsWaitingForJudge,
                IsWaitingForNextRound = room.IsWaitingForNextRound,
                ShowSelectedCards = room.CanJudge,
            };

            await SendAsync(player, "OnStateSelectCard", JsonSerializer.Serialize(selectCardEvent));

            /* Check if all players has already select their cards */
            if (room.GetPlayers().Where(x => x != room.Judge).All(x => x.HasSelectedRequired))
            {
                room.IsWaitingForJudge = true;
            }

            if (room.IsWaitingForJudge)
            {
                IEnumerable<Card> lobbySelectedCards = room.GetSelectedCards();

                foreach (var lobbyPlayer in room.GetConnectedPlayers())
                {
                    List<Card> translatedSelectedCards = new List<Card>();

                    foreach (var sCard in lobbySelectedCards)
                    {
                        string translation = cardService.GetCardTranslation(sCard.CardId, lobbyPlayer.Locale);
                        translatedSelectedCards.Add(new Card(sCard.CardId, false, translation, sCard.OwnerId)
                        {
                            OwnerUsername = sCard.OwnerUsername,
                        });
                    }

                    OnWaitingForJudge waitingForJudge = new OnWaitingForJudge()
                    {
                        LobbySelectedCards = translatedSelectedCards
                    };

                    await SendAsync(lobbyPlayer, "OnWaitingForJudgeState", JsonSerializer.Serialize(waitingForJudge));

                }
            }

            await ProcessBots(room);
        }
    }

    public async Task SelectCards(uint[] cardsId)
    {
        Player? player = GetPlayer();

        if(player is null)
        {
            throw new Exception("Player dose not exist");
        }

        Room room = GetRoom(player.UserId);
        
        await SelectCards(cardsId, room, player);
    }

    public Room GetRoom(Guid userId) => rooms.Where(x => x.GetPlayers().Find(x => x.UserId == userId) != null).SingleOrDefault()!;

    public Guid GetUserId()
    {
        var identity = (ClaimsIdentity)Context.User!.Identity!;
        Guid id = new Guid(identity.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        return id;
    }

    private Player? GetPlayer()
    {
        Guid userId = GetUserId();
        Room room = rooms.Find(x => x.GetPlayers().Find(x => x.UserId == userId) != null)!;

        if(room is null)
        {
            return null;
        }

        return room.GetPlayers().Find(x => x.UserId == userId)!;
    }

    private Player? GetPlayer(Guid userId)
    {
        Room room = rooms.Find(x => x.GetPlayers().Find(x => x.UserId == userId) != null)!;

        if (room is null)
        {
            return null;
        }

        return room.GetPlayers().Find(x => x.UserId == userId)!;
    }

    public async Task<IEnumerable<Card>> GetRandomWhiteCards(int count, Player player)
    {
        if (count <= 0)
        {
            return new List<Card>();
        }

        if (player.IsBot)
        {
            var cards = (await cardService.GetRandomWhiteCards(count)).Select(card => new Card(card.Id,
                 false, string.Empty, player.UserId)
                 { OwnerUsername = player.Username }).ToList();

            return cards;
        }
        else
        {
            var cards = (await cardService.GetRandomWhiteCards(count)).Select(card => new Card(card.Id,
                 false, cardService.GetCardTranslation(card.Id, player.Locale), player.UserId)
                 { OwnerUsername = player.Username }).ToList();
    
            return cards;
        }
    }

    public static bool HasLobby(Guid userId, out Room? room)
    {
        room = rooms.Find(x => x.GetPlayers().Find(x => x.UserId == userId) != null);

        return room is not null;
    }
}