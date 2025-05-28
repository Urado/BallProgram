import { create } from 'zustand';

import { Playlist } from '../../types/playlist';

interface PlayerState {
  playlist: Playlist | null;
  currentTrackId: string | null;
  isStreaming: boolean;
  trackProgress: number;
  volume: number;
  setPlaylist: (p: Playlist) => void;
  setCurrentTrackId: (id: string | null) => void;
  setIsStreaming: (v: boolean) => void;
  setTrackProgress: (v: number) => void;
  setVolume: (v: number) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  playlist: null,
  currentTrackId: null,
  isStreaming: false,
  trackProgress: 0,
  volume: 1,
  setPlaylist: (playlist): void => set({ playlist }),
  setCurrentTrackId: (id): void => set({ currentTrackId: id }),
  setIsStreaming: (v): void => set({ isStreaming: v }),
  setTrackProgress: (v): void => set({ trackProgress: v }),
  setVolume: (v): void => set({ volume: v }),
}));
