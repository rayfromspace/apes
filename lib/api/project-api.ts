import { apiClient, ApiResponse } from './api-client';

export interface Project {
  id: string;
  title: string;
  description: string;
  type: 'product' | 'service';
  category: string;
  status: 'draft' | 'active' | 'funding' | 'completed' | 'cancelled';
  visibility: 'private' | 'public' | 'unlisted';
  funding_goal: number;
  current_funding: number;
  team_size: number;
  tags: string[];
  milestones: any[];
  team_members: {
    id: string;
    role: string;
    joined_at: string;
  }[];
  founder_id: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectData {
  title: string;
  description: string;
  type: 'product' | 'service';
  category: string;
  founder_id: string;
  status?: 'draft' | 'active' | 'funding' | 'completed' | 'cancelled';
  visibility?: 'private' | 'public' | 'unlisted';
  funding_goal?: number;
  current_funding?: number;
  team_size?: number;
  tags?: string[];
  milestones?: any[];
  team_members?: {
    id: string;
    role: string;
    joined_at: string;
  }[];
  image_url?: string;
}

export interface UpdateProjectData extends Partial<CreateProjectData> {}

export interface ProjectDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  created_at: string;
}

export class ProjectApi {
  private static readonly BASE_PATH = '/api/projects';

  // Create a new project
  static async createProject(data: CreateProjectData): Promise<ApiResponse<Project>> {
    return apiClient.post(this.BASE_PATH, data);
  }

  // Get project by ID
  static async getProject(id: string): Promise<ApiResponse<Project>> {
    return apiClient.get(`${this.BASE_PATH}/${id}`);
  }

  // Update project
  static async updateProject(id: string, data: UpdateProjectData): Promise<ApiResponse<Project>> {
    return apiClient.patch(`${this.BASE_PATH}/${id}`, data);
  }

  // Delete project
  static async deleteProject(projectId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.BASE_PATH}/${projectId}`);
  }

  // List user's projects
  static async listProjects(params?: {
    status?: string;
    category?: string;
    visibility?: string;
  }): Promise<ApiResponse<Project[]>> {
    return apiClient.get(this.BASE_PATH, { params });
  }

  // Upload project document
  static async uploadDocument(
    projectId: string,
    file: File
  ): Promise<ApiResponse<ProjectDocument>> {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post<ProjectDocument>(
      `${this.BASE_PATH}/${projectId}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  // List project documents
  static async listDocuments(
    projectId: string
  ): Promise<ApiResponse<ProjectDocument[]>> {
    return apiClient.get<ProjectDocument[]>(
      `${this.BASE_PATH}/${projectId}/documents`
    );
  }

  // Delete project document
  static async deleteDocument(
    projectId: string,
    documentId: string
  ): Promise<ApiResponse<void>> {
    return apiClient.delete(
      `${this.BASE_PATH}/${projectId}/documents/${documentId}`
    );
  }
}
