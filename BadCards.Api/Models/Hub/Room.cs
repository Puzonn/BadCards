using BadCards.Api.Models.Database;

namespace BadCards.Api.Models.Hub;

public class Room
{
    private readonly List<Player> Players = new List<Player>();
    private readonly HashSet<Guid> NextRoundVotes = new HashSet<Guid>();

    public int RequiredAnswerCount { get; private set; }   

    public uint BlackCardId = 0;
    public Guid SelectedWinnerId;
    public uint RoomId;

    public readonly Player Creator;
    public Player Judge { get; private set; }

    public readonly string RoomCode;

    public bool GameStarted { get; private set; } = false;
    public bool CanJudge => Players.Where(player => player.HasSelectedRequired).Count() == Players.Count - 1;
    public bool IsWaitingForNextRound { get; set; } = false;
    public bool IsWaitingForJudge { get; set; } = false;

    /// <summary>
    /// Gets all cards selected by users and convers them to generic SelectedCard
    /// </summary>
    /// <returns></returns>
    public IEnumerable<Card> GetSelectedCards()
    {
        List<Card> lobbySelectedCards = new List<Card>();

        foreach (var lobbyPlayer in Players)
        {
            var cards = lobbyPlayer.SelectedCards.Select(e => lobbyPlayer.WhiteCards.Find(x => e == x.CardId));

            if(cards is null)
            {
                continue;
            }

            foreach(var card in cards)
            {
                card.OwnerUsername = lobbyPlayer.Username;
            }

            lobbySelectedCards.AddRange(cards);
        }

        return lobbySelectedCards;
    }

    public Room(string roomCode, uint roomId, Player creator)
    {
        Judge = creator;
        RoomId = roomId;
        Creator = creator;
        RoomCode = roomCode;
        Players.Add(creator);
    }

    public List<Player> GetConnectedPlayers()
    {
        return Players.FindAll(x => !x.IsBot);
    }

    public List<Player> GetBots()
    {
        return Players.FindAll(x => x.IsBot);
    }

    public List<Player> GetPlayers()
   {
        return Players;
    }

    public void AddPlayer(Player player)
    {
        Players.Add(player);
    }

    public Guid CreateUserId()
    {
        IEnumerable<Guid> ids = Players.Select(x => x.UserId);
        Guid id;

        do
        {
            id = Guid.NewGuid();
        } while (ids.Contains(id));

        return id;
    }

    public void RemovePlayer(Player player)
    {
        Players.Remove(player); 
    }

    public Player GetPlayer(Guid userId)
    {
        return Players.Find(x => x.UserId == userId)!;
    }

    public void RemovePlayer(Guid userId)
    {
        RemovePlayer(Players.Find(x => x.UserId == userId)!);
    }

    public void SetSelectedCardByJudge(Guid cardOwnerId)
    {
        SelectedWinnerId = cardOwnerId;
    }

    public bool VoteNextRound(Guid userId)
    {
        if (!NextRoundVotes.Add(userId))
        {
            return false;
        }

        return true;
    }

    public ApiPlayer[] GetApiPlayers()
    {
        return Players.Select(x => x.ToApiPlayer()).ToArray();
    }

    public bool NextRoundEnoughVotes()
    {
        return NextRoundVotes.Count >= GetNextRoundSufficientVotes();
    }

    public int GetNextRoundTotalVotes()
    {
        return NextRoundVotes.Count;
    }

    public int GetNextRoundSufficientVotes()
    {
        return (int)Math.Ceiling((float)Players.Count / 2);
    }

    public void StartGame(CardDb blackCard)
    {
        GameStarted = true;
        Judge = Players[0];
        RequiredAnswerCount = blackCard.AnswerCount;
        BlackCardId = blackCard.Id;
    }

    public void NextRound(uint nextBlackCardId)
    {
        if(Judge is null)
        {
            throw new Exception("Judge was null when setting next round");
        }

        foreach(var lobbyPlayer in Players)
        {
            //if(lobbyPlayer.SelectedCards.Any(x => x.CardId == SelectedCardByJudgeId))
            //{
            //    lobbyPlayer.Points++;
            //}
        }

        IsWaitingForJudge = false;
        IsWaitingForNextRound = false;

        //SelectedWinnerId = new uint[0];
        BlackCardId = nextBlackCardId;
        NextRoundVotes.Clear();
        Judge = GetRandomPerson(excludeJudge: true);
    }

    public Player GetRandomPerson(bool excludeJudge = false)
    {
        if (!excludeJudge)
        {
            return Players[Random.Shared.Next(0, Players.Count)];
        }

        List<Player> players = new List<Player>(Players.FindAll(player => player != Judge));

        if(Judge is null)
        {
            return Players[Random.Shared.Next(0, Players.Count)];
        }

        return players[Random.Shared.Next(0, players.Count)];
    }
}
