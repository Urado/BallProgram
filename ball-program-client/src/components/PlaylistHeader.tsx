import React from 'react';
import styled from 'styled-components';
import { Playlist } from '../types';

interface PlaylistHeaderProps {
  playlists: Playlist[];
  selectedPlaylistId: string;
  onSelect: (playlistId: string) => void;
}

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
`;

const Title = styled.h2`
  margin: 0;
`;

const Select = styled.select`
  padding: 0.5rem;
  border-radius: 5px;
  font-size: 1rem;
`;

const PlaylistHeader: React.FC<PlaylistHeaderProps> = ({
  playlists,
  selectedPlaylistId,
  onSelect,
}) => {
  return (
    <HeaderContainer>
      <Title>🎼 Плейлист события</Title>
      <Select
        value={selectedPlaylistId}
        onChange={(e) => onSelect(e.target.value)}
      >
        {playlists.map((pl) => (
          <option key={pl.id} value={pl.id}>
            {pl.title}
          </option>
        ))}
      </Select>
    </HeaderContainer>
  );
};

export default PlaylistHeader;
