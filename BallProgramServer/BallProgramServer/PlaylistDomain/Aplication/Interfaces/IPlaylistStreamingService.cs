using BallProgramServer.PlaylistDomain.Aplication.DTO;

namespace BallProgramServer.PlaylistDomain.Aplication.Interfaces;

public interface IPlaylistStreamingService
{
    Task StartStreamingAsync(string playlistId, string connectionId);
    Task StopStreamingAsync(string playlistId);
    Task SendPlaybackStatusAsync(PlaybackStatus status);
    bool IsPlaylistStreaming(string playlistId);
}