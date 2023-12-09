using BadCards.Api.Models.Database;

namespace BadCards.Api.Models.Hub.Events;

[Serializable]
public class OnNextRoundEvent
{
    public required IEnumerable<Card> WhiteCards { get; set; }
    public required IEnumerable<ApiPlayer> Players { get; set; }
    public required Card BlackCard { get; set; }
    public required bool IsJudge { get; set; }
    public required bool IsWaitingForJudge { get; set; }
    public required bool IsWaitingForNextRound { get; set; }
    public required string? JudgeUsername { get; set; }
}
