import { User } from './user';

export type MessageType = 'text' | 'file' | 'image' | 'system';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id?: string;
  chat_id: string;
  content: string;
  type: MessageType;
  file_url?: string;
  read: boolean;
  created_at: string;
  updated_at: string;
}

export interface Chat {
  id: string;
  name?: string;
  type: 'direct' | 'group';
  participants: string[];
  last_message?: Message;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface ChatWithDetails extends Chat {
  participants_details: User[];
  messages: Message[];
}

export interface CreateMessageInput {
  content: string;
  type: MessageType;
  file?: File;
  chat_id: string;
}

export interface CreateChatInput {
  name?: string;
  type: 'direct' | 'group';
  participants: string[];
}
