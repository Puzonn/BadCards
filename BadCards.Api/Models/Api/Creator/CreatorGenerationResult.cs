namespace BadCards.Api.Models.Api.Creator;

[Serializable]
public class CreatorGenerationResult
{
    public required string Question { get; set; }
    public int AnswerCount { get; set; }
    public short TokensUsed { get; set; }
    public List<string> Answers { get; set; } = new List<string>();
}