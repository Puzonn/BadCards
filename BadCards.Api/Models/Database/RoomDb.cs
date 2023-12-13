using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BadCards.Api.Models.Database;

[Serializable]
public class RoomDb
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public uint RoomId { get; set; }
    public long OwnerId { get; set; }
    public int PlayersCount { get; set; }
    public bool GameStarted { get; set; }
    public string LobbyCode { get; set; }
    public string? Password { get; set; }

    public ApiRoom ToApi() => new ApiRoom()
    {
        RoomId = RoomId,
        PlayersCount = PlayersCount,
        GameStarted = GameStarted,
        LobbyCode = LobbyCode,
    };
}