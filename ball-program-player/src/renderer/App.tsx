import React, { useState, useRef, useEffect, useMemo } from 'react';
import ControlPanel from './components/ControlPanel';
import SettingsModal from './components/SettingsModal';
import { dialog } from '@electron/remote';
import { ThemeProvider } from 'styled-components';
import { themes } from './theme';
import { PlaylistNode, TrackNode, Playlist } from '../types/playlist';
import { v4 as uuidv4 } from 'uuid';
import PlaylistPage from './components/PlaylistPage';
import { playerHubService } from './services/playerHub';
import { uploadPlaylist } from './services/api';

const App: React.FC = () => {
  const [playlist, setPlaylist] = useState<Playlist| null>(null);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [pauseAfterTime, setPauseAfterTime] = useState<number | null>(null);
  const [trackProgress, setTrackProgress] = useState<number>(0);
  const [themeName, setThemeName] = useState<string>('dark');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const startStreaming = async () => {
    if (!playlist) return;
    await uploadPlaylist(playlist.id, playlist);
    await playerHubService.startStreaming(playlist.id);
    setIsStreaming(true);
  };

  const stopStreaming = async () => {
    if (!playlist) return;
    await playerHubService.stopStreaming(playlist.id);
    setIsStreaming(false);
  };

  useEffect(() => {
    // Обработчик закрытия приложения
    const handleBeforeUnload = async () => {
      if (isStreaming && playlist) {
        await playerHubService.stopStreaming(playlist.id);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isStreaming, playlist]);

  const flatTracks: TrackNode[] = useMemo(() => {
    if(playlist === null)
      return [];
    const flatten = (nodes: PlaylistNode[]): TrackNode[] =>
      nodes.flatMap(node =>
        node.$type === 'track' ? [node] : flatten(node.children)
      );
    return flatten(playlist.tracks);
  }, [playlist]);

  const currentTrack = flatTracks.find(t => t.id === currentTrackId) || null;

useEffect(() => {
  const interval = setInterval(() => {
    if (audioRef.current) {
      const progress = audioRef.current.currentTime;
      setTrackProgress(progress);

      const procentProgress = audioRef.current.currentTime === 0 ? 0 : audioRef.current.currentTime / audioRef.current.duration;

      console.log(`${audioRef.current.duration} ${audioRef.current.currentTime} ${procentProgress}`)
      if (isStreaming && currentTrackId && playlist) {
        playerHubService.sendPlaybackStatus({
          playlistId: playlist.id,
          trackId: currentTrackId,
          playlistVersion: 1, // можно использовать UUID плейлиста или версию, если ты её хранишь
          progress: procentProgress,
        });
      }
    }
  }, 500);

  return () => clearInterval(interval);
}, [isStreaming, currentTrackId, playlist]);

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setTrackProgress(time);
    }
  };

  const playTrack = () => {
    if (audioRef.current) {
      if (pauseAfterTime !== null) {
        setTimeout(() => {
          audioRef.current?.play();
        }, pauseAfterTime * 1000);
      } else {
        audioRef.current.play();
      }
    }
  };

  const stopTrack = () => {
    audioRef.current?.pause();
  };

  const resetTrack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const nextTrack = () => {
    stopTrack();
    const index = flatTracks.findIndex(t => t.id === currentTrackId);
    const next = flatTracks[(index + 1) % flatTracks.length];
    setCurrentTrackId(next.id);
    setTimeout(() => playTrack(), 1);
  };

  const previousTrack = () => {
    stopTrack();
    const index = flatTracks.findIndex(t => t.id === currentTrackId);
    const prev =
      flatTracks[(index - 1 + flatTracks.length) % flatTracks.length];
    setCurrentTrackId(prev.id);
  };

  const selectPlaylist = async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const folderPath = result.filePaths[0];
      const folderName = folderPath.split(/[\\/]/).pop() || "Новая папка";
      const fs = window.require('fs');
      const files = fs
        .readdirSync(folderPath)
        .filter((file: string) =>
          file.toLowerCase().match(/\.(mp3|wav|ogg)$/)
        )
        .map((file: string, index: number) : TrackNode => ({
          id: uuidv4(),
          $type: 'track',
          title: file,
          src: `${folderPath}/${file}`,
          duration: 1000, // можно позже проставить реальную длительность
          orderIndex: index
        }));

      setPlaylist({
        id: uuidv4(),
        title: folderName,
        tracks:
        [{
          id: uuidv4(),
          $type: 'group',
          title: 'Импортированные треки',
          children: files,
          orderIndex: 0,
        },
      ]});
      setCurrentTrackId(files[0]?.id || null);
    }
  };

  const handleVolumeChange = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  };

  return (
    <ThemeProvider theme={themes[themeName]}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <PlaylistPage
          playlist={playlist}
          currentTrackId={currentTrackId}
          isStreaming={isStreaming}
          onSelectPlaylist={selectPlaylist}
          onSelectTrack={(id) => {
            setCurrentTrackId(id);
            setTimeout(() => playTrack(), 1);
          }}
          onStartStreaming={startStreaming}
          onStopStreaming={stopStreaming}
        />

        <ControlPanel
          onPlay={playTrack}
          onStop={stopTrack}
          onReset={resetTrack}
          onNext={nextTrack}
          onPrevious={previousTrack}
          progress={trackProgress}
          duration={audioRef.current?.duration || 0}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeChange}
          onSettingsClick={() => setIsSettingsOpen(true)}
        />

        <audio
          ref={audioRef}
          src={currentTrack?.src || ''}
          onEnded={nextTrack}
        />

        {isSettingsOpen && (
          <SettingsModal
            onClose={() => setIsSettingsOpen(false)}
            pauseAfterTime={pauseAfterTime}
            setPauseAfterTime={setPauseAfterTime}
            theme={themeName}
            setTheme={setThemeName}
            availableThemes={Object.keys(themes)}
          />
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;
