import { User } from './user';

export type MessageType = 'text' | 'file' | 'image';
export type ChatType = 'direct' | 'group';
export type ParticipantRole = 'admin' | 'member';

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  type: MessageType;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  sender?: User;
  reads?: MessageRead[];
}

export interface MessageRead {
  id: string;
  message_id: string;
  user_id: string;
  read_at: string;
}

export interface ChatParticipant {
  id: string;
  chat_id: string;
  user_id: string;
  role: ParticipantRole;
  last_read_at: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Chat {
  id: string;
  project_id: string;
  name?: string;
  type: ChatType;
  created_at: string;
  updated_at: string;
  participants?: ChatParticipant[];
  last_message?: Message;
  unread_count?: number;
}

export interface CreateMessageInput {
  content: string;
  type: MessageType;
  metadata?: Record<string, any>;
  chat_id: string;
}

export interface CreateChatInput {
  project_id: string;
  name?: string;
  type: ChatType;
  participant_ids: string[];
}

export interface UpdateChatInput {
  name?: string;
  participant_ids?: string[];
}
