import * as signalR from '@microsoft/signalr';

import { PlaybackStatus } from '../../types/playlist';
import { API_BASE_URL } from '../config';

/**
 *
 */
class PlayerHubService {
  private connection: signalR.HubConnection;

  /**
   *
   */
  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/hubs/player`)
      .withAutomaticReconnect()
      .build();
  }

  /**
   *
   */
  async startStreaming(playlistId: string): Promise<void> {
    if (this.connection.state !== signalR.HubConnectionState.Connected) {
      await this.connection.start();
    }

    // Присоединяемся к группе по playlistId
    await this.connection.invoke('StartStreaming', playlistId);
    console.log('Connected to playlist group:', playlistId);
  }

  /**
   *
   */
  async stopStreaming(playlistId: string): Promise<void> {
    if (this.connection.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke('StopStreaming', playlistId);
      await this.connection.stop();
      console.log('Disconnected from SignalR and left group:', playlistId);
    }
  }

  /**
   *
   */
  async sendPlaybackStatus(status: PlaybackStatus): Promise<void> {
    await this.connection.invoke('SendPlaybackStatus', status);
  }
}

export const playerHubService = new PlayerHubService();
