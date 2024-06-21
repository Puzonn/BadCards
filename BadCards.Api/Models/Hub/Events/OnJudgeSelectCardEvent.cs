namespace BadCards.Api.Models.Hub.Events;

[Serializable]
public class OnJudgeSelectCardEvent
{
    public required Guid CardOwnerId { get; set; }
}