namespace BadCards.Api.Models.Api.Creator;

[Serializable]
public class CreatorOptions
{
    public required string DefaultPrompt { get; set; }
    public required int MaxGenerations { get; set; }
    public required float Temperature { get; set; }
}