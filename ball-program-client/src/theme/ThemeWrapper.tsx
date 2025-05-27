import React, { ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from './theme';

export const ThemeWrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
);
