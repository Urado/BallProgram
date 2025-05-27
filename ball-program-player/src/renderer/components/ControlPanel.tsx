import React from 'react';
import styled from 'styled-components';

interface ControlPanelProps {
  onPlay: () => void;
  onStop: () => void;
  onReset: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSettingsClick: () => void;
  progress: number;
  duration: number;
  onSeek: (time: number) => void;
  onVolumeChange?: (volume: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onPlay,
  onStop,
  onReset,
  onNext,
  onPrevious,
  onSettingsClick,
  progress,
  duration,
  onSeek,
  onVolumeChange,
}) => {
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    onSeek(value);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    onVolumeChange?.(value);
  };

  return (
    <PanelWrapper>
      <ProgressSection>
        <ProgressInput
          type="range"
          min={0}
          max={duration || 0}
          value={progress}
          onChange={handleProgressChange}
        />
        <TimeDisplay>
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </TimeDisplay>
      </ProgressSection>

      <ControlsRow>
        <ButtonsGroup>
          <PlayButton onClick={onPlay}>▶</PlayButton>
          <ControlButton onClick={onPrevious}>⏮</ControlButton>
          <ControlButton onClick={onStop}>⏸</ControlButton>
          <ControlButton onClick={onReset}>↩</ControlButton>
          <ControlButton onClick={onNext}>⏭</ControlButton>
        </ButtonsGroup>

        <VolumeSettingsGroup>
          <span>🔊</span>
          <VolumeInput
            type="range"
            min={0}
            max={1}
            step={0.01}
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