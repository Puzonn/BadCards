namespace BadCards.Api.Models.Api.Creator;

[Serializable]
public class CreatorPromptOptions
{
    public string AdditionalPromptNote { get; set; }   
    public required bool GenerateAnswers { get; set; }
    public required bool GenerateQuestion { get; set; }
    public required bool UseBatch { get; set; }
    public required int BatchCount { get; set; }   
}