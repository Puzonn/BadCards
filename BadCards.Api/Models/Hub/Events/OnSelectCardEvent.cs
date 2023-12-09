namespace BadCards.Api.Models.Hub.Events;

public class OnSelectCardEvent
{
    public required IEnumerable<SelectedCard> SelectedCards { get; set; }
    public required bool ShouldDeleteCard { get; set; }
    public required bool ShowSelectedCards { get; set; }
    public required bool IsWaitingForNextRound { get; set; }
    public required bool IsWaitingForJudge { get; set; }
    public required bool HasSelectedRequired { get; set; } 
    public uint? SelectDeletedCard { get; set; }
}