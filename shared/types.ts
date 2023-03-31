export interface UserObj {
  username: string;
  hexcode: string;
  status: 'online' | 'offline';
  lastSeen: Date;
  xp: number;
  level: number;
  isLevelingUp: boolean;
  disconnectTime?: Date;
}

export interface UserHistory extends UserObj {
  id: string;
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