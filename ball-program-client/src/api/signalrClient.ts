import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { PlaybackStatus } from '../types';

let connection: HubConnection | null = null;

export function startSignalRConnection(onStatusUpdate: (status: PlaybackStatus) => void): Promise<HubConnection> {
  connection = new HubConnectionBuilder()
    .withUrl('/hubs/client')
    .withAutomaticReconnect()
    .build();

  return connection.start().then(() => {
    connection!.on('PlaybackStatusUpdated', onStatusUpdate);
    console.log('SignalR connected');
    return connection!;
  });
}

export function stopSignalRConnection(): void {
  if (connection) {
    connection.stop();
    connection = null;
  }
}
