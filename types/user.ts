export type UserRole = 'investor' | 'founder' | 'both';

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  bio?: string;
  linkedin_url?: string;
  twitter_url?: string;
  company?: string;
  position?: string;
  location?: string;
  skills: string[];
  interests: string[];
  investment_preferences?: {
    min_amount?: number;
    max_amount?: number;
    sectors: string[];
    stages: string[];
  };
}

export interface UserSettings {
  id: string;
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  two_factor_enabled: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
}

export interface UserStats {
  total_investments: number;
  total_projects: number;
  total_connections: number;
  portfolio_value: number;
  active_deals: number;
}

export interface UserConnection {
  id: string;
  user_id: string;
  connected_user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  connected_user: User;
}

export interface UserNotification {
  id: string;
  user_id: string;
  type: 'connection' | 'investment' | 'project' | 'message' | 'system';
  title: string;
  message: string;
  read: boolean;
  action_url?: string;
  created_at: string;
}

export type UserWithProfile = User & {
  profile: Omit<UserProfile, keyof User>;
  settings: UserSettings;
  stats: UserStats;
};
