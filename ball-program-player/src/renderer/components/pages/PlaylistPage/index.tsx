import React from 'react';
import styled from 'styled-components';

import { Playlist, PlaylistNode } from '../../../../types/playlist';
import { StreamerButton } from '../../StreamerButton';
import TrackItem from '../../TrackItem';

const Container = styled.div`
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-right: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.button`
  padding: 6px 12px;
  background-color: ${({ theme }) => theme.highlight};
  color: ${({ theme }) => theme.text};
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const TrackList = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-top: 10px;
`;

const GroupTitle = styled.div`
  font-weight: bold;
  margin: 10px 0 4px;
  padding-left: 8px;
`;

const List = styled.ul`
  list-style: none;
  padding-left: 12px;
  margin: 0;
`;

interface Props {
  playlist: Playlist | null;
  currentTrackId: string | null;
  isStreaming: boolean;
  onSelectPlaylist: () => void;
  onSelectTrack: (id: string) => void;
  onStartStreaming: () => void;
  onStopStreaming: () => void;
}

const renderNode = (
  node: PlaylistNode,
  currentTrackId: string | null,
  onSelectTrack: (id: string) => void
): React.ReactNode => {
  if (node.$type === 'track') {
    return (
      <TrackItem
        key={node.id}
        id={node.id}
        name={node.title}
        isActive={node.id === currentTrackId}
        onClick={onSelectTrack}
      />
    );
  }

  return (
    <li key={node.id}>
      <GroupTitle>{node.title}</GroupTitle>
      <List>
        {node.children.map((child: PlaylistNode) =>
          renderNode(child, currentTrackId, onSelectTrack)
        )}
      </List>
    </li>
  );
};

const PlaylistPage: React.FC<Props> = ({
  playlist,
  currentTrackId,
  onSelectPlaylist,
  onSelectTrack,
  isStreaming,
  onStartStreaming,
  onStopStreaming,
}) => (
  <Container>
    <Header>
      <h2 style={{ margin: 0 }}>🎵 Плейлист {playlist?.title}</h2>
      <Button onClick={onSelectPlaylist}>📁 Выбрать</Button>
      {playlist && (
        <StreamerButton
          isStreaming={isStreaming}
          onStartStreaming={onStartStreaming}
          onStopStreaming={onStopStreaming}
        />
      )}
    </Header>
    {playlist && (
      <TrackList>
        <List>
          {playlist.tracks.map((node: PlaylistNode) =>
            renderNode(node, currentTrackId, onSelectTrack)
          )}
        </List>
      </TrackList>
    )}
  </Container>
);

export default PlaylistPage;
