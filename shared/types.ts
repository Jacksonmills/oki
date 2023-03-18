export interface UserObj {
  username: string;
  hexcode: string;
  status: 'online' | 'offline';
  lastSeen: Date;
  disconnectTime?: Date;
}

export interface UserHistory extends UserObj {
  id: string;
}