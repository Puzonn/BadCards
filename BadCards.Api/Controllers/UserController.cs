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

    private readonly BadCardsContext dbContext;
    private readonly ITokenService tokenService;

    public UserController(BadCardsContext _dbContext, ITokenService _tokenService)
    {
        dbContext = _dbContext;
        tokenService = _tokenService;   
    }

    [HttpPost("/user/set-language")]
    public async Task<ActionResult> SetLanguagePreference([FromBody] string language)
    {
        if (string.IsNullOrEmpty(language))
        {
            return BadRequest("Language dose not exist");
        }

        if(!AvailableLanguages.Contains(language))
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

        HttpContext.Response.Cookies.Append("LanguagePreference", language, StaticCookiesOptions.MiscCookieOption);

        return Ok();
    }
}