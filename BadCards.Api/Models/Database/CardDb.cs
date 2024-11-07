using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using BadCards.Api.Models.Hub;

namespace BadCards.Api.Models.Database;

[Serializable]
public class CardDb
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [JsonPropertyName("CardId")]
    public uint Id { get; set; }
    public bool IsBlack { get; set; }
    public int AnswerCount { get; set; }
    public List<CardTranslationDb> Translations { get; set; } = new List<CardTranslationDb>();

    public CardDb(uint id, bool isBlack, int answerCount, List<CardTranslationDb> translations)
    {
        Id = id;
        IsBlack = isBlack;
        AnswerCount = answerCount;
        Translations = translations;
    }
    
    public Card AsCard(Player lobbyPlayer, bool hasNoOwner = false)
    {
        string? translation = Translations.Find(x => x.Locale == lobbyPlayer?.Locale)?.Translation;
        Guid ownerId = hasNoOwner ? Guid.Empty : lobbyPlayer.UserId;
        
        /* Throw only if card has owner */
        if (string.IsNullOrEmpty(translation))
        {
            throw new InvalidOperationException($"There is no card translation with id {Id}");
        }

        return new Card(Id, IsBlack, translation, ownerId)
        {
            OwnerUsername = lobbyPlayer.Username
        };
    }

    public string GetTranslation(string locale)
    {
        return Translations.Find(x => x.Locale == locale)!.Translation;
    }
    
    public CardDb(bool isBlack)
    {
        IsBlack = isBlack; 
    }
}
