namespace BadCards.Api.Models.Hub.Events;

[Serializable]
public class OnWaitingForJudge
{
    public required IEnumerable<Card> LobbySelectedCards { get; set; }   
}