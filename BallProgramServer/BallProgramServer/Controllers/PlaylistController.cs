using BallProgramServer.PlaylistDomain.Domain.Entities;
using BallProgramServer.PlaylistDomain.Domain.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace BallProgramServer.Controllers;
[ApiController]
[Route("[controller]")]
public class PlaylistController(IPlaylistRepository _playlistRepository) : ControllerBase
{
    [HttpGet]
    [Route("[action]")]
    public async Task<List<Playlist>> GetAll()
    {
        var playlists = await _playlistRepository.GetAllPlaylistsAsync();
        return playlists.ToList();
    }
    
    [HttpPut]
    [Route("[action]")]
    public async Task PutTest()
    {
        var nodeId = Guid.NewGuid();
        var playlistId = Guid.NewGuid();
        var playlist = new Playlist
        {
            Id = playlistId,
            Title = "Test Playlist",
            Tracks =
            [
                new TrackNode
                {
                    Id = Guid.NewGuid(),
                    Title = "Test Track1",
                    Duration = 3000,
                    PlaylistId = playlistId
                },
                new GroupNode
                {
                    Id = nodeId,
                    Title = "Test Group",
                    Children =
                    [
                        new TrackNode
                        {
                            Id = Guid.NewGuid(),
                            Title = "Test Track2",
                            Duration = 3000,
                            PlaylistId = playlistId,
                            ParentId = nodeId,
                        },
                        new TrackNode
                        {
                            Id = Guid.NewGuid(),
                            Title = "Test Track3",
                            Duration = 3000,
                            PlaylistId = playlistId,
                            ParentId = nodeId,
                        }
                    ]
                }
            ],
        };
        
        await _playlistRepository.CreatePlaylistAsync(playlist);
    }

    [HttpDelete]
    [Route("[action]")]
    public async Task DeleteAll()
    {
        var playlists = await _playlistRepository.GetAllPlaylistsAsync();
        foreach (var p in playlists)
        {
            await _playlistRepository.DeletePlaylistAsync(p.Id);
        }
    }
}