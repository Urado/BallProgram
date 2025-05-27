namespace BallProgramServer.PlaylistDomain.Domain.Entities;

public class GroupNode : BaseNode
{
    public List<BaseNode> Children { get; set; } = [];
    public string Type => "group";
}