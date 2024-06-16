namespace BadCards.Api.Models.Hub.Events;

[Serializable]
public class OnJudgeSelectCardEvent
{
    public required uint CardOwnerId { get; set; }
}