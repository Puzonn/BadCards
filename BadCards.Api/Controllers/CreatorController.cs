using BadCards.Api.Database;
using BadCards.Api.Models.Api.Creator;
using BadCards.Api.Models.Database;
using BadCards.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OpenAI_API;

namespace BadCards.Api.Controllers;

[Controller]
public class CreatorController : ControllerBase
{
    private readonly ILogger<CreatorController> _logger;
    private readonly ICardService _cardService;
    private readonly BadCardsContext _context;
    private IConfiguration _configuration;

    private readonly string DefaultPrompt = "Provide valid json output. Generate a funny and irreverent phrase suitable for a Cards Against Humanity.";

    private readonly string DefaultJsonPrompt = "Example json {\"\"Question\"\": \"\"...\"\",\r\n \"\"Answers\"\": [\r\n \"\"...\"\",\r\n \"\"...\"\",\r\n ]}";

    private readonly float DefaultTemperature = 0.7f;

    private readonly string test = "{\r\n\"Question\": \"What is the best way to get out of a bad date?\",\r\n\"Answers\": [\r\n\"Order a pizza and pretend it's your ex's name on the box.\",\r\n\"Fake an emergency call from your imaginary cat.\",\r\n\"Start loudly singing 'All By Myself' until your date gets the hint.\"\r\n]\r\n}";

    public CreatorController(ILogger<CreatorController> logger, BadCardsContext context, ICardService cardService, IConfiguration configuration)
    {
        _cardService = cardService;
        _context = context;
        _logger = logger;
        _configuration = configuration;
    }

    [HttpPost("/creator/generate")]
    [Authorize]
    public async Task<ActionResult<CreatorGenerationResult>> CreateCard([FromBody] CreatorPromptOptions options)
    {
        OpenAIAPI api = new(new APIAuthentication(_configuration["OpenAI:Key"]));
            
        var completionRequest = new OpenAI_API.Completions.CompletionRequest()
        {   
            Model = OpenAI_API.Models.Model.ChatGPTTurboInstruct,
            Prompt = $"{DefaultPrompt} {DefaultJsonPrompt} {options.AdditionalPromptNote}",
            MaxTokens = 200,
            Temperature = DefaultTemperature,
        };

        var result = await api.Completions.CreateCompletionAsync(completionRequest);

        string responseText = result.Completions[0].Text;

        return Ok(JsonConvert.DeserializeObject<CreatorGenerationResult>(responseText));
    }

    [Authorize]
    [HttpPut("/creator/accept")]
    public async Task<ActionResult<bool>> AcceptPrompt([FromBody] CreatorGenerationResult prompt)
    {
        CardDb question = new CardDb(true)
        {
            AnswerCount = prompt.AnswerCount,
        };
        
        /* First we put card to db to get next cardId and then we put translations */
        List<CardDb> answers = new List<CardDb>();

        foreach (var answer in prompt.Answers)
        {
            CardDb answerDb = new CardDb(false);

            await _context.AddAsync(answerDb);
            answers.Add(answerDb);
        }

        await _context.SaveChangesAsync();

        /* Now put translations */
        for (int i = 0; i < answers.Count; i++)
        {
            CardTranslationDb cardTranslation = new CardTranslationDb()
            {
                CardId = answers[i].CardId,
                Locale = "us",
                Translation = prompt.Answers[i]
            };

            await _context.CardTranslations.AddAsync(cardTranslation);
        }

        await _context.SaveChangesAsync();

        return true;
    }

    [Authorize]
    [HttpGet("/creator/options")]
    public ActionResult<CreatorOptions> Options()
    {
        return Ok
        (
            new CreatorOptions()
            {
                DefaultPrompt = DefaultPrompt,
                MaxGenerations = 4,
                Temperature = DefaultTemperature
            }
        );
    }
}