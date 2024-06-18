using BadCards.Api.Database;
using BadCards.Api.Models;
using BadCards.Api.Models.Database;
using BadCards.Api.Services;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace BadCards.Api.Middleware;

public class JWTMiddleware : IMiddleware
{
    private readonly ITokenService tokenService;
    private readonly BadCardsContext dbContext;
    private readonly ILogger logger;
    private readonly CookieService cookieService;

    public JWTMiddleware(CookieService _cookieService, ITokenService _tokenService, BadCardsContext _dbContext, ILogger<JWTMiddleware> _logger)
    {
        cookieService = _cookieService;
        tokenService = _tokenService;
        dbContext = _dbContext;
        logger= _logger;
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        var endpoint = context.GetEndpoint();

        if(endpoint is null)
        {
            return;
        }

        if(endpoint.Metadata.GetMetadata<IAllowAnonymous>() is not null)
        {
            await next(context);

            return;
        }

        string? token = context.Request.Cookies["Bearer"];

        var tokenHandler = new JwtSecurityTokenHandler();

        /* Bearer can change while token is being refreshed, use Items['Bearer'] instead */

        context.Items["Bearer"] = token;
        context.Items["Locale"] = context.Request.Cookies["LanguagePreference"];

        try
        {
            var jwtToken = tokenHandler.ReadJwtToken(token);

            if (jwtToken.ValidTo < DateTime.UtcNow)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                string? refreshToken = context.Request.Cookies["Refresh"];

                if (!string.IsNullOrEmpty(refreshToken))
                {
                    ClaimsPrincipal expiredClaims = tokenService.GetPrincipalFromExpiredToken(token);

                    string role = expiredClaims.FindFirstValue(ClaimTypes.Role)!;

                    if(role == UserRoles.Guest)
                    {
                        var newAccessToken = tokenService.GenerateAccessTokenGuest();
                        var newRefreshToken = tokenService.GenerateRefreshToken();

                        context.Response.Cookies.Append("Bearer", newAccessToken, cookieService.AuthCookieOption);
                        context.Response.Cookies.Append("Refresh", newRefreshToken, cookieService.RefreshTokenOption);
                        context.Response.Cookies.Append("LanguagePreference", "us", cookieService.MiscCookieOption);

                        context.Items["Bearer"] = newAccessToken;

                        await next(context);
                    }

                    long userId = long.Parse(expiredClaims.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                    UserDb? user = await dbContext.Users.FindAsync(userId);

                    if (user is not null && user.RefreshToken == refreshToken)
                    {
                        var newAccessToken = tokenService.GenerateAccessToken(user);
                        var newRefreshToken = tokenService.GenerateRefreshToken();

                        user.RefreshToken = newRefreshToken;

                        dbContext.Update(user);
                        await dbContext.SaveChangesAsync();

                        context.Response.Cookies.Append("Bearer", newAccessToken, cookieService.AuthCookieOption);
                        context.Response.Cookies.Append("Refresh", newRefreshToken, cookieService.RefreshTokenOption);
                        context.Response.Cookies.Append("LanguagePreference", user.LanguagePreference, cookieService.MiscCookieOption);

                        context.Items["Bearer"] = newAccessToken;

                        await next(context);
                    }
                }

                return;
            }
            else
            {
                context.Response.StatusCode = StatusCodes.Status200OK;
                await next(context);
                return;
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex.ToString());
           
            return;
        }
    }
}