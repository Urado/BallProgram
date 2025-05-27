using BallProgramServer.PlaylistDomain.Domain.Entities;
using BallProgramServer.PlaylistDomain.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace BallProgramServer.PlaylistDomain.Infrastructure.Persistence.Repositories;

public class PlaylistRepository(PlaylistDbContext _context) : IPlaylistRepository
{
    public async Task<List<Playlist>> GetAllPlaylistsAsync()
    {
        var playlists = await _context.Playlists.ToListAsync();

        foreach (var playlist in playlists)
        {
            await EnrichNode(playlist);
        }

        return playlists;
    }

    private async Task EnrichNode(Playlist playlist)
    {
        var tracks = await _context.Nodes
            .Where(t => t.PlaylistId == playlist.Id)
            .Include(g => g.Parent)
            .ToListAsync();
        
        playlist.Tracks = tracks.Where(t => t.Parent == null).ToList();
    }

    public async Task<Playlist?> GetPlaylistByIdAsync(Guid id)
    {
        var playlist = await _context.Playlists.FirstOrDefaultAsync(p => p.Id == id);
        
        if (playlist == null)
            return null;
        await EnrichNode(playlist);
        
        return playlist;
    }

    public async Task<Playlist?> CreatePlaylistAsync(Playlist playlist)
    {
        _context.Playlists.Add(playlist);
        await _context.SaveChangesAsync();
        return playlist;
    }

    public async Task<Playlist?> UpdatePlaylistAsync(Playlist playlist)
    {
        if (_context.Playlists.Any(p => p.Id == playlist.Id)) 
            _context.Playlists.Update(playlist);
        else
            _context.Playlists.Add(playlist);
        await _context.SaveChangesAsync();
        return playlist;
    }

    public async Task DeletePlaylistAsync(Guid id)
    {
        var playlist = await _context.Playlists
            .Include(p => p.Tracks)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (playlist is null)
            return;

        _context.Nodes.RemoveRange(playlist.Tracks);
        _context.Playlists.Remove(playlist);
        await _context.SaveChangesAsync();
    }
}
