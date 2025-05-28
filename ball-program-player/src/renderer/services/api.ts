import axios from 'axios';

import { Playlist, PlaylistNode } from '../../types/playlist';
import { API_BASE_URL } from '../config';

export async function uploadPlaylist(eventId: string, playlist: Playlist): Promise<void> {
  const url = `${API_BASE_URL}/api/player/playlist/${eventId}`;

  const preparedPlaylist = preparePlaylistForUpload(playlist);

  // Отправляем подготовленные данные
  await axios.put(url, preparedPlaylist);
}

// Рекурсивная функция для подготовки данных плейлиста
function preparePlaylistNodeForUpload(node: PlaylistNode): unknown {
  if (node.$type === 'track') {
    // Обрабатываем TrackNode
    return {
      $type: node.$type,
      id: node.id,
      title: node.title,
      parentId: node.parentId,
      isLoop: node.isLoop,
      isMuted: node.isMuted,
      volume: node.volume,
      orderIndex: node.orderIndex,
      type: node.$type,
      duration: node.duration,
      // src исключается
    };
  } else if (node.$type === 'group') {
    // Обрабатываем GroupNode рекурсивно
    return {
      $type: node.$type,
      id: node.id,
      title: node.title,
      parentId: node.parentId,
      isLoop: node.isLoop,
      isMuted: node.isMuted,
      volume: node.volume,
      orderIndex: node.orderIndex,
      type: node.$type,
      children: node.children.map((child) => preparePlaylistNodeForUpload(child)), // Рекурсивно обрабатываем дочерние элементы
    };
  }
}

// Функция для подготовки данных плейлиста для отправки
/**
 *
 */
function preparePlaylistForUpload(playlist: Playlist): unknown {
  return {
    id: playlist.id,
    title: playlist.title,
    tracks: playlist.tracks.map((track) => preparePlaylistNodeForUpload(track)), // Обрабатываем каждый трек
  };
}
