import { apiClient, ApiResponse } from './api-client';

export interface Project {
  id: string;
  name: string;
  description?: string;
  pitch_deck_url?: string;
  website_url?: string;
  status: 'draft' | 'active' | 'funding' | 'completed' | 'cancelled';
  visibility: 'private' | 'public' | 'unlisted';
  funding_goal?: number;
  raised_amount: number;
  category?: string;
  tags: string[];
  founder_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  website_url?: string;
  category?: string;
  tags?: string[];
  visibility?: 'private' | 'public' | 'unlisted';
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  status?: 'draft' | 'active' | 'funding' | 'completed' | 'cancelled';
  funding_goal?: number;
}

export interface ProjectDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  created_at: string;
}

export class ProjectApi {
  private static readonly BASE_PATH = '/projects';

  // Create a new project
  static async createProject(data: CreateProjectData): Promise<ApiResponse<Project>> {
    return apiClient.post<Project>(this.BASE_PATH, data);
  }

  // Get project by ID
  static async getProject(projectId: string): Promise<ApiResponse<Project>> {
    return apiClient.get<Project>(`${this.BASE_PATH}/${projectId}`);
  }

  // Update project
  static async updateProject(
    projectId: string,
    data: UpdateProjectData
  ): Promise<ApiResponse<Project>> {
    return apiClient.patch<Project>(`${this.BASE_PATH}/${projectId}`, data);
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
    return apiClient.get<Project[]>(this.BASE_PATH, { params });
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
