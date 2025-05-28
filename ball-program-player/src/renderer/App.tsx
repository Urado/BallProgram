import React from 'react';
import { ThemeProvider } from 'styled-components';

import { AppLayout } from './components/AppLayout';
import { useSettingsStore } from './stores/settingsStore';
import { themes } from './theme';

const App: React.FC = () => {
  const { themeName } = useSettingsStore();

  return (
    <ThemeProvider theme={themes[themeName]}>
      <AppLayout />
    </ThemeProvider>
  );
};

export default App;
