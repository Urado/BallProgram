import React from 'react';
import styled from 'styled-components';
import { usePlayerStore } from '../stores/playerStore';
import { TrackNode } from '../../types/playlist';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

interface ControlPanelProps {
  onSettingsClick: () => void;
  playTrack: () => void,
  pauseTrack: () => void,
  seekTrack: (v: number) => void,
  changeVolume: (v: number) => void,
  resetTrack: () => void,
  nextTrack: () => void,
  previousTrack: () => void,
  getCurrentTrack: () => TrackNode | null,
  getDuration: () => number,
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onSettingsClick,
  playTrack,
  pauseTrack,
  seekTrack,
  changeVolume,
  resetTrack,
  nextTrack,
  previousTrack,
  getDuration,
}) => {
  const {
    trackProgress,
  } = usePlayerStore();

  const { volume } = useAudioPlayer();

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    seekTrack(value);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    changeVolume?.(value);
  };

  return (
    <PanelWrapper>
      <ProgressSection>
        <ProgressInput
          type="range"
          min={0}
          max={getDuration()}
          value={trackProgress}
          onChange={handleProgressChange}
        />
        <TimeDisplay>
          <span>{formatTime(trackProgress)}</span>
          <span>{formatTime(getDuration())}</span>
        </TimeDisplay>
      </ProgressSection>

      <ControlsRow>
        <ButtonsGroup>
          <PlayButton onClick={playTrack}>▶</PlayButton>
          <ControlButton onClick={previousTrack}>⏮</ControlButton>
          <ControlButton onClick={pauseTrack}>⏸</ControlButton>
          <ControlButton onClick={resetTrack}>↩</ControlButton>
          <ControlButton onClick={nextTrack}>⏭</ControlButton>
        </ButtonsGroup>

        <VolumeSettingsGroup>
          <span>🔊</span>
          <VolumeInput
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            defaultValue={1}
            onChange={handleVolumeChange}
          />
          <SettingsButton onClick={onSettingsClick}>⚙️</SettingsButton>
        </VolumeSettingsGroup>
      </ControlsRow>
    </PanelWrapper>
  );
};

const PanelWrapper = styled.div`
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  padding: 15px;
  border-top: 1px solid ${({ theme }) => theme.border};
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
`;

const ProgressSection = styled.div`
  width: 100%;
`;

const ProgressInput = styled.input`
  width: 100%;
`;

const TimeDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9em;
`;

const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ButtonsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ControlButton = styled.button`
  padding: 6px 10px;
  font-size: 1rem;
  background-color: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonText};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.buttonHover};
  }
`;

const PlayButton = styled(ControlButton)`
  font-size: 1.4rem;
  padding: 8px 14px;
  background-color: ${({ theme }) => theme.playButton};
`;

const SettingsButton = styled(ControlButton)`
  font-size: 1.2rem;
  padding: 6px 10px;
`;

const VolumeSettingsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 200px;
`;

const VolumeInput = styled.input`
  flex-grow: 1;
`;

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default ControlPanel;