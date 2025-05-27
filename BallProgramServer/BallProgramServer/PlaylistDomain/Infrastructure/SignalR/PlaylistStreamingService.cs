using System.Collections.Concurrent;
using BallProgramServer.Hubs;
using BallProgramServer.PlaylistDomain.Aplication.DTO;
using BallProgramServer.PlaylistDomain.Aplication.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace BallProgramServer.PlaylistDomain.Infrastructure.SignalR;

public class PlaylistStreamingService : IPlaylistStreamingService
{
    private readonly IHubContext<GuestHub> _guestHub;
    private static readonly ConcurrentDictionary<string, string> ActiveStreams = new();

    public PlaylistStreamingService(IHubContext<GuestHub> guestHub) => _guestHub = guestHub;

    public async Task StartStreamingAsync(string playlistId, string connectionId)
    {
        ActiveStreams[playlistId] = connectionId;
        await _guestHub.Clients.Group(playlistId).SendAsync("StreamingStarted", playlistId);
    }

    public async Task StopStreamingAsync(string playlistId)
    {
        if (ActiveStreams.TryRemove(playlistId, out _))
            await _guestHub.Clients.Group(playlistId).SendAsync("StreamingStopped", playlistId);
    }

    public async Task SendPlaybackStatusAsync(PlaybackStatus status) =>
        await _guestHub.Clients.Group(status.PlaylistId).SendAsync("PlaybackStatusUpdated", status);

    public bool IsPlaylistStreaming(string playlistId) => ActiveStreams.ContainsKey(playlistId);
}