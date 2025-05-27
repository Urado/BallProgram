using BallProgramServer.PlaylistDomain.Aplication.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace BallProgramServer.Hubs;

public class GuestHub : Hub
{
    private readonly IPlaylistSubscriptionService _subscriptionService;

    public GuestHub(IPlaylistSubscriptionService subscriptionService) => _subscriptionService = subscriptionService;

    public async Task SubscribeToPlaylist(string playlistId) => 
        await _subscriptionService.SubscribeAsync(playlistId, Context.ConnectionId);

    public async Task UnsubscribeFromPlaylist(string playlistId) => 
        await _subscriptionService.UnsubscribeAsync(playlistId, Context.ConnectionId);

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await _subscriptionService.UnsubscribeAllAsync(Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }
}
