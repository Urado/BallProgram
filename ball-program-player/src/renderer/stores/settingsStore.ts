import { create } from 'zustand';

interface SettingsState {
  pauseAfterTime: number | null;
  themeName: string;
  setPauseAfterTime: (v: number | null) => void;
  setThemeName: (theme: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  pauseAfterTime: null,
  themeName: 'dark',
  setPauseAfterTime: (v): void => set({ pauseAfterTime: v }),
  setThemeName: (themeName): void => set({ themeName }),
}));
