import React from 'react';
import styled from 'styled-components';

interface Props {
  id: string;
  name: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

const ListItem = styled.li<{ active: boolean }>`
  padding: 10px 14px;
  margin-bottom: 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  background-color: ${({ active, theme }) => (active ? theme.primary : theme.secondary)};
  color: ${({ active, theme }) => (active ? theme.text : '#ccc')};
`;

const TrackItem: React.FC<Props> = ({ id, name, isActive, onClick }) => (
  <ListItem active={isActive} onClick={() => onClick(id)}>
    {name}
  </ListItem>
);

export default TrackItem;
