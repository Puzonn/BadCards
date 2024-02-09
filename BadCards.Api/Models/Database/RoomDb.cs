using Microsoft.EntityFrameworkCore;
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
    public List<ListedPlayer> ListedPlayers { get; set; }

    public ApiRoom ToApi() => new ApiRoom()
    {
        RoomId = RoomId,
        PlayersCount = PlayersCount,
        GameStarted = GameStarted,
        LobbyCode = LobbyCode,
    };
}

public class ListedPlayer
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public uint LobbyId { get; set; }  
    public uint UserId { get; set; } 
    public bool IsOwner { get; set; }   
    public bool IsGuest { get; set; }   
    public bool Blacklisted { get; set; }

    public ListedPlayer()
    {

    }

    public ListedPlayer(uint userId, bool isOwner, bool isGuest, bool isBlacklisted)
    {
        UserId = userId;
        IsOwner = isOwner;
        IsGuest = isGuest;
        Blacklisted = isBlacklisted;
    }
}