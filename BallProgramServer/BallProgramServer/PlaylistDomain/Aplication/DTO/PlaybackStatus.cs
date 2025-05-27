namespace BallProgramServer.PlaylistDomain.Aplication.DTO;

public record PlaybackStatus(
    string PlaylistId,
    string TrackId,
    int PlaylistVersion,
    double Progress // Прогресс воспроизведения от 0 до 1
    );