using BallProgramServer.PlaylistDomain.Aplication.Interfaces;
using BallProgramServer.PlaylistDomain.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace BallProgramServer.Controllers;

[ApiController]
[Route("api/player/playlist")]
public class PlayerPlaylistController : ControllerBase
{
    private readonly IPlayerPlaylistService _playlistService;

    public PlayerPlaylistController(IPlayerPlaylistService playlistService)
    {
        _playlistService = playlistService;
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> SetPlaylist(Guid id, [FromBody] Playlist playlist)
    {
        await _playlistService.SaveOrUpdatePlaylistAsync(id, playlist);
        return Ok();
    }
}