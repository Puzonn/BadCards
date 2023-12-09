using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BadCards.Api.Models.Database;

[Serializable]
public class CardDb
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public uint CardId { get; set; }
    public bool IsBlack { get; set; }
    public int AnswerCount { get; set; }    

    [JsonIgnore]
    [NotMapped]
    public bool IsEmpty { get; set; } = false;

    public CardDb(bool isBlack)
    {
        IsBlack = isBlack;
        IsEmpty = false;
    }

    [JsonIgnore]
    public static readonly CardDb Empty = new CardDb(false)
    {
        CardId = 0,
        IsEmpty = true,
    };
}
