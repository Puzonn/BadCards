using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BadCards.Api.Models.Database;

[Serializable]
public class CardDb
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
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
    
    public CardDb(bool isBlack)
    {
        IsBlack = isBlack; 
    }
}
