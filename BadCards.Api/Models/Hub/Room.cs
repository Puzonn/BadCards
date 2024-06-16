using BadCards.Api.Models.Database;

namespace BadCards.Api.Models.Hub;

public class Room
{
    private readonly List<Player> Players = new List<Player>();
    private readonly HashSet<uint> NextRoundVotes = new HashSet<uint>();

    public int RequiredAnswerCount { get; private set; }   

    public uint BlackCardId = 0;
    public uint SelectedWinnerId;
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

    public List<Player> GetPlayers()
    {
        return Players;
    }

    public void AddPlayer(Player player)
    {
        Players.Add(player);
    }

    public void RemovePlayer(Player player)
    {
        Players.Remove(player); 
    }

    public Player GetPlayer(uint userId)
    {
        return Players.Find(x => x.UserId == userId)!;
    }

    public void RemovePlayer(uint userId)
    {
        RemovePlayer(Players.Find(x => x.UserId == userId)!);
    }

    public List<Player> GetBots()
    {
        return Players.FindAll(x => x.IsBot);
    }

    public void SetSelectedCardByJudge(uint cardOwnerId)
    {
        SelectedWinnerId = cardOwnerId;
    }

    public bool VoteNextRound(uint userId)
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
        BlackCardId = blackCard.CardId;
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

        List<Player> copyPlayers = new List<Player>(Players);

        if(Judge is null)
        {
            return Players[Random.Shared.Next(0, Players.Count)];
        }

        copyPlayers.Remove(Judge);

        return copyPlayers[Random.Shared.Next(0, copyPlayers.Count)];
    }
}
