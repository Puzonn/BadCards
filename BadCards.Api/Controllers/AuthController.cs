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

    public AuthController(BadCardsContext _dbContext, ITokenService _tokenService)
    {
        tokenService = _tokenService;
        dbContext = _dbContext;
    }

    [AllowAnonymous]
    [HttpPost("/auth/discord")]
    public async Task<ActionResult> SignIn([FromBody] OAuth2CallbackModel auth)
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
                DiscordId = discordUser.DiscordId,
                AvatarId = discordUser.AvatarId,
                Username = discordUser.Username,
                RefreshToken = refreshToken,
                LanguagePreference = "en"
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

        Response.Cookies.Append("Bearer", token, StaticCookiesOptions.AuthCookieOption);
        Response.Cookies.Append("Refresh", refreshToken, StaticCookiesOptions.RefreshTokenOption);
        Response.Cookies.Append("LanguagePreference", user.LanguagePreference, StaticCookiesOptions.MiscCookieOption);

        return Ok("git");
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

        return Ok(JsonSerializer.Serialize(response));
    }

    [Authorize]
    [HttpPost("/auth/revoke")]
    public async Task<ActionResult> Revoke()
    {
        string token = (string)HttpContext.Items["Bearer"]!;
        TokenValidationResponse response = tokenService.Validate(token);

        if (!response.Success)
        {
            return BadRequest("Invalid Bearer");
        }

        UserDb? user = await dbContext.Users.FindAsync(response.UserId);

        if(user is null)
        {
            return BadRequest("User dose not exist");
        }

        user.RefreshToken = string.Empty;

        dbContext.Users.Update(user);

        await dbContext.SaveChangesAsync();

        HttpContext.Response.Cookies.Delete("Bearer", StaticCookiesOptions.MiscCookieOption);
        HttpContext.Response.Cookies.Delete("Refresh", StaticCookiesOptions.MiscCookieOption);

        return Ok();
    }
} 