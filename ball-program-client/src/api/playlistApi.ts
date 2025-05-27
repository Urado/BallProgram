import axios from 'axios';
import { Playlist } from '../types';

export async function getAllPlaylists(): Promise<Playlist[]> {
  const response = await axios.get<Playlist[]>('/api/guest/playlist/all');
  return response.data;
}

export async function getPlaylist(id: string): Promise<Playlist> {
  const response = await axios.get<Playlist>(`/api/guest/playlist/${id}`);
  return response.data;
}