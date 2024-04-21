namespace BadCards.Api.Models.Api;

[Serializable]
public class DiscordUser
{
    public string Username { get; set; }
    public string AvatarId { get; set; }
    public string Lang { get; set; }    
    public ulong DiscordId { get; set; }
    public DateTime JoinDate { get; set; }
}