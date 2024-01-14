using BadCards.Api.Models.Database;

namespace BadCards.Api.Models.Hub;

public class Player
{
    public string ConnectionId { get; set; }
    public string Username { get; }
    public string Locale { get; set; } = "en";
    public string ProfileColor { get; set; }
    public string DiscordAvatarId { get; }
    public ulong DiscordUserId { get; }
    public int Points { get; set; } = 0;
    public uint UserId { get; }
    public bool IsActive { get; set; } = true;
    public bool IsGuest = false;
    public bool HasSelectedRequired { get; set; }  
    public List<Card> WhiteCards { get; private set; } = new List<Card>(0);
    public List<Card> SelectedCards { get; set; } = new List<Card>(3);

    public Player(string connectionId, UserDb user)
    {
        DiscordAvatarId = user.AvatarId!;
        ProfileColor = user.ProfileColor;
        DiscordUserId = user.DiscordId;
        UserId = (uint)user.Id;
        ConnectionId = connectionId;
        Username = user.Username;
        Locale = user.LanguagePreference;
    }

    /* Reserved for guests */
    public Player(string connectionId, string username, uint userId)
    {
        UserId = userId;
        ConnectionId = connectionId;
        Username = username;
        Locale = "en";
        IsGuest = true;
        ProfileColor = string.Empty;
        DiscordAvatarId = string.Empty;
    }

    public void SetCards(IEnumerable<Card> cards)
    {
        WhiteCards = cards.ToList();
    }

    public ApiPlayer ToApiPlayer()
    {
        return new ApiPlayer(Username, Points, DiscordUserId, DiscordAvatarId, ProfileColor);
    }

    private Card? GetCard(uint cardId) => WhiteCards.Find(x => x.CardId == cardId);

    public Card? HasSelectedCard(uint cardId) => SelectedCards.Find(x=>x.CardId == cardId);

    public bool SelectCard(uint cardId)
    {
        if(SelectedCards.Find(x => x.CardId == cardId) is not null)
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