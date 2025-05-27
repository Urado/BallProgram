import React from 'react';
import styled from 'styled-components';
import { Playlist, PlaybackStatus, PlaylistNode, TrackNode, GroupNode } from '../types';

interface PlaylistViewProps {
  playlist: Playlist;
  playbackStatus: PlaybackStatus | null;
  isStreamingActive?: boolean;
}

const Container = styled.div`
  padding: 1rem;
`;

const GroupContainer = styled.div`
  margin-left: 1rem;
  border-left: 2px solid ${({ theme }) => theme.primary};
  padding-left: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Title = styled.div<{ $isActive?: boolean }>`
  font-weight: bold;
  color: ${({ $isActive, theme }) => ($isActive ? theme.primary : theme.text)};
  margin-bottom: 0.5rem;
`;

const TrackContainer = styled.div<{ $isActive?: boolean }>`
  padding: 0.25rem 0;
  margin: 0.25rem 0;
  background-color: ${({ $isActive, theme }) =>
    $isActive ? theme.primary + '20' : 'transparent'};
  border-radius: 5px;
`;

const TrackTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  color: ${({ theme }) => theme.text};
`;

const ProgressBar = styled.div<{ $progress: number }>`
  height: 4px;
  background-color: ${({ theme }) => theme.primary};
  width: ${({ $progress }) => $progress * 100}%;
  border-radius: 2px;
  margin-top: 0.25rem;
  transition: width 0.3s ease;
`;

const StatusIndicator = styled.span<{ $isActive?: boolean }>`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ $isActive, theme }) =>
    $isActive ? theme.primary : theme.text + '60'};
`;

const PlaylistView: React.FC<PlaylistViewProps> = ({
  playlist,
  playbackStatus,
  isStreamingActive = false,
}) => {
  const renderNode = (node: PlaylistNode) => {
    const isActive = node.id === playbackStatus?.trackId;
    const progress = isActive ? playbackStatus?.progress ?? 0 : 0;

    if (node.$type === 'track') {
      const track = node as TrackNode;
      return (
        <TrackContainer key={track.id} $isActive={isActive}>
          <TrackTitle>
            <StatusIndicator $isActive={isActive && isStreamingActive} />
            🎵 {track.title}
            {isActive && (
              <span style={{ marginLeft: 'auto', fontSize: '0.8rem' }}>
                {Math.round(progress * 100)}%
              </span>
            )}
          </TrackTitle>
          {isActive && <ProgressBar $progress={progress} />}
        </TrackContainer>
      );
    }

    if (node.$type === 'group') {
      const group = node as GroupNode;
      return (
        <GroupContainer key={group.id}>
          <Title $isActive={group.children.some(
            child => child.id === playbackStatus?.trackId
          )}>
            📁 {group.title}
          </Title>
          {group.children
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map(renderNode)}
        </GroupContainer>
      );
    }

    return null;
  };

  return (
    <Container>
      <Title $isActive={isStreamingActive}>
        📃 {playlist.title}
        {isStreamingActive && (
          <span style={{ float: 'right', fontSize: '0.8rem' }}>
            {playbackStatus ? 'Воспроизводится' : 'Пауза'}
          </span>
        )}
      </Title>
      {playlist.tracks
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map(renderNode)}
    </Container>
  );
};

export default PlaylistView;