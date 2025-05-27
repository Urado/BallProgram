import { useRef, useEffect, useCallback } from 'react';
import { usePlayerStore } from '../stores/playerStore';

// Хук управления плеером одного трека
export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { setTrackProgress, volume, setVolume } = usePlayerStore();

  const playTrack = useCallback(() => {
    audioRef.current?.play();
  }, []);

  const pauseTrack = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const stopTrack = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setTrackProgress(0);
    }
  }, []);

  const seekTrack = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setTrackProgress(time);
    }
  }, []);

  
  const resetTrack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const changeVolume = useCallback((vol: number) => {
    if (audioRef.current) {
      audioRef.current.volume = vol;
      setVolume(vol);
    }
  }, []);

  const getDuration = useCallback(() => audioRef.current?.duration || 0, [])

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setTrackProgress(audioRef.current.currentTime);
      }
    };

    const audio = audioRef.current;
    audio?.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      audio?.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  return {
    audioRef,
    volume,
    playTrack,
    pauseTrack,
    stopTrack,
    seekTrack,
    resetTrack,
    changeVolume,
    getDuration,
  };
}