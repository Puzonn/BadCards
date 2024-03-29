﻿using BadCards.Api.Database;
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
    private readonly BadCardsContext dbContext;

    public GameController(BadCardsContext _dbContext)
    {
        dbContext = _dbContext;
    }

    [Authorize]
    [HttpPost("/game/create")]
    public async Task<ActionResult<ApiRoom>> CreateGame([FromBody] string? password)
    {
        var identity = (ClaimsIdentity)HttpContext.User!.Identity!;
        var role = identity.FindFirst(ClaimTypes.Role)!.Value;
        var userId = uint.Parse(identity.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        if(string.IsNullOrEmpty(role) || role == UserRoles.Guest) 
        {
            return BadRequest("User have to be atleast DiscordUser");
        }

        UserDb user = await dbContext.Users.Where(x => x.Id == uint.Parse(identity.FindFirst(ClaimTypes.NameIdentifier)!.Value.ToString())).SingleAsync();

        if (RoomHub.HasLobby(user.Id, out Room? room))
        {            
            if(room is null)
            {
                throw new InvalidOperationException("Room was null");
            }

            RoomDb dbRoom = dbContext.Rooms.Where(x => x.RoomId == room.RoomId).Single();

            return Ok(JsonSerializer.Serialize(dbRoom.ToApi()));
        }

        RoomDb roomDb = new RoomDb()
        {
            ListedPlayers = new List<ListedPlayer>
            {
                new ListedPlayer(userId, isOwner: true, isGuest: false, isBlacklisted: false)
            },
            OwnerId = user.Id,
            GameStarted = false,
            LobbyCode = GenerateRandomString(8),
            PlayersCount = 0,
            Password = password,
        };

        ApiRoom apiRoom = roomDb.ToApi();

        await dbContext.Rooms.AddAsync(roomDb);
        await dbContext.SaveChangesAsync();

        return Ok(JsonSerializer.Serialize(apiRoom));
    }

    [Authorize]
    [HttpPost("/game/join")]
    public async Task<ActionResult<ApiRoom>> JoinGame([FromBody] RoomCreateModel model)
    {
        var room = await dbContext.Rooms.Where(x => x.LobbyCode == model.LobbyCode).SingleOrDefaultAsync();

        if (room is null)
        {
            return BadRequest("Lobby does not exist");
        }

        if (!string.IsNullOrEmpty(room.Password))
        {
            var identity = (ClaimsIdentity)HttpContext.User!.Identity!;
            uint userId = uint.Parse(identity.FindFirst(ClaimTypes.NameIdentifier)!.Value.ToString());

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