namespace BadCards.Api.Models.Api.Auth;

public class ApiUser
{
    public string Username { get; set; }
    public Guid UserId { get; set; }
    public string Role { get; set; }
    public string? AvatarUrl { get; set; }
}