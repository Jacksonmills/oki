export interface UserObj {
  username: string;
  hexcode: string;
  status: 'online' | 'offline';
  lastSeen: Date;
  xp: number;
  level: number;
  disconnectTime?: Date;
}

export interface UserHistory extends UserObj {
  id: string;
}

export type MessageObj = {
  content: string;
  isServerMessage: boolean;
  type: ServerMessageTypeUnion;
  username?: string;
  hexcode?: string;
};

export type ServerMessageTypeUnion = 'connected' | 'disconnected';