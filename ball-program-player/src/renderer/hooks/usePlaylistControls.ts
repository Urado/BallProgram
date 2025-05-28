import { useCallback, useMemo } from 'react';

import { PlaylistNode, TrackNode } from '../../types/playlist';
import { usePlayerStore } from '../stores/playerStore';

export function usePlaylistControls(playTrack: () => void) {
  const { playlist, currentTrackId, setCurrentTrackId } = usePlayerStore();

  const flatTracks: TrackNode[] = useMemo(() => {
    if (playlist === null) return [];
    const flatten = (nodes: PlaylistNode[]): TrackNode[] =>
      nodes.flatMap((node) => (node.$type === 'track' ? [node] : flatten(node.children)));
    return flatten(playlist.tracks);
  }, [playlist]);

  const getCurrentTrack = useCallback((): TrackNode | null => {
    console.log(flatTracks.find((t) => t.id === currentTrackId));
    return flatTracks.find((t) => t.id === currentTrackId) ?? null;
  }, [flatTracks, currentTrackId]);

  const nextTrack = useCallback(() => {
    if (flatTracks.length === 0 || currentTrackId === null) return;
    const index = flatTracks.findIndex((t) => t.id === currentTrackId);
    const next = flatTracks[(index + 1) % flatTracks.length];
    setCurrentTrackId(next.id);
    setTimeout(playTrack, 1);
  }, [flatTracks, currentTrackId, setCurrentTrackId, playTrack]);

  const previousTrack = useCallback(() => {
    if (flatTracks.length === 0 || currentTrackId === null) return;
    const index = flatTracks.findIndex((t) => t.id === currentTrackId);
    const prev = flatTracks[(index - 1 + flatTracks.length) % flatTracks.length];
    setCurrentTrackId(prev.id);
    setTimeout(playTrack, 1);
  }, [flatTracks, currentTrackId, setCurrentTrackId, playTrack]);

  const selectTrack = useCallback(
    (id: string) => {
      setCurrentTrackId(id);
      setTimeout(playTrack, 1);
    },
    [setCurrentTrackId, playTrack]
  );

  return {
    nextTrack,
    previousTrack,
    selectTrack,
    getCurrentTrack,
  };
}
