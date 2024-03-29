﻿using BadCards.Api.Models.Api;
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

    public RoomHub(BadCardsContext _dbContext, ITokenService _tokenService, ICardService _cardService)
    {
        tokenService = _tokenService;
        dbContext = _dbContext;
        cardService = _cardService;
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        Player? player = GetPlayer();

        if(player is null)
        {
            Context.Abort();
            return;
        }

        Room room = GetRoom(player.UserId);

        player.IsActive = false;

        if(room.Players.All(x => !x.IsActive))
        {
            rooms.Remove(room);
            RoomDb? roomDb = dbContext.Rooms.Where(x => x.LobbyCode == room.RoomCode).FirstOrDefault();

            if(roomDb is not null)
            {
                dbContext.Rooms.Remove(roomDb); 
                await dbContext.SaveChangesAsync();
            }
        }

        foreach(var lobbyPlayer in room.Players)
        {
            await Clients.Client(lobbyPlayer.ConnectionId).SendAsync("OnUserDisconnect", player.DiscordUserId);
        }
    }

    public override Task OnConnectedAsync()
    {
        string? bearer = (string?)Context.GetHttpContext().Items["Bearer"];

        if (string.IsNullOrEmpty(bearer))
        {
            Context.Abort();

            return Task.CompletedTask;
        }

        TokenValidationResponse response = tokenService.Validate(bearer);

        if (!response.Success)
        {
            Context.Abort();
        }

        return base.OnConnectedAsync();
    }

    public async Task JoinAsGuest(string lobbyCode, long userId, ClaimsIdentity identity)
    {
        string username = identity.FindFirst(ClaimTypes.Name)!.Value;

        Room? room;

        if ((room = rooms.Find(x => x.RoomCode == lobbyCode)) == null)
        {
            /* Guests cannot create new games */
            Context.Abort();

            return;
        }

        /* Create new player on join */
        if (room.Players.Find(x => x.UserId == userId) == null)
        {
            Player player = new Player(Context.ConnectionId, username, (uint)userId);

            room.Players.Add(player);
        }
        else
        {
            /* Update connectionId on reconnect to game */
            Player reconnectedPlayer = room.Players.Find(x => x.UserId == userId)!;
            reconnectedPlayer.ConnectionId = Context.ConnectionId;
            reconnectedPlayer.IsActive = true;
        }

        IEnumerable<ApiPlayer> lobbyPlayers = room.Players.Select(x => x.ToApiPlayer());

        foreach (var player in room.Players)
        {
            if (!room.GameStarted)
            {
                OnJoinEvent onJoinEvent = new OnJoinEvent()
                {
                    HasSelected = false,
                    AnswerCount = room.RequiredAnswerCount,
                    IsWaitingForNextRound = false,
                    IsWaitingForJudge = false,
                    IsJudge = false,
                    SelectedCards = new SelectedCard[0],
                    Players = lobbyPlayers,
                    WhiteCards = new Card[0],
                    BlackCard = Card.Empty,
                    JudgeUsername = string.Empty,
                    GameStarted = room.GameStarted,
                    RoomCode = room.RoomCode,
                    IsCreator = player.UserId == room.Creator.UserId
                };

                await Clients.Client(player.ConnectionId).SendAsync("OnJoinEvent", JsonSerializer.Serialize(onJoinEvent));
            }
            else
            {
                Card translatedBlackCard = new Card(room.BlackCardId, true, cardService.GetCardTranslation(room.BlackCardId, player.Locale), 0);

                OnJoinEvent onJoinEvent = new OnJoinEvent()
                {
                    AnswerCount = room.RequiredAnswerCount,
                    HasSelected = player.HasSelectedRequired,
                    IsWaitingForNextRound = room.IsWaitingForNextRound,
                    IsWaitingForJudge = room.IsWaitingForJudge,
                    IsJudge = room.Judge == player,
                    SelectedCards = room.GetSelectedCards(),
                    Players = lobbyPlayers,
                    WhiteCards = player.WhiteCards,
                    BlackCard = translatedBlackCard,
                    JudgeUsername = room.Judge?.Username,
                    GameStarted = room.GameStarted,
                    RoomCode = room.RoomCode,
                    IsCreator = player.UserId == room.Creator.UserId
                };

                await Clients.Client(player.ConnectionId).SendAsync("OnJoinEvent", JsonSerializer.Serialize(onJoinEvent));
            }
        }
    }

    public async Task Join(string lobbyCode)
    {
        try
        {
            var identity = (ClaimsIdentity)Context.User!.Identity!;
            uint userId = uint.Parse(identity.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            string role = identity.FindFirst(ClaimTypes.Role).Value!;
            
            if(role == UserRoles.Guest)
            {
                await JoinAsGuest(lobbyCode, userId, identity);

                return;
            }

            UserDb user = await dbContext.Users.Where(x => x.Id == userId).FirstOrDefaultAsync();

            Room? room;

            // Check if room is not created in memory
            if ((room = rooms.Find(x => x.RoomCode == lobbyCode)) == null)
            {
                //Check if room is in database
                RoomDb? apiRoom = await dbContext.Rooms.Where(x => x.LobbyCode == lobbyCode).SingleOrDefaultAsync();
                
                //If not disconnect user
                if (apiRoom == null)
                {
                    Context.Abort();
                    return;
                }

                apiRoom.PlayersCount = 1;
                dbContext.Rooms.Update(apiRoom);

                await dbContext.SaveChangesAsync();

                Player player = new Player(Context.ConnectionId, user);

                room = new Room(apiRoom.LobbyCode, apiRoom.RoomId, player);

                rooms.Add(room);
            }
            else
            {
                /* Create new player on join */
                if (room.Players.Find(x => x.UserId == userId) == null)
                {
                    Player player = new Player(Context.ConnectionId, user);

                    room.Players.Add(player);
                }
                else
                {
                    /* Update connectionId on reconnect to game */
                    Player reconnectedPlayer = room.Players.Find(x => x.UserId == userId)!;
                    reconnectedPlayer.ConnectionId = Context.ConnectionId;
                    reconnectedPlayer.IsActive = true;
                }
            }

            IEnumerable<ApiPlayer> lobbyPlayers = room.Players.Select(x => x.ToApiPlayer());

            foreach (var player in room.Players)
            {
                if (!room.GameStarted)
                {
                    OnJoinEvent onJoinEvent = new OnJoinEvent()
                    {
                        HasSelected = false,
                        AnswerCount = room.RequiredAnswerCount,
                        IsWaitingForNextRound = false,
                        IsWaitingForJudge = false,
                        IsJudge = false,
                        SelectedCards = new SelectedCard[0],
                        Players = lobbyPlayers,
                        WhiteCards = new Card[0],
                        BlackCard = Card.Empty,
                        JudgeUsername = string.Empty,
                        GameStarted = room.GameStarted,
                        RoomCode = room.RoomCode,
                        IsCreator = player.UserId == room.Creator.UserId
                    };
                    
                    await Clients.Client(player.ConnectionId).SendAsync("OnJoinEvent", JsonSerializer.Serialize(onJoinEvent));
                }
                else
                {
                    Card translatedBlackCard = new Card(room.BlackCardId, true, cardService.GetCardTranslation(room.BlackCardId, player.Locale), 0);

                    OnJoinEvent onJoinEvent = new OnJoinEvent()
                    {
                        AnswerCount = room.RequiredAnswerCount,
                        HasSelected = player.HasSelectedRequired,
                        IsWaitingForNextRound = room.IsWaitingForNextRound,
                        IsWaitingForJudge = room.IsWaitingForJudge,
                        IsJudge = room.Judge == player,
                        SelectedCards = room.GetSelectedCards(),
                        Players = lobbyPlayers,
                        WhiteCards = player.WhiteCards,
                        BlackCard = translatedBlackCard,
                        JudgeUsername = room.Judge?.Username,
                        GameStarted = room.GameStarted,
                        RoomCode = room.RoomCode,
                        IsCreator = player.UserId == room.Creator.UserId
                    };

                    await Clients.Client(player.ConnectionId).SendAsync("OnJoinEvent", JsonSerializer.Serialize(onJoinEvent));
                }
            }
        }
        catch(Exception ex)
        {
            await Clients.Caller.SendAsync("ForcedQuit", ex);
            Context.Abort();
        }
        
    }

    public async Task VoteNextRound()
    {
        uint userId = GetUserId();
        Room room = GetRoom(userId);

        if (!room.VoteNextRound(userId))
        {
            return;
        }

        if (room.NextRoundEnoughVotes())
        {
            await NextRound();
        }

        OnNextRoundVoteEvent voteEvent = new OnNextRoundVoteEvent()
        {
            SufficientVotes = room.GetNextRoundSufficientVotes(),
            TotalVotes = room.GetNextRoundTotalVotes()
        };

        foreach(Player lobbyPlayer in room.Players)
        {
            await Clients.Client(lobbyPlayer.ConnectionId).SendAsync("OnNextRoundVote", JsonSerializer.Serialize(voteEvent));
        }
    }

    public async Task<bool> StartGame()
    {
        Room room = GetRoom(GetUserId());

        if(room.Creator.UserId != GetUserId())
        {
            return false;
        }

        if(room.Players.Count <= 1)
        {
            return false;
        }

        room.StartGame(cardService.GetRandomBlackCard());

        IEnumerable<ApiPlayer> lobbyPlayers = room.Players.Select(x => x.ToApiPlayer());

        foreach (var player in room.Players)
        {
            Card translatedBlackCard = new Card(room.BlackCardId, true, cardService.GetCardTranslation(room.BlackCardId, player.Locale), player.UserId);

            OnStartGameEvent startEvent = new OnStartGameEvent()
            {
                AnswerCount = room.RequiredAnswerCount,
                IsJudge = player == room.Judge,
                WhiteCards = GetRandomWhiteCards(10, player.UserId, player.Locale),
                Players = lobbyPlayers,
                BlackCard = translatedBlackCard,
                RoomCode = room.RoomCode,
                JudgeUsername = room.Judge!.Username,
                GameStarted = true,
            };

            player.SetCards(startEvent.WhiteCards);

            await Clients.Client(player.ConnectionId).SendAsync("OnStartGame", JsonSerializer.Serialize(startEvent));
        }

        return true;
    }

    /// <summary>
    /// Sets all properties to be ready for next round
    /// </summary>
    /// <returns></returns>
    public async Task NextRound()
    {
        Player player = GetPlayer()!;
        Room room = GetRoom(player.UserId);

        uint selectedCardByJudge = room.SelectedCardByJudgeId;

        room.NextRound(cardService.GetRandomBlackCard().CardId);

        IEnumerable<ApiPlayer> lobbyPlayers = room.Players.Select(x => x.ToApiPlayer());

        foreach (Player lobbyPlayer in room.Players)
        {
            lobbyPlayer.SelectedCards.Clear();
            lobbyPlayer.HasSelectedRequired = false;

            List<Card> playerCards = lobbyPlayer.WhiteCards;

            if(playerCards.Count != 10)
            {
                playerCards.AddRange(GetRandomWhiteCards(10 - playerCards.Count, lobbyPlayer.UserId, lobbyPlayer.Locale));
            }

            Card newBlackCard = new Card(room.BlackCardId, true, cardService.GetCardTranslation(room.BlackCardId, lobbyPlayer.Locale), 0);

            OnNextRoundEvent nextRoundEvent = new OnNextRoundEvent()
            {
                Players = lobbyPlayers,
                BlackCard = newBlackCard,
                IsJudge = room.Judge!.UserId == lobbyPlayer.UserId,
                IsWaitingForJudge = false,
                IsWaitingForNextRound = false,
                JudgeUsername = room.Judge.Username,
                WhiteCards = lobbyPlayer.WhiteCards,
            };

            await Clients.Client(lobbyPlayer.ConnectionId).SendAsync("OnNextRound", JsonSerializer.Serialize(nextRoundEvent));
        }
    }

    public async Task SelectCard(uint cardId)
    {
        Player player = GetPlayer()!;
        Room room = GetRoom((uint)player.UserId);

        if (room.Judge == player)
        {
            /* Check if card is not from sender inventory, only from other players that selected that card */
            if (room.IsWaitingForJudge && room.GetSelectedCards().Any(x => x.CardId == cardId))
            {
                room.SetSelectedCardByJudge(cardId);

                OnJudgeSelectCardEvent judgeEvent = new OnJudgeSelectCardEvent()
                {
                    SelectedCardId = cardId,
                    SufficientVotes = room.GetNextRoundSufficientVotes(),
                    TotalVotes = room.GetNextRoundTotalVotes()
                };

                foreach (Player lobbyPlayer in room.Players)
                {
                    await Clients.Client(lobbyPlayer.ConnectionId).SendAsync("OnJudgeSelectCard", JsonSerializer.Serialize(judgeEvent));
                }
            }

            return;
        }

        /* Check if player already selceted cards */
        if(player.SelectedCards.Count == room.RequiredAnswerCount)
        {
            return;
        }

        if (player.SelectCard(cardId))
        {
            if(player.SelectedCards.Count == room.RequiredAnswerCount)
            {
                player.HasSelectedRequired = true;
            }

            IEnumerable<SelectedCard> selectedCards = room.GetSelectedCards();

            if (room.CanJudge)
            {
                selectedCards = selectedCards.OrderBy(rnd => Random.Shared.Next());
                room.IsWaitingForJudge = true;
            }
             
            foreach (Player lobbyPlayer in room.Players)
            {
                IEnumerable<SelectedCard> translatedSelectedCards = selectedCards
                    .Select(x => new SelectedCard(cardService.GetCardTranslation(x.CardId, lobbyPlayer.Locale))
                    {
                        CardId = x.CardId,
                        IsSelectedByJudge = x.IsSelectedByJudge,
                        SelectedByUsername = x.SelectedByUsername,
                        IsOwner = x.OwnerId == lobbyPlayer.UserId
                    });

                OnSelectCardEvent selectCardEvent = new OnSelectCardEvent()
                {
                    HasSelectedRequired = lobbyPlayer.HasSelectedRequired,
                    IsWaitingForJudge = room.IsWaitingForJudge,
                    IsWaitingForNextRound = room.IsWaitingForNextRound,
                    SelectedCards = translatedSelectedCards,
                    ShowSelectedCards = room.CanJudge,
                    SelectDeletedCard = lobbyPlayer.UserId == player.UserId ? cardId : null,
                    ShouldDeleteCard = lobbyPlayer.UserId == player.UserId
                };

                await Clients.Client(lobbyPlayer.ConnectionId).SendAsync("OnStateSelectCard", JsonSerializer.Serialize(selectCardEvent));
            }
        }
    }

    public Room GetRoom(uint userId) => rooms.Where(x => x.Players.Find(x => x.UserId == userId) != null).SingleOrDefault()!;

    public uint GetUserId()
    {
        var identity = (ClaimsIdentity)Context.User!.Identity!;

        return uint.Parse(identity.FindFirst(ClaimTypes.NameIdentifier)!.Value);
    }

    public Player? GetPlayer()
    {
        uint userId = GetUserId();
        Room room = rooms.Find(x => x.Players.Find(x => x.UserId == userId) != null)!;

        if(room is null)
        {
            return null;
        }

        return room.Players.Find(x => x.UserId == userId)!;
    }

    public IEnumerable<Card> GetRandomWhiteCards(int count, uint userId, string locale)
    {
        if (count <= 0)
        {
            return new List<Card>();
        }

        var cards = cardService.GetRandomWhiteCards(count).Select(card => new Card(card.CardId,
            false, cardService.GetCardTranslation(card.CardId, locale), userId)).ToList();

        return cards;
    }

    public static bool HasLobby(long userId, out Room? room)
    {
        room = rooms.Find(x => x.Players.Find(x => x.UserId == userId) != null);

        return room is not null;
    }
}