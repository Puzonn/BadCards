using BadCards.Api.Models.Database;

namespace BadCards.Api.Models.Hub;

public class Player
{
    public bool IsBot { get; set; }   
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
    public uint[] SelectedCards { get; set; } = new uint[] { };

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

    public IEnumerable<Card> GetSelectedCards()
    {
        return SelectedCards.Select(selectedCardId => WhiteCards.Find(x => x.CardId == selectedCardId)!);
    }

    /// <summary>
    /// Use only for guests
    /// </summary>
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

    /// <summary>
    /// Use only for bots
    /// </summary>
    public Player()
    {
        UserId = (uint)Random.Shared.Next(0, 100000);
        ConnectionId = string.Empty;
        Username = "Bot";
        IsGuest = false;
        ProfileColor = string.Empty;
        DiscordAvatarId = string.Empty;
    }

    public void SetCards(IEnumerable<Card> cards)
    {
        WhiteCards = cards.ToList();
    }

    public void AppendCards(IEnumerable<Card> cards)
    {
        if(WhiteCards.Count + cards.Count() > 10)
        {
            throw new Exception($"Cannot append this many cards: WhiteCards: {WhiteCards.Count} Appended: {cards.Count()}");
        }

        WhiteCards.AddRange(cards);
    }

    public ApiPlayer ToApiPlayer()
    {
        return new ApiPlayer(Username, Points, DiscordUserId, DiscordAvatarId, ProfileColor, UserId)
        {
            IsBot = IsBot
        };
    }

    public Card? GetCard(uint cardId) => WhiteCards.Find(x => x.CardId == cardId);

    /// <summary>
    /// Returns false is cards dose not exist in current deck
    /// </summary>
    /// <param name="cards">Selected cards by player</param>
    /// <returns></returns>
    public bool SelectCard(uint[] cards)
    {
        IEnumerable<uint> whiteCardsId = WhiteCards.Select(x => x.CardId);

        if (cards.All(whiteCardsId.Contains))
        {
            SelectedCards = cards;

            return true;
        }

        return false;
    }

    public bool RemoveCardsFromDeck(uint[] cards)
    {
        foreach (uint cardId in cards) 
        { 
            Card? card = GetCard(cardId);

            if(card is null)
            {
                return false;
            }

            WhiteCards.Remove(card);
        }

        return true;
    }
}