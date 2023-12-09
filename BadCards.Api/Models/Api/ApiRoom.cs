using System.ComponentModel.DataAnnotations;

namespace BadCards.Api.Models;

[Serializable]
public class ApiRoom
{
    [Key]
    public uint RoomId { get; set; }
    public int PlayersCount { get; set; }
    public bool GameStarted { get; set; }
    public string LobbyCode { get; set; }
}