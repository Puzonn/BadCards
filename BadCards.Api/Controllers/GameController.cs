using BadCards.Api.Database;
using BadCards.Api.Hubs;
using BadCards.Api.Models;
using BadCards.Api.Models.Api;
using BadCards.Api.Models.Database;
using BadCards.Api.Models.Hub;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;

namespace BadCards.Api.Controllers;

[ApiController]
public class GameController : ControllerBase
{
    private readonly BadCardsContext _dbContext;
    private readonly IConfiguration _configuration;

    public GameController(BadCardsContext dbContext, IConfiguration configuration)
    {
        _dbContext = dbContext;
        _configuration = configuration;
    }

    [Authorize]
    [HttpPost("/game/create")]
    public async Task<ActionResult<ApiRoom>> CreateGame([FromBody] string? password)
    {
        var identity = (ClaimsIdentity)HttpContext.User!.Identity!;
        string role = identity.FindFirst(ClaimTypes.Role)!.Value;

        Guid userId = new Guid(identity.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        if(string.IsNullOrEmpty(role) || role == Roles.Guest) 
        {
            return BadRequest("User have to be atleast DiscordUser");
        }

        UserDb user = await _dbContext.Users.Where(x => x.UserId == new Guid(identity.FindFirst(ClaimTypes.NameIdentifier)!.Value)).SingleAsync();

        if (RoomHub.HasLobby(user.UserId, out Room? room))
        {            
            if(room is null)
            {
                throw new InvalidOperationException("Room was null");
            }

            RoomDb dbRoom = _dbContext.Rooms.Where(x => x.RoomId == room.RoomId).Single();

            return Ok(JsonSerializer.Serialize(dbRoom.ToApi()));
        }

        RoomDb roomDb = new RoomDb()
        {
            OwnerId = user.UserId,
            GameStarted = false,
            LobbyCode = GenerateRandomString(8),
            PlayersCount = 0,
            Password = password,
        };

        ApiRoom apiRoom = roomDb.ToApi();

        await _dbContext.Rooms.AddAsync(roomDb);
        await _dbContext.SaveChangesAsync();

        return Ok(JsonSerializer.Serialize(apiRoom));
    }

    [Authorize]
    [HttpGet("/game/create-role-check")]
    public ActionResult<bool> CreateRoleCheck()
    {
        var identity = (ClaimsIdentity)HttpContext.User!.Identity!;
        string role = identity.FindFirst(ClaimTypes.Role)!.Value;
        bool option = bool.Parse(_configuration.GetSection("Features:AllowGuestCreateLobby").Value!);

        if (option)
        {
            return true;
        }

        if(!option && role == Roles.Guest)
        {
            return false;
        }

        return true;
    }

    [Authorize]
    [HttpPost("/game/join")]
    public async Task<ActionResult<ApiRoom>> JoinGame([FromBody] RoomCreateModel model)
    {
        var room = await _dbContext.Rooms.Where(x => x.LobbyCode == model.LobbyCode).SingleOrDefaultAsync();

        if (room is null)
        {
            return BadRequest("Lobby does not exist");
        }

        if (!string.IsNullOrEmpty(room.Password))
        {
            var identity = (ClaimsIdentity)HttpContext.User!.Identity!;
            Guid userId = new Guid(identity.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            if (room.OwnerId == userId)
            {
                return Ok(JsonSerializer.Serialize(room));
            }
            else if (string.IsNullOrEmpty(model.Password) && room.Password != model.Password)
            {
                return BadRequest("Incorrect password");
            }
        }

        return Ok(JsonSerializer.Serialize(room));
    }

    const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    private static string GenerateRandomString(int len) => new string(Enumerable.Repeat(chars, len)
        .Select(s => s[Random.Shared.Next(s.Length)]).ToArray());
}