using BadCards.Api.Database;
using BadCards.Api.Models.Api.Services;
using BadCards.Api.Models.Database;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace BadCards.Api.Services;

public class CardService : ICardService
{
    private readonly BadCardsContext dbContext;
    private readonly ILogger<CardService> logger;

    public CardService(BadCardsContext _dbContext, ILogger<CardService> _logger)
    {
        dbContext = _dbContext;
        logger = _logger;
    }

    public async Task<CardServiceResponse> FillDatabaseCards()
    {
        try
        {
            string[] locales = new string[] { "us", "pl" };
            bool appendCards = true;

            await ClearDatabaseCards();

            const Int32 bufferSize = 1024;

            foreach (var locale in locales)
            {
                if (!File.Exists($"./Localization/{locale}-cards.txt"))
                {
                    return new CardServiceResponse(false, $"Cannot reload cards. '{locale}-cards.txt' file dose not exist");
                }

                await ProcessCardFile(locale, appendCards, bufferSize);

                appendCards = false;
            }

            await dbContext.SaveChangesAsync();

            return new CardServiceResponse(true);
        }
        catch(Exception ex) 
        {
            return new CardServiceResponse(false, ex.ToString());
        }
    }

    private async Task ProcessCardFile(string locale, bool appendCards, Int32 bufferSize)
    {
        /* we want to add only one iteration of locale to database*/

        bool appendQuestion = false;
        uint cardId = 1;

        using (var fileStream = File.OpenRead($"./Localization/{locale}-cards.txt"))
        using (var streamReader = new StreamReader(fileStream, Encoding.UTF8, true, bufferSize))
        {
            string? line;

            while ((line = await streamReader.ReadLineAsync()) != null)
            {
                if (IsQuestion(line))
                {
                    appendQuestion = true;
                }

                if (appendCards)
                {
                    dbContext.Cards.Add(new CardDb(appendQuestion)
                    {
                        AnswerCount = appendQuestion ? GetAsnwerCount(line) : 0,
                        IsEmpty = false,
                    });
                }

                dbContext.CardTranslations.Add(new CardTranslationDb()
                {
                    CardId = cardId,
                    Translation = line,
                    Locale = locale
                });

                cardId++;
            }
        }
    }

    private async Task ClearDatabaseCards()
    {
        await dbContext.Database.ExecuteSqlRawAsync("DELETE FROM Cards");
        await dbContext.Database.ExecuteSqlRawAsync("DELETE FROM CardTranslations");
        await dbContext.Database.ExecuteSqlRawAsync("delete from sqlite_sequence where name='Cards'");
        await dbContext.Database.ExecuteSqlRawAsync("delete from sqlite_sequence where name='CardTranslations'");
    }

    public string GetCardTranslation(uint cardId, string locale)
    {
        return dbContext.CardTranslations.Where(x => x.CardId == cardId && x.Locale == locale).Single().Translation;
    }

    public async Task<CardDb> GetRandomBlackCard()
    {
        return await dbContext.Cards.Where(x => x.IsBlack).OrderBy(x => EF.Functions.Random()).FirstAsync();
    }

    public async Task<IEnumerable<CardDb>> GetRandomWhiteCards(int count)
    {
        if(dbContext.Cards.Count() == 0)
        {
            await FillDatabaseCards();
        }

        return dbContext.Cards.Where(x => !x.IsBlack).OrderBy(x => EF.Functions.Random()).Take(count);
    }

    private bool IsQuestion(string line)
    {
        return line == "----------";
    }

    private int GetAsnwerCount(string line)
    {
        int count = line.Count(f => f == '_');

        if (count == 0)
        {
            count = 1;
        }

        return count;
    }
}
