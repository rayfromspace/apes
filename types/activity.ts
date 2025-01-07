export type ActivityType = 'comment' | 'investment' | 'milestone' | 'team_update';

export interface Activity {
  id: string;
  type: ActivityType;
  user_id: string;
  project_id: string;
  content: string;
  metadata: Record<string, any>;
  created_at: string;
  user?: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  project?: {
    id: string;
    title: string;
  };
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  action_url?: string;
  metadata: Record<string, any>;
  created_at: string;
}
