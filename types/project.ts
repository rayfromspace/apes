import type { User } from './user';
import type { Investment } from './investment';

export type ProjectType = 'product' | 'service';
export type ProjectStatus = 'active' | 'archived' | 'deleted';
export type ProjectVisibility = 'private' | 'public' | 'team';
export type ProjectRole = 'founder' | 'admin' | 'member';

export interface Project {
  id: string;
  name: string;
  description: string;
  type: ProjectType;
  category: string;
  founder_id: string;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  image_url?: string;
  total_budget: number;
  treasury_balance: number;
  team_size: number;
  active_tasks: number;
  completed_tasks: number;
  created_at: string;
  updated_at: string;
  team_members?: TeamMember[];
}

export interface TeamMember {
  id: string;
  project_id: string;
  user_id: string;
  role: ProjectRole;
  permissions: Record<string, any>;
  status: 'active' | 'inactive' | 'pending';
  salary: number;
  last_active?: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface CreateProjectInput {
  name: string;
  description: string;
  type: ProjectType;
  category: string;
  founder_id: string;
  status?: ProjectStatus;
  visibility?: ProjectVisibility;
  total_budget?: number;
  treasury_balance?: number;
  team_size?: number;
  active_tasks?: number;
  completed_tasks?: number;
  image_url?: string;
}

export interface ProjectWithRelations extends Project {
  founder: User;
}
