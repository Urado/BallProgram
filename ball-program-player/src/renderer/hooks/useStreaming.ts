import { useCallback, useEffect, useState } from 'react';

import { Playlist } from '../../types/playlist';
import { uploadPlaylist } from '../services/api';
import { playerHubService } from '../services/playerHub';

/**
 *
 */
export function useStreaming(
  playlist: Playlist | null,
  currentTrackId: string | null,
  audioRef: React.RefObject<HTMLAudioElement | null>
) {
  const [isStreaming, setIsStreaming] = useState(false);

  const startStreaming = useCallback(async () => {
    if (!playlist) return;
    await uploadPlaylist(playlist.id, playlist);
    await playerHubService.startStreaming(playlist.id);
    setIsStreaming(true);
  }, [playlist]);

  const stopStreaming = useCallback(async () => {
    if (!playlist) return;
    await playerHubService.stopStreaming(playlist.id);
    setIsStreaming(false);
  }, [playlist]);

  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (isStreaming && playlist) {
        await playerHubService.stopStreaming(playlist.id);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isStreaming, playlist]);

  // отправка статуса проигрывания
  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef?.current && isStreaming && currentTrackId && playlist) {
        const progress = audioRef.current.currentTime;
        const duration = audioRef.current.duration;
        const percent = duration === 0 ? 0 : progress / duration;

        playerHubService.sendPlaybackStatus({
          playlistId: playlist.id,
          trackId: currentTrackId,
          playlistVersion: 1,
          progress: percent,
        });
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isStreaming, currentTrackId, playlist, audioRef]);
  return {
    isStreaming,
    startStreaming,
    stopStreaming,
  };
}
