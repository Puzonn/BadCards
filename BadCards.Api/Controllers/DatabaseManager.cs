using BadCards.Api.Database;
using BadCards.Api.Models.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System.Text;

namespace BadCards.Api.Controllers;

[ApiController]
public class DatabaseManager : Controller
{
    private string[] LangCodes = { "en", "pl" };
    private readonly BadCardsContext dbContext;

    public DatabaseManager(BadCardsContext _dbContext)
    {
        dbContext = _dbContext;
    }

    [AllowAnonymous]
    [HttpPost("/admin/cards/reload")]
    public async Task<ActionResult> ReloadCards()
    {
        await dbContext.Database.ExecuteSqlRawAsync("DELETE FROM Cards");
        await dbContext.Database.ExecuteSqlRawAsync("DELETE FROM CardTranslations");
        await dbContext.Database.ExecuteSqlRawAsync("delete from sqlite_sequence where name='Cards'");
        await dbContext.Database.ExecuteSqlRawAsync("delete from sqlite_sequence where name='CardTranslations'");

        int sumcount = 0;
        bool appendCards = true;

        const Int32 BufferSize = 1024;

        foreach (var code in LangCodes)
        {
            if (!System.IO.File.Exists($"./Cards/{code}-cards.txt"))
            {
                throw new Exception("Cannot reload cards. 'cards.txt' file dose not exist");
            }

            bool appendQuestion = false;
            uint cardId = 1;

            using (var fileStream = System.IO.File.OpenRead($"./Cards/{code}-cards.txt"))
            using (var streamReader = new StreamReader(fileStream, Encoding.UTF8, true, BufferSize))
            {
                string line;
                while ((line = await streamReader.ReadLineAsync()) != null)
                {
                    if (IsQuestion(line))
                    {
                        appendQuestion = true;
                    }

                    sumcount++;

                    if (appendCards)
                    {
                        if (appendQuestion)
                        {
                            dbContext.Cards.Add(new CardDb(appendQuestion)
                            {
                                AnswerCount = GetAsnwerCount(line),
                                IsEmpty = false,
                            });
                        }
                        else
                        {
                            dbContext.Cards.Add(new CardDb(appendQuestion)
                            {
                                AnswerCount = 0,
                                IsEmpty = false,
                            });
                        }
                    }

                    dbContext.CardTranslations.Add(new CardTranslationDb()
                    {
                        CardId = cardId,
                        Translation = line,
                        Locale = code
                    });

                    cardId++;
                }
            }

            appendCards = false;
        }

        await dbContext.SaveChangesAsync();

        return Ok($"Added {sumcount}");
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

    private bool IsQuestion(string line)
    {
        return line == "----------";
    }
}