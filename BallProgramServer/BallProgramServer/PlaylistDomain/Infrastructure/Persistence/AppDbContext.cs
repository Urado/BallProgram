using BallProgramServer.PlaylistDomain.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BallProgramServer.PlaylistDomain.Infrastructure.Persistence;

public class PlaylistDbContext(DbContextOptions<PlaylistDbContext> options) : DbContext(options)
{
    public DbSet<BaseNode> Nodes => Set<BaseNode>();
    public DbSet<GroupNode> Groups => Set<GroupNode>();
    public DbSet<TrackNode> Tracks => Set<TrackNode>();
    public DbSet<Playlist> Playlists => Set<Playlist>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BaseNode>()
            .HasDiscriminator<string>("NodeType")
            .HasValue<TrackNode>("track")
            .HasValue<GroupNode>("group");

        modelBuilder.Entity<GroupNode>()
            .HasMany(g => g.Children)
            .WithOne(b => b.Parent)
            .HasForeignKey(b => b.ParentId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Playlist>()
            .HasMany(p => p.Tracks)
            .WithOne()
            .HasForeignKey(p => p.PlaylistId);
    }
}