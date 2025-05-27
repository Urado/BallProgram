namespace BallProgramServer.PlaylistDomain.Domain.Entities;

public class TrackNode : BaseNode
{
    public double Duration { get; set; }
    public string Type => "track";
}