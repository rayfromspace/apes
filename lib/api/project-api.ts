import { supabase } from '@/lib/supabase/client';
import { Project, CreateProjectData, UpdateProjectData } from '@/types/project';

export class ProjectApi {
  // Create a new project
  static async createProject(data: CreateProjectData): Promise<Project> {
    const { data: project, error } = await supabase
      .from('projects')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    if (!project) throw new Error('Failed to create project');

    return project;
  }

  // Get project by ID
  static async getProject(id: string): Promise<Project> {
    const { data: project, error } = await supabase
      .from('projects')
      .select('*, team_members(*), milestones(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!project) throw new Error('Project not found');

    return project;
  }

  // Update project
  static async updateProject(id: string, data: UpdateProjectData): Promise<Project> {
    const { data: project, error } = await supabase
      .from('projects')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!project) throw new Error('Failed to update project');

    return project;
  }

  // Delete project
  static async deleteProject(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // List projects with filters
  static async listProjects(params?: {
    status?: string;
    category?: string;
    visibility?: string;
    userId?: string;
  }): Promise<Project[]> {
    let query = supabase
      .from('projects')
      .select('*, team_members(*)');

    if (params?.status) {
      query = query.eq('status', params.status);
    }
    if (params?.category) {
      query = query.eq('category', params.category);
    }
    if (params?.visibility) {
      query = query.eq('visibility', params.visibility);
    }
    if (params?.userId) {
      query = query.eq('founder_id', params.userId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Upload project document
  static async uploadDocument(projectId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${projectId}/${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('project-documents')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('project-documents')
      .getPublicUrl(fileName);

    const { error: dbError } = await supabase
      .from('project_documents')
      .insert([
        {
          project_id: projectId,
          file_name: file.name,
          file_path: fileName,
          file_type: file.type,
          size: file.size,
          url: publicUrl
        }
      ]);

    if (dbError) throw dbError;
    return publicUrl;
  }

  // List project documents
  static async listDocuments(projectId: string) {
    const { data, error } = await supabase
      .from('project_documents')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Delete project document
  static async deleteDocument(projectId: string, documentId: string): Promise<void> {
    const { data: doc, error: fetchError } = await supabase
      .from('project_documents')
      .select('file_path')
      .eq('id', documentId)
      .single();

    if (fetchError) throw fetchError;
    if (!doc) throw new Error('Document not found');

    const { error: storageError } = await supabase.storage
      .from('project-documents')
      .remove([doc.file_path]);

    if (storageError) throw storageError;

    const { error: dbError } = await supabase
      .from('project_documents')
      .delete()
      .eq('id', documentId);

    if (dbError) throw dbError;
  }
}
