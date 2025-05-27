using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BallProgramServer.PlaylistDomain.Domain.Entities;

public abstract class BaseNode
{
    [Key]
    public Guid Id { get; init; }
    public Guid PlaylistId { get; set; }   
    public string Title { get; set; } = string.Empty;
    public Guid? ParentId { get; set; }
    [JsonIgnore]
    public GroupNode? Parent { get; set; }
    
    public bool? IsLoop { get; set; }
    public bool? IsMuted { get; set; }
    public double? Volume { get; set; }

    public int OrderIndex { get; set; }
}