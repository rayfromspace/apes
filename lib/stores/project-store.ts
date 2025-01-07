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
      let query = supabase
        .from('projects')
        .select(`
          *,
          team_members (
            id,
            role,
            user_id,
            users (
              id,
              email,
              name,
              avatar_url
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.or(`founder_id.eq.${userId},team_members.user_id.eq.${userId}`);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Transform the data to include team members
      const transformedProjects = data?.map(project => ({
        ...project,
        team_members: project.team_members || []
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
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select(`
          *,
          team_members (
            id,
            role,
            user_id,
            users (
              id,
              email,
              name,
              avatar_url
            )
          )
        `)
        .single();

      if (error) throw error;
      if (data) {
        // Add team member entry for project founder
        const { error: teamError } = await supabase
          .from('team_members')
          .insert({
            project_id: data.id,
            user_id: data.founder_id,
            role: 'founder'
          });

        if (teamError) {
          console.error('Error creating team member:', teamError);
        }

        set((state) => ({
          projects: [{ ...data, team_members: data.team_members || [] }, ...state.projects],
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
      const { data, error } = await supabase
        .from('projects')
        .update(project)
        .eq('id', id)
        .select(`
          *,
          team_members (
            id,
            role,
            user_id,
            users (
              id,
              email,
              name,
              avatar_url
            )
          )
        `)
        .single();

      if (error) throw error;
      if (data) {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...data, team_members: data.team_members || [] } : p
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
