using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BadCards.Api.Models.Database;

public class CardTranslationDb
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public uint Id { get; set; }
    
    [ForeignKey("Card")]
    public uint CardId { get; set; }
    
    public string Locale { get; set; }
    public string Translation { get; set; } 
    
    public CardDb Card { get; set; }    
}
