import { dialog } from '@electron/remote';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { TrackNode } from '../../types/playlist';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { usePlaylistControls } from '../hooks/usePlaylistControls';
import { useStreaming } from '../hooks/useStreaming';
import { usePlayerStore } from '../stores/playerStore';
import { useSettingsStore } from '../stores/settingsStore';
import { themes } from '../theme';
import ControlPanel from './ControlPanel';
import PlaylistPage from './pages/PlaylistPage';
import SettingsModal from './SettingsModal';

export const AppLayout = () => {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  const { pauseAfterTime, themeName, setPauseAfterTime, setThemeName } = useSettingsStore();

  const { playlist, currentTrackId, setPlaylist, setCurrentTrackId } = usePlayerStore();

  const { audioRef, playTrack, pauseTrack, seekTrack, changeVolume, resetTrack, getDuration } =
    useAudioPlayer();

  const { previousTrack, nextTrack, getCurrentTrack } = usePlaylistControls(playTrack);

  const { isStreaming, startStreaming, stopStreaming } = useStreaming(
    playlist,
    currentTrackId,
    audioRef
  );

  const selectPlaylist = async () => {
    const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });

    if (!result.canceled && result.filePaths.length > 0) {
      const folderPath = result.filePaths[0];
      const folderName = folderPath.split(/[\\/]/).pop() ?? 'Новая папка';
      const fs = window.require('fs');
      const files = fs
        .readdirSync(folderPath)
        .filter((file: string) => file.toLowerCase().match(/\.(mp3|wav|ogg)$/))
        .map(
          (file: string, index: number): TrackNode => ({
            id: uuidv4(),
            $type: 'track',
            title: file,
            src: `${folderPath}/${file}`,
            duration: 1000, // можно позже проставить реальную длительность
            orderIndex: index,
          })
        );

      setPlaylist({
        id: uuidv4(),
        title: folderName,
        tracks: [
          {
            id: uuidv4(),
            $type: 'group',
            title: 'Импортированные треки',
            children: files,
            orderIndex: 0,
          },
        ],
      });
      setCurrentTrackId(files[0]?.id ?? null);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
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
        onSettingsClick={() => setIsSettingsOpen(true)}
        playTrack={playTrack}
        pauseTrack={pauseTrack}
        seekTrack={seekTrack}
        getDuration={getDuration}
        changeVolume={changeVolume}
        resetTrack={resetTrack}
        nextTrack={nextTrack}
        previousTrack={previousTrack}
        getCurrentTrack={getCurrentTrack}
      />

      <audio ref={audioRef} src={getCurrentTrack()?.src ?? ''} onEnded={nextTrack} />

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
  );
};
