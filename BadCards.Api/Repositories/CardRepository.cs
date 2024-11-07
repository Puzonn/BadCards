using BadCards.Api.Database;
using BadCards.Api.Models.Api.Cards;
using BadCards.Api.Models.Database;
using Microsoft.EntityFrameworkCore;

namespace BadCards.Api.Repositories;

public class CardRepository
{
    private readonly BadCardsContext _context;

    public CardRepository(BadCardsContext context)
    {
        _context = context; 
    }

    public async Task<CardDb> AddCard(PostCard card)
    {
        var cardDb = await _context.Cards.AddAsync(new CardDb(card.IsBlack)
        {
            AnswerCount = card.AnswerCount,
        });

        foreach (var translation in card.Translations)
        {
            cardDb.Entity.Translations.Add(new CardTranslationDb()
            {
                CardId = cardDb.Entity.Id,
                Locale = translation.Locale,
                Card = cardDb.Entity,
                Translation = translation.Translation,
            });
        }
        
        await _context.SaveChangesAsync();
        
        return cardDb.Entity;
    }

    public async Task<CardTranslationDb> AddTranslation(PostCardTranslation translation)
    {
        var translationDb = await _context.CardTranslations.AddAsync(new CardTranslationDb()
        {
            CardId = translation.Id,
            Locale = translation.Locale,
            Translation = translation.Translation,
        });

        await _context.SaveChangesAsync();

        return translationDb.Entity;
    }

    public async Task<List<CardDb>> GetCards(int count = 10)
    {
        return await _context.Cards.Take<CardDb>(count).ToListAsync();
    }

    public async Task<CardTranslationDb> GetTranslation(CardDb cardDb, string locale)
    {
       throw new NotImplementedException("GetTranslation is not implemented");
    }

    public async Task<CardDb> GetRandomCard(bool isBlack = false)
    {
        return await _context.Cards
            .Where(x => x.IsBlack == isBlack && x.AnswerCount == 2)
            .OrderBy(x => EF.Functions.Random())
            .Include(x => x.Translations).FirstAsync();
    }
    
    public async Task<CardDb[]> GetRandomCards(bool isBlack = false, int count = 10)
    {
        return await _context.Cards
            .Where(x => x.IsBlack == isBlack && x.AnswerCount == 2)
            .OrderBy(x => EF.Functions.Random())
            .Include(x => x.Translations).Take(count).ToArrayAsync();
    }

    public async Task<CardDb?> GetById(uint cardId)
    {
        return await _context.Cards.Where(x => x.Id == cardId)
            .Include(x => x.Translations)
            .FirstOrDefaultAsync();  
    }
}