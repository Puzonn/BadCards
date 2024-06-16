namespace BadCards.Api.Models.Hub.Events;

[Serializable]
public class OnSelectCardEvent
{
    public required bool ShowSelectedCards { get; set; }
    public required bool IsWaitingForNextRound { get; set; }
    public required bool IsWaitingForJudge { get; set; }
    public required bool HasSelectedRequired { get; set; } 
}