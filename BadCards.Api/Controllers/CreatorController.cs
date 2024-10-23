using BadCards.Api.Database;
using BadCards.Api.Models.Api.Creator;
using BadCards.Api.Models.Database;
using BadCards.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OpenAI_API;
using OpenAI_API.Models;

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

    private const int MAX_TOKENS = 200;

    private readonly string test = "[\r\n    {\r\n        \"question\": \"What is the best thing about being a cat?\",\r\n        \"answerCount\": 0,\r\n        \"tokensUsed\": 0,\r\n        \"answers\": [\r\n            \"You can sleep all day and no one judges you\",\r\n            \"You can destroy furniture without consequences\",\r\n            \"You can pretend to be aloof and mysterious\"\r\n        ]\r\n    },\r\n    {\r\n        \"question\": \"What's the secret ingredient to a successful relationship?\",\r\n        \"answerCount\": 0,\r\n        \"tokensUsed\": 0,\r\n        \"answers\": [\r\n            \"A big dose of sarcasm and a pinch of vodka\",\r\n            \"A healthy dose of pettiness and a sprinkle of passive aggressiveness\",\r\n            \"A dash of dark humor and a splash of cynicism\"\r\n        ]\r\n    }\r\n]";

    public CreatorController(ILogger<CreatorController> logger, BadCardsContext context, ICardService cardService, IConfiguration configuration)
    {
        _cardService = cardService;
        _context = context;
        _logger = logger;
        _configuration = configuration;
    }

    [HttpPost("/creator/generate-batch")]
    [Authorize]
    public async Task<ActionResult<CreatorGenerationResult[]>> GenerateBatchCards([FromBody] CreatorPromptOptions options)
    {
        if(options.BatchCount > 5 ||  options.BatchCount < 0)
        {
            return BadRequest("Invalid BatchCount");
        }

        return JsonConvert.DeserializeObject<CreatorGenerationResult[]>(test);

        List<CreatorGenerationResult> results = new List<CreatorGenerationResult>(options.BatchCount);

        OpenAIAPI api = new(new APIAuthentication(_configuration["OpenAI:Key"]));

        var completionRequest = new OpenAI_API.Completions.CompletionRequest()
        {
            Model = Model.ChatGPTTurboInstruct,
            Prompt = $"{DefaultPrompt} {DefaultJsonPrompt} {options.AdditionalPromptNote}",
            MaxTokens = MAX_TOKENS,
            Temperature = DefaultTemperature,
        };

        for(int i = 0; i < options.BatchCount; i++)
        {
            _logger.LogInformation($"Generating {i} response");

            var completionResult = await api.Completions.CreateCompletionAsync(completionRequest);

            string responseText = completionResult.Completions[0].Text;

            try
            {
                CreatorGenerationResult? result = JsonConvert.DeserializeObject<CreatorGenerationResult>(responseText);
                result.TokensUsed = completionResult.Usage.CompletionTokens;
                result.AnswerCount = _cardService.GetAnswerCount(result.Question);

                if(result is null)
                {
                    continue;
                }

                results.Add(result);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.ToString());
                continue;
            }
        }

        return Ok(results);
    }

    [HttpPost("/creator/generate")]
    [Authorize]
    public async Task<ActionResult<CreatorGenerationResult>> GenerateCard([FromBody] CreatorPromptOptions options)
    {
        if(options.UseBatch)
        {
            return BadRequest("Use /creator/generate-batch");
        }

        OpenAIAPI api = new(new APIAuthentication(_configuration["OpenAI:Key"]));

        var completionRequest = new OpenAI_API.Completions.CompletionRequest()
        {   
            Model = Model.ChatGPTTurboInstruct,
            Prompt = $"{DefaultPrompt} {DefaultJsonPrompt} {options.AdditionalPromptNote}",
            MaxTokens = MAX_TOKENS,
            Temperature = DefaultTemperature,
        };

        var completionResult = await api.Completions.CreateCompletionAsync(completionRequest);

        string responseText = completionResult.Completions[0].Text;

        try
        {

            CreatorGenerationResult? result = JsonConvert.DeserializeObject<CreatorGenerationResult>(responseText);

            if(result is not null)
            {
                result.TokensUsed = completionResult.Usage.CompletionTokens;
                result.AnswerCount = _cardService.GetAnswerCount(result.Question);

                return result;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.ToString());
        }

        return Problem("Error while deserializing response text");
    }

    [Authorize]
    [HttpPut("/creator/accept")]
    public async Task<ActionResult<bool>> AcceptPrompt([FromBody] CreatorGenerationResult prompt)
    {
        // CardDb question = new CardDb(true)
        // {
        //     AnswerCount = prompt.AnswerCount,
        // };
        //
        // /* First we put card to db to get next cardId and then we put translations */
        // List<CardDb> answers = new List<CardDb>();
        //
        // foreach (var answer in prompt.Answers)
        // {
        //     CardDb answerDb = new CardDb(false);
        //
        //     await _context.AddAsync(answerDb);
        //     answers.Add(answerDb);
        // }
        //
        // await _context.SaveChangesAsync();
        //
        // /* Now put translations */
        // for (int i = 0; i < answers.Count; i++)
        // {
        //     CardTranslationDb cardTranslation = new CardTranslationDb()
        //     {
        //         CardId = answers[i].CardId,
        //         Locale = "us",
        //         Translation = prompt.Answers[i]
        //     };
        //
        //     await _context.CardTranslations.AddAsync(cardTranslation);
        // }
        //
        // await _context.SaveChangesAsync();

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