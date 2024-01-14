using BadCards.Api.Models.Api;
using BadCards.Api.Models.Database;
using System.Security.Claims;

namespace BadCards.Api.Services;

public interface ITokenService
{
    public string GenerateRefreshToken();
    public string GenerateAccessToken(UserDb user);
    public string GenerateAccessTokenGuest();
    public TokenValidationResponse Validate(string? token);
    public ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
}