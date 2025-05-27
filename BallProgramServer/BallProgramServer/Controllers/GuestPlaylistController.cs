using BallProgramServer.PlaylistDomain.Aplication.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BallProgramServer.Controllers;

[ApiController]
[Route("api/guest/playlist")]
public class GuestPlaylistController : ControllerBase
{
    private readonly IGuestPlaylistService _playlistService;

    public GuestPlaylistController(IGuestPlaylistService playlistService)
    {
        _playlistService = playlistService;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPlaylist(Guid id)
    {
        var playlist = await _playlistService.GetPlaylistAsync(id);
        if (playlist == null)
            return NotFound();

        return Ok(playlist);
    }
    
    [HttpGet("all")]
    public async Task<IActionResult> GetAllPlaylist()
    {
        var playlist = await _playlistService.GetAllPlaylistsAsync();

        return Ok(playlist);
    }
}