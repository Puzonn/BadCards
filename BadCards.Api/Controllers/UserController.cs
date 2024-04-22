using BadCards.Api.Database;
using BadCards.Api.Models;
using BadCards.Api.Models.Api;
using BadCards.Api.Models.Database;
using BadCards.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BadCards.Api.Controllers;

[Authorize]
[ApiController]
public class UserController : Controller
{
    private static readonly List<string> AvailableLanguages = new List<string>()
    {
        "pl",
        "en"
    };

    private readonly CookieService cookieService;
    private readonly BadCardsContext dbContext;
    private readonly ITokenService tokenService;

    public UserController(CookieService _cookieService, BadCardsContext _dbContext, ITokenService _tokenService)
    {
        cookieService = _cookieService;
        dbContext = _dbContext;
        tokenService = _tokenService;   
    }

    [HttpPatch("/user/set-language")]
    public async Task<ActionResult> SetLanguagePreference([FromBody] string language)
    {
        if(!AvailableLanguages.Contains(language) || string.IsNullOrEmpty(language))
        {
            return BadRequest("Language dose not exist");
        }

        string token = (string)HttpContext.Items["Bearer"]!;

        TokenValidationResponse response = tokenService.Validate(token);

        if (!response.Success)
        {
            return Forbid("Invalid bearer token");
        }

        UserDb? user = await dbContext.Users.FindAsync(response.UserId);

        if(user is null)
        {
            return Forbid("User with given token dose not exist");
        }

        user.LanguagePreference = language;

        dbContext.Update(user);

        await dbContext.SaveChangesAsync();

        HttpContext.Response.Cookies.Append("LanguagePreference", language, cookieService.MiscCookieOption);

        return Ok();
    }

    [HttpGet("/user/game-pending-status")]
    public async Task<ActionResult<bool>> HasUserActiveGameSession()
    {

        string token = (string)HttpContext.Items["Bearer"]!;

        TokenValidationResponse response = tokenService.Validate(token);

        if (!response.Success)
        {
            return BadRequest("Token Validation Error");
        }

        UserDb? user = await dbContext.Users.FindAsync(response.UserId);

        if(user is null)
        {
            return BadRequest("Users not found");
        }

        return user.HasActivePendingSession;
    }

    [HttpPatch("/user/randomize-avatar-color")]
    public async Task<ActionResult<string>> RandomizeProfileCOlor()
    {
        string token = (string)HttpContext.Items["Bearer"]!;

        TokenValidationResponse response = tokenService.Validate(token);

        if(!response.Success)
        {
            return BadRequest("Token Validation Error");
        }

        UserDb? user = await dbContext.Users.FindAsync(response.UserId);

        if (user is null)
        {
            return BadRequest("User was null");
        }

        TimeSpan difference = user.LastProfileColorChange - DateTime.UtcNow;
 
        if (difference.TotalDays >= 1)
        {
            user.ProfileColor = GetRandomProfileColor();
            user.LastProfileColorChange = DateTime.UtcNow;

            dbContext.Update(user);

            await dbContext.SaveChangesAsync();

            string newToken = tokenService.GenerateAccessToken(user);

            HttpContext.Response.Cookies.Append("Bearer", newToken, cookieService.AuthCookieOption);

            return Ok(user.ProfileColor);
        }

        return BadRequest($"You have to wait {24-(TimeSpan.FromDays(1) - difference).Hours} hours to chanage color");
    }

    private string GetRandomProfileColor()
    {
        Random random = Random.Shared;

        int red = Math.Clamp(random.Next(256), 0, 255);
        int green = Math.Clamp(random.Next(256), 0, 255);
        int blue = Math.Clamp(random.Next(256), 0, 255);

        return $"{red:X2}{green:X2}{blue:X2}";
    }
}