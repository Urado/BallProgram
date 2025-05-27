using BallProgramServer.PlaylistDomain.Domain.Entities;

namespace BallProgramServer.PlaylistDomain.Domain.Repositories;

public interface IPlaylistRepository
{
    Task<List<Playlist>> GetAllPlaylistsAsync();
    Task<Playlist?> GetPlaylistByIdAsync(Guid id);
    Task<Playlist?> CreatePlaylistAsync(Playlist playlist);
    Task<Playlist?> UpdatePlaylistAsync(Playlist playlist);
    Task DeletePlaylistAsync(Guid id);
}