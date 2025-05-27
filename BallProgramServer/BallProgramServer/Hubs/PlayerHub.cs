using BallProgramServer.PlaylistDomain.Aplication.DTO;
using BallProgramServer.PlaylistDomain.Aplication.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace BallProgramServer.Hubs;

public class PlayerHub : Hub
{
    private readonly IPlaylistStreamingService _streamingService;

    public PlayerHub(IPlaylistStreamingService streamingService) => _streamingService = streamingService;

    public async Task StartStreaming(string playlistId) => 
        await _streamingService.StartStreamingAsync(playlistId, Context.ConnectionId);

    public async Task StopStreaming(string playlistId) => 
        await _streamingService.StopStreamingAsync(playlistId);

    public async Task SendPlaybackStatus(PlaybackStatus status) => 
        await _streamingService.SendPlaybackStatusAsync(status);

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await _streamingService.StopStreamingAsync(Context.ConnectionId); // Остановить все стримы этого плеера
        await base.OnDisconnectedAsync(exception);
    }
}
