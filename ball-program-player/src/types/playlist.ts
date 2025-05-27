export type PlaylistNode = TrackNode | GroupNode;

export interface BaseNode {
  id: string;
  title: string;
  parentId?: string;
  isLoop?: boolean;
  isMuted?: boolean;
  volume?: number;
  orderIndex: number;
  $type: "track" | "group";
}

export interface TrackNode extends BaseNode {
  duration: number;
  src: string;
  $type: "track";
}

export interface GroupNode extends BaseNode {
  $type: 'group';
  children: PlaylistNode[];
}

export interface Playlist {
  id: string;
  title: string;
  tracks: PlaylistNode[];
}

export interface PlaybackStatus {
  playlistId: string;
  trackId: string | null;
  playlistVersion: number;
  progress: number;
}