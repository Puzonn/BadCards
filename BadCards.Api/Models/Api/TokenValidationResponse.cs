namespace BadCards.Api.Models.Api;

[Serializable]
public sealed class TokenValidationResponse
{
    public string? Username { get; set; }
    public string? AvatarId { get; set; }
    public string? DiscordId { get; set; }
    public string? Role { get; set; }
    public string? ProfileColor { get; set; }
    public long? UserId { get; set; }   
    public bool Success { get; set; }

    public static readonly TokenValidationResponse Unsuccessful = new TokenValidationResponse()
    {
        Success = false,
        Username = string.Empty,
        AvatarId = string.Empty,
        DiscordId = string.Empty,
        ProfileColor = string.Empty,
    };
}
