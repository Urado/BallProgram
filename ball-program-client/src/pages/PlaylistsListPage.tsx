import React, { useEffect, useState } from 'react';
import { Playlist } from '../types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../Configuration';

const PlaylistsListPage: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка всех плейлистов
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get<Playlist[]>(`${API_BASE_URL}/api/guest/playlist/all`);
        setPlaylists(res.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch playlists:', err);
        setError('Не удалось загрузить список плейлистов');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPlaylists();
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Загрузка плейлистов...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      <h1>Доступные плейлисты</h1>
      
      {playlists.length === 0 ? (
        <p>Нет доступных плейлистов</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {playlists.map(playlist => (
            <li 
              key={playlist.id} 
              style={{ 
                marginBottom: '1rem',
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              <Link 
                to={`/playlist/${playlist.id}`}
                style={{
                  textDecoration: 'none',
                  color: '#333',
                  display: 'block'
                }}
              >
                <h3>{playlist.title}</h3>
                <p>Треков: {playlist.tracks.length}</p>
                {/* <p>Создан: {new Date(playlist.createdAt).toLocaleDateString()}</p> */}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlaylistsListPage;