namespace BadCards.Api.Models.Hub.Events;

[Serializable]
public class OnNextRoundVoteEvent
{
    public required int TotalVotes { get; set; }  
    public required int SufficientVotes { get; set; }
}