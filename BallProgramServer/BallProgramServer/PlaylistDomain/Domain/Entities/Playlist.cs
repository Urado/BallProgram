using System.ComponentModel.DataAnnotations;

namespace BallProgramServer.PlaylistDomain.Domain.Entities;

public class Playlist
{
    [Key]
    public Guid Id { get; init; }
    public string Title { get; set; }
    public List<BaseNode> Tracks { get; set; } = [];
}