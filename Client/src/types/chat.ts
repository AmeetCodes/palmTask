export interface User {
  _id: string;
  name: string;
  email: string;
  role?: "user" | "admin";
  createdAt?: string;
}

export interface Message {
  _id: string;
  sender: User | string;
  receiver: User | string;
  message: string;
  createdAt: string;
}

export interface SystemNotice {
  id: string;
  isNotice: true;
  type: "user_joined" | "user_left" | "info";
  text: string;
  timestamp: string;
}

export type TimelineItem = (Message & { isNotice?: false }) | SystemNotice;

export interface SendMessageData {
  receiverId: string;
  message: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}