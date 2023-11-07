﻿using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BallProgramServer.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BallPlaylistController : ControllerBase
{
	private static BallPlaylist _ballPlaylistCache = new BallPlaylist(
			Guid.NewGuid(),
			"Киберпанк, который мы заслужили?",
			 new[] {
				new BallPlaylistDance(1, "Вальс"),
				new BallPlaylistDance(2, "Полька"),
				new BallPlaylistDance(3, "Хурма")
			});
	[HttpGet("{id}")]
	public BallPlaylist Get(Guid id)
	{
		return _ballPlaylistCache;
	}

	[HttpPut]
	public void Put([FromBody] BallPlaylist value)
	{
		_ballPlaylistCache = value;
	}
}

public record BallPlaylist(Guid Id, string Name,
	IReadOnlyList<BallPlaylistDance> Dances);

public record BallPlaylistDance(int number, string Name);
