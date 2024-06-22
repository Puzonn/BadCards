namespace BadCards.Api.Models.Hub.Events;

[Serializable]
public class JoinEvent
{
    public string LobbyCode { get; set; }
    public string Locale { get; set; } 
}