import type { User } from './user';
import type { Investment } from './investment';

export type ProjectType = 'product' | 'service';
export type ProjectStatus = 'active' | 'completed' | 'cancelled' | 'paused';
export type ProjectVisibility = 'public' | 'private' | 'invitation';
export type ProjectRole = 'founder' | 'admin' | 'member' | 'investor';

export interface Project {
  id: string;
  title: string;
  description: string;
  type: ProjectType;
  category: string;
  founder_id: string;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  image_url?: string;
  funding_goal?: number;
  current_funding?: number;
  required_skills?: string[];
  progress?: number;
  created_at: string;
  updated_at: string;
  team_members: TeamMember[];
}

export interface TeamMember {
  id: string;
  project_id: string;
  user_id: string;
  role: ProjectRole;
  permissions?: Record<string, any>;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface CreateProjectInput {
  title: string;
  description: string;
  type: ProjectType;
  category: string;
  founder_id: string;
  status?: ProjectStatus;
  visibility?: ProjectVisibility;
  funding_goal?: number;
  current_funding?: number;
  required_skills?: string[];
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
