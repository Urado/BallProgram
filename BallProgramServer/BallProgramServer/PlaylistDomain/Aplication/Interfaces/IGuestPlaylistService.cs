using BallProgramServer.PlaylistDomain.Domain.Entities;

namespace BallProgramServer.PlaylistDomain.Aplication.Interfaces;

public interface IGuestPlaylistService
{
    Task<Playlist?> GetPlaylistAsync(Guid id);
    Task<IReadOnlyCollection<Playlist>> GetAllPlaylistsAsync();
}
