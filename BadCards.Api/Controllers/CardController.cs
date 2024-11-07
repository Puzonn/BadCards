using BadCards.Api.Database;
using BadCards.Api.Models.Api.Cards;
using BadCards.Api.Models.Database;
using BadCards.Api.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BadCards.Api.Controllers;

[ApiController]
public class CardController : ControllerBase
{
    private readonly BadCardsContext _context;
    private readonly CardRepository _repository;    
    
    public CardController(BadCardsContext context, CardRepository repository)
    {
        _repository = repository;   
        _context = context;
    }
    
    [HttpGet("api/cards")]
    public async Task<ActionResult<CardDb>> GetCards()
    {
        return Ok(await _context.Cards.Include(x => x.Translations).ToListAsync());
    }

    [HttpPost("api/post-card")]
    public async Task<CardDb> PostCard([FromBody] PostCard card)
    {
        return await _repository.AddCard(card);
    }
    
    [HttpPost("api/post-translation")]
    public async Task<CardTranslationDb> PostCardTranslation([FromBody] PostCardTranslation translation)
    {
        return await _repository.AddTranslation(translation);
    }

    [HttpDelete("api/delete-cards")]
    public async Task DeleteCards()
    {
        _context.Cards.RemoveRange(_context.Cards);
        await _context.SaveChangesAsync();
    }
}