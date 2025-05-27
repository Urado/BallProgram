using System.Collections.Concurrent;
using BallProgramServer.Hubs;
using BallProgramServer.PlaylistDomain.Aplication.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace BallProgramServer.PlaylistDomain.Infrastructure.SignalR;

public class PlaylistSubscriptionService : IPlaylistSubscriptionService
{
    private readonly IHubContext<GuestHub> _guestHub;
    private static readonly ConcurrentDictionary<string, HashSet<string>> _subscribers = new();

    public PlaylistSubscriptionService(IHubContext<GuestHub> guestHub) => _guestHub = guestHub;

    public async Task SubscribeAsync(string playlistId, string connectionId)
    {
        await _guestHub.Groups.AddToGroupAsync(connectionId, playlistId);
        _subscribers.AddOrUpdate(playlistId, [connectionId], (_, set) => { set.Add(connectionId); return set; });
    }

    public async Task UnsubscribeAsync(string playlistId, string connectionId)
    {
        await _guestHub.Groups.RemoveFromGroupAsync(connectionId, playlistId);
        if (_subscribers.TryGetValue(playlistId, out var subscribers))
        {
            subscribers.Remove(connectionId); 
            if (subscribers.Count == 0) _subscribers.TryRemove(playlistId, out _);
        }
    }

    public async Task UnsubscribeAllAsync(string connectionId)
    {
        foreach (var (playlistId, _) in _subscribers.Where(x => x.Value.Contains(connectionId)))
            await UnsubscribeAsync(playlistId, connectionId);
    }
}