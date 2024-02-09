using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BadCards.Api.Models;

[Serializable]
public class ApiRoom
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public uint RoomId { get; set; }
    public int PlayersCount { get; set; }
    public bool GameStarted { get; set; }
    public string LobbyCode { get; set; }
}