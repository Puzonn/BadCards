namespace BadCards.Api.Models.Hub.Events;

[Serializable]
public class OnJudgeSelectCardEvent : OnNextRoundVoteEvent
{
    public required uint SelectedCardId { get; set; }
}