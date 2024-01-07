using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using BadCards.Api.Models.Database;
using BadCards.Api.Models.Api;
using System.Security.Principal;

namespace BadCards.Api.Services;

public class TokenService : ITokenService
{
    private readonly string JwtKey;
    private readonly string JwtIssuer;
    private readonly string JwtAudience;

    public TokenValidationParameters GetValidationParameters()
    {
        return new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            RequireExpirationTime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = JwtIssuer,
            ValidAudience = JwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtKey))
        };
    }

    public TokenService(IConfiguration configuration)
    {
        JwtKey = configuration["Jwt:Key"]!;
        JwtIssuer = configuration["Jwt:Issuer"]!;
        JwtAudience = configuration["Jwt:Audience"]!;
    }

    public string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }

    public string GenerateAccessToken(UserDb user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
              new Claim(ClaimTypes.Name, user.Username!),
              new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
              new Claim("DiscordUserId", user.DiscordId.ToString()),
              new Claim("ProfileColor", user.ProfileColor),
              new Claim("DiscordAvatarId", user.AvatarId == null ? string.Empty : user.AvatarId),
              new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(JwtIssuer,
            JwtAudience,
            claims,
            expires: DateTime.Now.AddMinutes(5),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public TokenValidationResponse Validate(string? token)
    {
        if (string.IsNullOrEmpty(token))
        {
            return TokenValidationResponse.Unsuccessful;
        }

        var tokenHandler = new JwtSecurityTokenHandler();

        var validationParameters = GetValidationParameters();

        SecurityToken validatedToken;

        try
        {
            IPrincipal principal = tokenHandler.ValidateToken(token, validationParameters, out validatedToken);

            if (principal is ClaimsPrincipal claimsPrincipal)
            {
                var username = claimsPrincipal.FindFirst(ClaimTypes.Name)?.Value;
                var avatarId = claimsPrincipal.FindFirst("DiscordAvatarId")?.Value;
                var discordId = claimsPrincipal.FindFirst("DiscordUserId")?.Value;
                var profileColor = claimsPrincipal.FindFirst("ProfileColor")?.Value;
                var date = DateTime.Now;
                var userId = long.Parse(claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier)!.Value);

                TokenValidationResponse response = new()
                {
                    Username = username,
                    ProfileColor = profileColor,  
                    AvatarId = avatarId,
                    DiscordId = discordId!.ToString(),
                    Success = true,
                    UserId = userId
                };

                return response;
            }
        }
        catch (Exception)
        {
            return TokenValidationResponse.Unsuccessful;
        }

        return TokenValidationResponse.Unsuccessful;
    }

    public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
    {
        var tokenValidationParameters = GetValidationParameters();
        tokenValidationParameters.ValidateLifetime = false;

        var tokenHandler = new JwtSecurityTokenHandler();
        SecurityToken securityToken;

        var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out securityToken);
        var jwtSecurityToken = securityToken as JwtSecurityToken;

        if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            throw new SecurityTokenException("Invalid token");

        return principal;
    }
}
