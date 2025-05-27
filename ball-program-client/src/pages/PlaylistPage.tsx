import React, { useEffect, useState, useCallback } from 'react';
import PlaylistHeader from '../components/PlaylistHeader';
import PlaylistView from '../components/PlaylistView';
import { Playlist, PlaybackStatus } from '../types';
import axios from 'axios';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';
import { API_BASE_URL } from '../Configuration';

const PlaylistPage: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('');
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus | null>(null);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Загрузка всех плейлистов
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await axios.get<Playlist[]>(`${API_BASE_URL}/api/guest/playlist/all`);
        setPlaylists(res.data);
        if (res.data.length > 0) {
          setSelectedPlaylistId(res.data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch playlists:', error);
      }
    };
    fetchPlaylists();
  }, []);

  // Загрузка выбранного плейлиста
  useEffect(() => {
    if (!selectedPlaylistId) return;
    
    const fetchPlaylist = async () => {
      try {
        const res = await axios.get<Playlist>(`${API_BASE_URL}/api/guest/playlist/${selectedPlaylistId}`);
        setPlaylist(res.data);
      } catch (error) {
        console.error('Failed to fetch playlist:', error);
      }
    };
    fetchPlaylist();
  }, [selectedPlaylistId]);

  // Подключение к SignalR и подписка на обновления
  const setupSignalR = useCallback(async () => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/hubs/guest`)
      .withAutomaticReconnect()
      .build();

    try {
      await newConnection.start();
      setConnection(newConnection);
      setIsConnected(true);
      console.log("✅ SignalR подключён");

      newConnection.on("PlaybackStatusUpdated", (status: PlaybackStatus) => {
        setPlaybackStatus(status);
      });

      newConnection.on("StreamingStarted", (playlistId: string) => {
        console.log(`Стриминг начат для плейлиста ${playlistId}`);
      });

      newConnection.on("StreamingStopped", (playlistId: string) => {
        console.log(`Стриминг остановлен для плейлиста ${playlistId}`);
        setPlaybackStatus(null);
      });

    } catch (error) {
      console.error("❌ Ошибка подключения к SignalR:", error);
    }
  }, []);

  // Подписка/отписка при изменении выбранного плейлиста
  useEffect(() => {
    if (!isConnected || !selectedPlaylistId) return;

    const subscribe = async () => {
      try {
        await connection?.invoke("SubscribeToPlaylist", selectedPlaylistId);
        console.log(`Подписались на плейлист ${selectedPlaylistId}`);
      } catch (error) {
        console.error("Ошибка подписки:", error);
      }
    };

    subscribe();

    return () => {
      if (isConnected && selectedPlaylistId) {
        connection?.invoke("UnsubscribeFromPlaylist", selectedPlaylistId)
          .catch(error => console.error("Ошибка отписки:", error));
      }
    };
  }, [isConnected, selectedPlaylistId, connection]);

  // Инициализация подключения
  useEffect(() => {
    setupSignalR();

    return () => {
      if (connection) {
        connection.stop();
        setIsConnected(false);
      }
    };
  }, [setupSignalR]);

  return (
    <div>
      <PlaylistHeader
        playlists={playlists}
        selectedPlaylistId={selectedPlaylistId}
        onSelect={setSelectedPlaylistId}
      />

      {playlist ? (
        <PlaylistView 
          playlist={playlist} 
          playbackStatus={playbackStatus}
          isStreamingActive={isConnected && !!playbackStatus}
        />
      ) : (
        <p style={{ padding: '1rem' }}>Загрузка...</p>
      )}
    </div>
  );
};

export default PlaylistPage;