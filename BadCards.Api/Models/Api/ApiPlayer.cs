namespace BadCards.Api.Models;

public class ApiPlayer
{
    public string Username { get; set; }
    public string DiscordAvatarId { get; set; }
    public string DiscordUserId { get; set; }  
    public string AvatarColor { get; set; }
    public int Points { get; set; } 
    
    public ApiPlayer(string username, int points, ulong discordUserId, string discordAvatarId, string avatarColor)
    {
        AvatarColor = avatarColor;
        DiscordAvatarId = discordAvatarId;
        DiscordUserId = discordUserId.ToString();
        Username = username;
        Points = points;    
    }
}
