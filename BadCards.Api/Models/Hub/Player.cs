using BadCards.Api.Models.Database;
using System;

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

    /// <summary>
    /// Random unique Id binded when adding user to room. It's not the same as userId from database
    /// </summary>
    public Guid UserId { get; private set; }
    public bool IsActive { get; set; } = true;
    public bool IsGuest = false;
    public bool HasSelectedRequired { get; set; }  
    public List<Card> WhiteCards { get; private set; } = new List<Card>(0);
    public uint[] SelectedCards { get; set; } = new uint[] { };

    public Player(string connectionId, UserDb user)
    {
        UserId = user.UserId;
        DiscordAvatarId = user.AvatarId!;
        ProfileColor = user.ProfileColor;
        DiscordUserId = user.DiscordId;
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
    public Player(string connectionId, string username, string locale, Guid userId)
    {
        UserId = userId;
        ConnectionId = connectionId;
        Username = username;
        Locale = locale;
        IsGuest = true;
        ProfileColor = string.Empty;
        DiscordAvatarId = string.Empty;
    }

    /// <summary>
    /// Use only for bots
    /// </summary>
    public Player(Guid userId)
    {
        UserId = userId;
        ConnectionId = string.Empty;
        Username = "Bot";
        Locale = "pl";
        IsGuest = false;
        ProfileColor = string.Empty;
        DiscordAvatarId = string.Empty;
    }

    public void SetCards(IEnumerable<Card> cards)
    {
        WhiteCards = cards.ToList();
    }

    public void SetUserId(Guid id)
    {
        UserId = id;
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
        if (HasSelectedRequired)
        {
            return false;
        }

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