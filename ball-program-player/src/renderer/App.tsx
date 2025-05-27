import React from 'react';
import { ThemeProvider } from 'styled-components';
import { themes } from './theme';
import { useSettingsStore } from './stores/settingsStore';
import { AppLayout } from './components/AppLayout';

const App: React.FC = () => {
  const { themeName } = useSettingsStore();

  return (
    <ThemeProvider theme={themes[themeName]}>
      <AppLayout />
    </ThemeProvider>
  );
};

export default App;
