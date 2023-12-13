namespace BadCards.Api.Models.Api;

[Serializable]
public class RoomCreateModel
{
    public string LobbyCode { get; set; }
    public string? Password { get; set; }
}