namespace BadCards.Api.Models.Hub.Events;

[Serializable]
public class OnStartGameEvent
{
    public required IEnumerable<ApiPlayer> Players { get; set; }
    public required IEnumerable<Card> WhiteCards { get; set; }
    public required Card BlackCard { get; set; }
    public required string RoomCode { get; set; }
    public required string JudgeUsername { get; set; }
    public required bool GameStarted { get; set; }
    public required bool IsJudge { get; set; }
    public required int AnswerCount { get; set; }
}