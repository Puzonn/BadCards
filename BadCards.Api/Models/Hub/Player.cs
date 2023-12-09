namespace BadCards.Api.Models.Hub;

public class Player
{
    public string ConnectionId { get; set; }
    public string Username { get; }
    public string Locale { get; set; } = "en";
 
    public string DiscordAvatarId { get; }
    public ulong DiscordUserId { get; }

    public int Points { get; set; } = 0;
    public uint UserId { get; }

    public bool IsActive { get; set; } = true;
    public bool HasSelectedRequired { get; set; }  

    public List<Card> WhiteCards { get; private set; } = new List<Card>(0);
    public List<Card> SelectedCards { get; set; } = new List<Card>(3);

    public Player(uint userId, string connectionId, string username, string languagePreference, ulong discordUserId, string discordAvatarId)
    {
        DiscordAvatarId = discordAvatarId;
        DiscordUserId = discordUserId;
        UserId = userId;
        ConnectionId = connectionId;
        Username = username;
        Locale = languagePreference;
    }

    public void SetCards(IEnumerable<Card> cards)
    {
        WhiteCards = cards.ToList();
    }

    public ApiPlayer ToApiPlayer()
    {
        return new ApiPlayer(Username, Points, DiscordUserId, DiscordAvatarId);
    }

    private Card? GetCard(uint cardId) => WhiteCards.Find(x => x.CardId == cardId);

    public Card? HasSelectedCard(uint cardId) => SelectedCards.Find(x=>x.CardId == cardId);

    public bool SelectCard(uint cardId)
    {
        if(SelectedCards.Find(x=>x.CardId == cardId) is not null)
        {
            return false;
        }

        Card? card = GetCard(cardId);

        if (card is null)
        {
            throw new ArgumentException($"Card with given id: {cardId} dose not exist in player deck");
        }

        if (card == Card.Empty)
        {
            throw new ArgumentException($"User cannot have a empty card as selected card");
        }

        SelectedCards.Add(card);

        return RemoveCardFromDeck(cardId);
    }

    public bool RemoveCardFromDeck(uint cardId)
    {
        Card? card = GetCard(cardId);

        if (card is null)
            return false;

        return WhiteCards.Remove(card);
    }
}