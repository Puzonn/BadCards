using BadCards.Api.Database;
using BadCards.Api.Models;
using BadCards.Api.Models.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace BadCards.Api.Controllers;

[ApiController]
public class GameController : ControllerBase
{
    private readonly BadCardsContext dbContext;

    public GameController(BadCardsContext _dbContext)
    {
        dbContext = _dbContext;
    }

    [HttpPost("/game/create")]
    public async Task<ActionResult<ApiRoom>> CreateGame()
    {
        ApiRoom room = new ApiRoom()
        {
            GameStarted = false,
            LobbyCode = GenerateRandomString(8),
            PlayersCount = 0,
        };

        RoomDb roomDb = new RoomDb()
        {
            GameStarted = false,
            LobbyCode = room.LobbyCode,
            PlayersCount = room.PlayersCount,
        };

        await dbContext.Rooms.AddAsync(roomDb);
        await dbContext.SaveChangesAsync();

        return Ok(JsonSerializer.Serialize(room));
    }

    [Authorize]
    [HttpPost("/game/join")]
    public async Task<ActionResult<ApiRoom>> JoinGame([FromQuery] string lobbyCode)
    {
        var room = await dbContext.Rooms.Where(x => x.LobbyCode == lobbyCode).SingleOrDefaultAsync();

        if (room is null)
        {
            return BadRequest();
        }

        return Ok(JsonSerializer.Serialize(room));
    }

    const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    private static string GenerateRandomString(int len) => new string(Enumerable.Repeat(chars, len)
        .Select(s => s[Random.Shared.Next(s.Length)]).ToArray());
}