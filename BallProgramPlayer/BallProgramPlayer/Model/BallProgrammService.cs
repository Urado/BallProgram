using System.Text.Json;

namespace BallProgramPlayer.Model;

internal class BallProgrammService
{

	HttpClient _client;
	JsonSerializerOptions _serializerOptions;

	public BallProgrammService()
	{
		_client = new HttpClient();
		_serializerOptions = new JsonSerializerOptions
		{
			PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
			WriteIndented = true
		};
	}

	public async Task NotifyPlayDanceAsync()
	{
		Uri uri = new Uri(
			string.Format($"https://localhost:7104/api/BallPlaylist/",
			string.Empty));
		var ballProgram = new BallPlaylist(
			Guid.NewGuid(),
			"Киберпанк, который мы заслужили?",
			 new[] {
				new BallPlaylistDance(1, "Хурма"),
				new BallPlaylistDance(2, "Хурма"),
				new BallPlaylistDance(3, "Хурма")
			});
		string json = JsonSerializer.Serialize<BallPlaylist>(ballProgram, _serializerOptions);
		StringContent content = new StringContent(json, Encoding.UTF8, "application/json");
		var res = await _client.PutAsync(uri, content);
		Console.WriteLine(res);
	}
}

public record BallPlaylist(Guid Id, string Name,
	IReadOnlyList<BallPlaylistDance> Dances);

public record BallPlaylistDance(int number, string Name);

