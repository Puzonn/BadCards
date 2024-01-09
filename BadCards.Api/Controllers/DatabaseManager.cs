using BadCards.Api.Models.Api.Services;
using BadCards.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BadCards.Api.Controllers;

[ApiController]
public class DatabaseManager : Controller
{
    readonly ICardService cardService;

    public DatabaseManager(ICardService _cardService)
    {
        cardService = _cardService;
    }

    [AllowAnonymous]
    [HttpPost("/admin/cards/reload")]
    public async Task<ActionResult> ReloadCards()
    {
        CardServiceResponse response = await cardService.FillDatabaseCards();

        return Ok(response);    
    }
}