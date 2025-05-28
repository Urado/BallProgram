import React from 'react';
import styled from 'styled-components';

interface Props {
  isStreaming: boolean;
  onStartStreaming: () => void;
  onStopStreaming: () => void;
}

export const StreamerButton = ({ isStreaming, onStartStreaming, onStopStreaming }: Props) => {
  const toogleStreaming = () => {
    if (isStreaming) onStopStreaming();
    else onStartStreaming();
  };
  return (
    <StyledButton onClick={toogleStreaming}>
      {isStreaming ? 'Стриминг...' : 'Начать стриминг'}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  background-color: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonText};
  border: 2px solid ${({ theme }) => theme.border};
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.buttonHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
