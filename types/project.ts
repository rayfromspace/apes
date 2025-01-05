import type { User } from './user';
import type { Investment } from './investment';

export type ProjectType = 'product' | 'service';
export type ProjectStatus = 'draft' | 'active' | 'paused' | 'completed';
export type ProjectVisibility = 'private' | 'public' | 'unlisted';

export interface Project {
  id: string;
  title: string;
  description: string;
  type: ProjectType;  // Using type to match database schema
  category: string;  // Changed to string
  visibility: ProjectVisibility;
  status: ProjectStatus;
  founder_id: string;
  funding_goal: number;
  current_funding: number;
  team_size: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
  team_members: TeamMember[];
}

export interface TeamMember {
  id: string;
  project_id: string;
  user_id: string;
  role: 'founder' | 'cofounder' | 'board_member' | 'team_member';
  joined_at: string;
  // Temporarily commented out
  // permissions: string[];
  // user: User;
}

// Temporarily commented out until needed
/*
export interface ProjectUpdate {
  id: string;
  project_id: string;
  author_id: string;
  title: string;
  content: string;
  attachments?: string[];
  published_at: string;
  created_at: string;
  updated_at: string;
  author: User;
}

export interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  description: string;
  due_date: string;
  status: 'pending' | 'completed' | 'delayed';
  completion_date?: string;
  dependencies?: string[];
  created_at: string;
  updated_at: string;
}

export interface ProjectDocument {
  id: string;
  project_id: string;
  name: string;
  type: 'pitch_deck' | 'financial_model' | 'legal' | 'other';
  url: string;
  uploaded_by: string;
  version: number;
  created_at: string;
}

export interface ProjectMetrics {
  total_views: number;
  total_likes: number;
  total_shares: number;
  investor_interest: number;
  engagement_rate: number;
}

export interface ProjectFiltersState {
  category?: string;
  status?: ProjectStatus;
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'funding' | 'progress';
  minFunding?: number;
  maxFunding?: number;
  skills?: string[];
}
*/

export interface CreateProjectInput {
  title: string;
  description: string;
  type: ProjectType;  // Using type to match database schema
  category: string;  // Changed to string
  founder_id: string;
  status?: ProjectStatus;
  visibility?: ProjectVisibility;
  funding_goal?: number;
  current_funding?: number;
  team_size?: number;
  image_url?: string;
}

export interface ProjectWithRelations extends Project {
  founder: User;
  // Temporarily commented out
  // team_members: (TeamMember & { user: User })[];
  // user: User;
  // investments: Investment[];
  // metrics: ProjectMetrics;
}
