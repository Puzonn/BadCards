using BadCards.Api.Database;
using BadCards.Api.Models.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ActionConstraints;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace BadCards.Api.Controllers;

[ApiController]
public class DatabaseManager : Controller
{
    private readonly BadCardsContext dbContext;

    public DatabaseManager(BadCardsContext _dbContext)
    {
        dbContext = _dbContext;
    }

    [AllowAnonymous]
    [HttpPost("/admin/cards/reload")]
    public async Task<ActionResult> ReloadCards()
    {
        int clearCode = await dbContext.Database.ExecuteSqlRawAsync("DELETE FROM Cards");
        //int trClearCode = await dbContext.Database.ExecuteSqlRawAsync("DELETE FROM CardTranslations");

        string langCode = "en";

        bool appendQuestion = false;
        const Int32 BufferSize = 1024;

        if (!System.IO.File.Exists("./Cards/en-cards.txt"))
        {
            throw new Exception("Cannot reload cards. 'cards.txt' file dose not exist");
        }

        uint cardId = 1;
        using (var fileStream = System.IO.File.OpenRead($"./Cards/{langCode}-cards.txt"))
        using (var streamReader = new StreamReader(fileStream, Encoding.UTF8, true, BufferSize))
        {
            String line;
            while ((line = await streamReader.ReadLineAsync()) != null)
            {
                if(line == "----------")
                {
                    appendQuestion = true;
                    continue;
                }

                if (!appendQuestion)
                {
                    dbContext.Cards.Add(new CardDb(appendQuestion)
                    {
                        AnswerCount = 0,
                        IsEmpty = false,
                    });
                }
                else
                {
                    int count = line.Count(f => f == '_');
                    if(count == 0)
                    {
                        count = 1;
                    }
                    dbContext.Cards.Add(new CardDb(appendQuestion)
                    {
                      
                        AnswerCount = count,
                        IsEmpty = false,
                    });

                }


                cardId++;
            }
        }

        await dbContext.SaveChangesAsync();

        return Ok();
    }
}