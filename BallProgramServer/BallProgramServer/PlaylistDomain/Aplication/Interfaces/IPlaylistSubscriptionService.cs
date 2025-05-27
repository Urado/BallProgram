namespace BallProgramServer.PlaylistDomain.Aplication.Interfaces;

public interface IPlaylistSubscriptionService
{
    Task SubscribeAsync(string playlistId, string connectionId);
    Task UnsubscribeAsync(string playlistId, string connectionId);
    Task UnsubscribeAllAsync(string connectionId);
}