export interface User {
  username: string;
  hexcode: string;
  status: 'online' | 'offline';
}

export interface UserHistory {
  id: string;
  username: string;
  hexcode: string;
  status: 'online' | 'offline';
}