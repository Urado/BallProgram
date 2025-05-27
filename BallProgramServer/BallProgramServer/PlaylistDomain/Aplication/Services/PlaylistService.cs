using BallProgramServer.PlaylistDomain.Aplication.Interfaces;
using BallProgramServer.PlaylistDomain.Domain.Entities;
using BallProgramServer.PlaylistDomain.Domain.Repositories;

namespace BallProgramServer.PlaylistDomain.Aplication.Services;

public class PlaylistService : IPlayerPlaylistService, IGuestPlaylistService
{
    private IPlaylistRepository _playlistRepository;

    public PlaylistService(IPlaylistRepository playlistRepository)
    {
        _playlistRepository = playlistRepository;
    }

    public async Task SaveOrUpdatePlaylistAsync(Guid id, Playlist playlist)
    {
        UpdateLinks(playlist);
        if (playlist.Id != Guid.Empty)
            await _playlistRepository.UpdatePlaylistAsync(playlist);
        else
            await _playlistRepository.CreatePlaylistAsync(playlist);
    }

    private void UpdateLinks(Playlist playlist)
    {
        foreach (var track in playlist.Tracks)
        {
            UpdateLinksRecursively(track,null, playlist);
        }
    }

    private void UpdateLinksRecursively(BaseNode node, GroupNode? parent, Playlist playlist)
    {
        node.PlaylistId = playlist.Id;
        
        if (parent is not null)
        {
            node.Parent = parent;
            node.ParentId = parent.Id;
        }

        if (node is GroupNode groupNode)
        {
            foreach (var child in groupNode.Children)
            {
                UpdateLinksRecursively(child, groupNode, playlist);
            }
        }
    }

    public async Task<Playlist?> GetPlaylistAsync(Guid id)
    {
        var playlist = await _playlistRepository.GetPlaylistByIdAsync(id);
        return playlist;
    }

    public async Task<IReadOnlyCollection<Playlist>> GetAllPlaylistsAsync()
    {
        var playlists = await _playlistRepository.GetAllPlaylistsAsync();
        return playlists;
    }
}