using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BadCards.Api.Models.Database;

public class CardTranslationDb
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [JsonPropertyName("TranslationId")]
    public uint Id { get; set; }
    
    [ForeignKey("Card")]
    public uint CardId { get; set; }
    
    public string Locale { get; set; }
    public string Translation { get; set; } 
    
    [JsonIgnore]
    public CardDb Card { get; set; }    
}
