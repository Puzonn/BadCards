using BadCards.Api.Models.Database;

namespace BadCards.Api.Models.Hub;

public class Room
{
    public readonly List<Player> Players = new List<Player>();
    private readonly HashSet<uint> NextRoundVotes = new HashSet<uint>();

    public int RequiredAnswerCount { get; private set; }   

    public uint BlackCardId = 0;
    public uint SelectedCardByJudgeId = 0;

    public Player Creator { get; }
    public Player? Judge { get; set; }

    public string RoomCode { get; }

    public bool GameStarted { get; private set; } = false;
    public bool CanJudge => Players.Where(player => player.HasSelectedRequired).Count() == Players.Count - 1;
    public bool IsWaitingForNextRound { get; set; } = false;
    public bool IsWaitingForJudge { get; set; } = false;

    /// <summary>
    /// Gets all cards selected by users and convers them to generic SelectedCard
    /// </summary>
    /// <returns></returns>
    public IEnumerable<SelectedCard> GetSelectedCards()
    {
        List<SelectedCard> selectedCards = new List<SelectedCard>();

        foreach(var player in Players)
        {
            foreach(var card in player.SelectedCards)
            {
                selectedCards.Add(new SelectedCard(card.Content)
                {
                    OwnerId = player.UserId,
                    IsOwner = player.UserId == card.OwnerId,
                    CardId = card.CardId,
                    IsSelectedByJudge = SelectedCardByJudgeId == card.CardId,
                    SelectedByUsername = player.Username
                });
            }
        }

        return selectedCards;
    }

    /*
        => Players.Where(player => player.HasSelectedRequired).Select(player => player.SelectCard
            x => new SelectedCard(x.SelectedCard.Content)
            {
                IsSelectedByJudge = SelectedCardByJudge == x.SelectedCard.CardId,
                SelectedBy = x.Username,
                CardId = x.SelectedCard.CardId,
                IsBlack = false
            });
    */

    public Room(string roomCode, Player creator)
    {
        Creator = creator;
        RoomCode = roomCode;
        Players.Add(creator);
    }

    public void SetSelectedCardByJudge(uint cardId)
    {
        Card? selectedCard;

        foreach (var player in Players)
        {
            selectedCard = player.HasSelectedCard(cardId);

            if(selectedCard is not null)
            {
                SelectedCardByJudgeId = selectedCard.CardId;
            }
        }
    }

    public bool VoteNextRound(uint userId)
    {
        return NextRoundVotes.Add(userId);
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
        Judge = GetRandomPerson();
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
            if(lobbyPlayer.SelectedCards.Any(x => x.CardId == SelectedCardByJudgeId))
            {
                lobbyPlayer.Points++;
            }
        }

        IsWaitingForJudge = false;
        IsWaitingForNextRound = false;

        SelectedCardByJudgeId = 0;
        BlackCardId = nextBlackCardId;
        NextRoundVotes.Clear();
        Judge = GetRandomPerson(true);
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
