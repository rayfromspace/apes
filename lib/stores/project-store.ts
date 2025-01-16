import { create } from "zustand";
import { Project } from "@/types/project";
import { supabase } from "@/lib/supabase/client";

interface ProjectStats {
  teamCount: number;
  updateCount: number;
  documentCount: number;
}

interface ProjectStore {
  projects: Project[];
  projectStats: Record<string, ProjectStats>;
  loading: boolean;
  error: string | null;
  setProjects: (projects: Project[]) => void;
  fetchProjects: (userId?: string) => Promise<void>;
  fetchProjectStats: (projectId: string) => Promise<void>;
  addProject: (project: Project) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  removeProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  projectStats: {},
  loading: false,
  error: null,

  setProjects: (projects) => set({ projects }),

  fetchProjects: async (userId?: string) => {
    set({ loading: true, error: null });
    try {
      const { data: projects, error } = await supabase
        .rpc('get_user_projects', { p_user_id: userId });

      if (error) throw error;

      // Fetch team members in a separate query to avoid recursion
      const projectIds = projects?.map(p => p.id) || [];
      const { data: teamMembers, error: teamError } = await supabase
        .from('team_members')
        .select(`
          id,
          role,
          user_id,
          project_id,
          users (
            id,
            email,
            name,
            avatar_url
          )
        `)
        .in('project_id', projectIds);

      if (teamError) throw teamError;

      // Combine projects with their team members
      const transformedProjects = projects?.map(project => ({
        ...project,
        team_members: teamMembers?.filter(tm => tm.project_id === project.id) || []
      })) || [];

      set({ projects: transformedProjects, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchProjectStats: async (projectId: string) => {
    try {
      const { data: stats, error } = await supabase
        .rpc('get_project_stats', { p_project_id: projectId });

      if (error) throw error;

      if (stats) {
        set((state) => ({
          projectStats: {
            ...state.projectStats,
            [projectId]: {
              teamCount: stats.team_count,
              updateCount: stats.update_count,
              documentCount: stats.document_count
            }
          }
        }));
      }
    } catch (error: any) {
      console.error('Error fetching project stats:', error);
    }
  },

  addProject: async (project) => {
    set({ loading: true, error: null });
    try {
      // Insert project first
      const { data: newProject, error } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single();

      if (error) throw error;
      if (newProject) {
        // Add team member entry for project founder
        const { data: teamMember, error: teamError } = await supabase
          .from('team_members')
          .insert({
            project_id: newProject.id,
            user_id: newProject.founder_id,
            role: 'founder'
          })
          .select(`
            id,
            role,
            user_id,
            users (
              id,
              email,
              name,
              avatar_url
            )
          `)
          .single();

        if (teamError) throw teamError;

        set((state) => ({
          projects: [{
            ...newProject,
            team_members: teamMember ? [teamMember] : []
          }, ...state.projects],
          loading: false
        }));
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateProject: async (id, project) => {
    set({ loading: true, error: null });
    try {
      // Update project first
      const { data: updatedProject, error } = await supabase
        .from('projects')
        .update(project)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (updatedProject) {
        // Fetch team members separately
        const { data: teamMembers, error: teamError } = await supabase
          .from('team_members')
          .select(`
            id,
            role,
            user_id,
            users (
              id,
              email,
              name,
              avatar_url
            )
          `)
          .eq('project_id', id);

        if (teamError) throw teamError;

        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? {
              ...p,
              ...updatedProject,
              team_members: teamMembers || []
            } : p
          ),
          loading: false
        }));
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  removeProject: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        projectStats: {
          ...state.projectStats,
          [id]: undefined
        },
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
