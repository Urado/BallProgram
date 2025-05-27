using BallProgramServer.PlaylistDomain.Domain.Entities;

namespace BallProgramServer.PlaylistDomain.Aplication.Interfaces;

public interface IPlayerPlaylistService
{
    Task SaveOrUpdatePlaylistAsync(Guid id, Playlist playlist);
}