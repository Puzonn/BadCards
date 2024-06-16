using Microsoft.EntityFrameworkCore.ValueGeneration.Internal;

namespace BadCards.Api.Models;

public class ApiPlayer
{
    public string Username { get; set; }
    public string DiscordAvatarId { get; set; }
    public string DiscordUserId { get; set; }  
    public string ProfileColor { get; set; }
    public int Points { get; set; }
    public uint UserId { get; set; }    
    public bool IsBot { get; set; } = false;
    
    public ApiPlayer(string username, int points, ulong discordUserId, string discordAvatarId, string profileColor, uint userId)
    {
        UserId = userId;
        ProfileColor = profileColor;
        DiscordAvatarId = discordAvatarId;
        DiscordUserId = discordUserId.ToString();
        Username = username;
        Points = points;    
    }
}