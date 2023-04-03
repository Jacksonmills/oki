export interface UserObj {
  id: string;
  username: string;
  hexcode: string;
  status: 'online' | 'offline';
  lastSeen: Date;
  xp: number;
  level: number;
  isLevelingUp: boolean;
}

export interface UserHistory extends UserObj {
  disconnectTime?: Date;
  roomId?: string;
}

export type MessageObj = {
  username: string;
  hexcode: string;
  content: string;
  isEXMessage?: boolean;
  isServerMessage?: boolean;
  type?: ServerMessageTypeUnion;
};

export type ServerMessageTypeUnion = 'connected' | 'disconnected';