import type { User } from './user';
import type { Investment } from './investment';

export type ProjectStatus = 'planning' | 'active' | 'completed' | 'on_hold' | 'cancelled';
export type ProjectCategory = 'technology' | 'healthcare' | 'finance' | 'education' | 'other';
export type ProjectVisibility = 'public' | 'private' | 'unlisted';

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  category: ProjectCategory;
  visibility: ProjectVisibility;
  progress: number;
  funding_goal: number;
  current_funding: number;
  founder_id: string;
  skills: string[];
  start_date: string;
  end_date?: string;
  status: ProjectStatus;
  team_members: TeamMember[];
  updates: ProjectUpdate[];
  milestones: ProjectMilestone[];
  documents: ProjectDocument[];
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  project_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joined_at: string;
  permissions: string[];
  user: User;
}

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
  category?: ProjectCategory;
  status?: ProjectStatus;
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'funding' | 'progress';
  minFunding?: number;
  maxFunding?: number;
  skills?: string[];
}

export interface CreateProjectInput {
  title: string;
  description: string;
  category: ProjectCategory;
  visibility: ProjectVisibility;
  funding_goal: number;
  start_date: string;
  end_date?: string;
  skills: string[];
  image?: File;
}

export interface ProjectWithRelations extends Project {
  founder: User;
  team_members: (TeamMember & { user: User })[];
  investments: Investment[];
  metrics: ProjectMetrics;
}
