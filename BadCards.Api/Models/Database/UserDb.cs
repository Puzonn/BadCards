using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BadCards.Api.Models.Database;

[Serializable]
public class UserDb
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long Id { get; set; }
    public ulong DiscordId { get; set; }
    public string Username { get; set; }
    public string RefreshToken { get; set; }
    public string? AvatarId { get; set; }
    public string LanguagePreference { get; set; }    
    public string ProfileColor { get; set; }   
    public DateTime LastProfileColorChange { get; set; }    
}