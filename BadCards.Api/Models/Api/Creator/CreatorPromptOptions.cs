namespace BadCards.Api.Models.Api.Creator;

[Serializable]
public class CreatorPromptOptions
{
    public string AdditionalPromptNote { get; set; }   
    public required bool GenerateAnswers { get; set; }
    public required bool GenerateQuestion { get; set; }
}