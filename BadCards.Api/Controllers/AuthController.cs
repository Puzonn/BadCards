using BadCards.Api.Database;
using BadCards.Api.Models;
using BadCards.Api.Models.Api;
using BadCards.Api.Models.Api.Auth;
using BadCards.Api.Models.Database;
using BadCards.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace BadCards.Api.Controllers;

[ApiController]
public class AuthController : Controller
{
    private readonly BadCardsContext dbContext;
    private readonly ITokenService tokenService;
    private readonly CookieService cookieService;

    public AuthController(CookieService _cookieService, BadCardsContext _dbContext, ITokenService _tokenService)
    {
        cookieService = _cookieService;
        tokenService = _tokenService;
        dbContext = _dbContext;
    }

    [AllowAnonymous]
    [HttpPost("/auth/discord")]
    public async Task<ActionResult> SignInDiscord([FromBody] OAuth2CallbackModel auth)
    {
        DiscordUser? discordUser = await FetchDiscordUser(auth.Access_token);

        if (discordUser is null)
        {
            return BadRequest("Failed to retrieve Discord user information using the provided access token.");
        }

        UserDb? user = await dbContext.Users.Where(x => x.DiscordId == discordUser.DiscordId).FirstOrDefaultAsync();
        var refreshToken = tokenService.GenerateRefreshToken();

        if (user is null)
        {
            user = new UserDb()
            {
                ProfileColor = GetRandomProfileColor(),
                DiscordId = discordUser.DiscordId,
                AvatarId = discordUser.AvatarId,
                Role = UserRoles.User,
                Username = discordUser.Username,
                RefreshToken = refreshToken,
                LanguagePreference = "en",
                LastProfileColorChange = DateTime.UtcNow,
                JoinDate = DateTime.UtcNow,
            };

            dbContext.Users.Add(user);
            await dbContext.SaveChangesAsync();
        }
        else
        {
            user.RefreshToken = refreshToken;

            if(user.AvatarId != discordUser.AvatarId)
            {
                user.AvatarId = discordUser.AvatarId;
            }

            dbContext.Users.Update(user);
            await dbContext.SaveChangesAsync();
        }

        var token = tokenService.GenerateAccessToken(user);

        Response.Cookies.Append("Bearer", token, cookieService.AuthCookieOption);
        Response.Cookies.Append("Refresh", refreshToken, cookieService.RefreshTokenOption);
        Response.Cookies.Append("LanguagePreference", user.LanguagePreference, cookieService.MiscCookieOption);

        return Ok();
    }

    [AllowAnonymous]
    [HttpPost("/auth/guest")]
    public ActionResult SignInGuest()
    {
        var refreshToken = tokenService.GenerateRefreshToken();

        var token = tokenService.GenerateAccessTokenGuest();

        Response.Cookies.Append("Bearer", token, cookieService.AuthCookieOption);
        Response.Cookies.Append("Refresh", refreshToken, cookieService.RefreshTokenOption);
        Response.Cookies.Append("LanguagePreference", "en", cookieService.MiscCookieOption);

        return Ok();
    }

    private async Task<DiscordUser?> FetchDiscordUser(string auth)
    {
        const string baseUrl = "https://discord.com/api/users/@me";
        using (HttpClient client = new HttpClient())
        {
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
            using (HttpResponseMessage res = await client.GetAsync(baseUrl))
            {
                using (HttpContent content = res.Content)
                {
                    var data = await content.ReadAsStringAsync();

                    if (string.IsNullOrEmpty(data))
                    {
                        return null;
                    }

                    JsonObject? parsed = JsonSerializer.Deserialize<JsonObject>(data);

                    if(parsed is null)
                    {
                        throw new Exception("Discord responsed with empty json");
                    }

                    if (parsed["username"] is null)
                    {
                        return null;
                    }

                    return new DiscordUser()
                    {
                        Username = (string)parsed["username"],
                        AvatarId = (string)parsed["avatar"],
                        DiscordId = ulong.Parse(parsed["id"].ToString()),
                        Lang = GetLang((string)parsed["locale"])
                    };
                }
            }
        }
    }

    private string GetRandomProfileColor()
    {
        Random random = Random.Shared;

        int red = Math.Clamp(random.Next(256), 0, 255);
        int green = Math.Clamp(random.Next(256), 0, 255);
        int blue = Math.Clamp(random.Next(256), 0, 255);

        return $"{red:X2}{green:X2}{blue:X2}";
    }

    private string GetLang(string locale)
    {
        if (locale.StartsWith("pl"))
        {
            return "pl";
        }

        return "en";
    }

    [Authorize]
    [HttpGet("/auth/@me")]
    public ActionResult Validate()
    {
         string token = (string)HttpContext.Items["Bearer"]!;

        TokenValidationResponse response = tokenService.Validate(token);

        return Ok(response);
    }

    [Authorize]
    [HttpPost("/auth/revoke")]
    public async Task<ActionResult> Revoke()
    {
        HttpContext.Response.Cookies.Delete("Bearer", cookieService.MiscCookieOption);
        HttpContext.Response.Cookies.Delete("Refresh", cookieService.MiscCookieOption);
        HttpContext.Response.Cookies.Delete("LanguagePreference", cookieService.MiscCookieOption);

        string token = (string)HttpContext.Items["Bearer"]!;

        TokenValidationResponse response = tokenService.Validate(token);

        if (!response.Success)
        {
            return Ok();
        }

        UserDb? user = await dbContext.Users.FindAsync(response.UserId);

        if(user is null)
        {
            return Ok();
        }

        user.RefreshToken = string.Empty;

        dbContext.Users.Update(user);

        await dbContext.SaveChangesAsync();

        return Ok();
    }
} 