export interface UserObj {
  id: string;
  username: string;
  hexcode: string;
  status: 'online' | 'offline';
  lastSeen: Date;
  xp: number;
  level: number;
  isLevelingUp: boolean;
  roomId: string;
}

export interface UserHistory extends UserObj {
  disconnectTime?: Date;
}

export type MessageObj = {
  username: string;
  hexcode: string;
  content: string;
  roomId: string;
  isEXMessage?: boolean;
  isServerMessage?: boolean;
  type?: ServerMessageTypeUnion;
};

export type ServerMessageTypeUnion = 'connected' | 'disconnected';