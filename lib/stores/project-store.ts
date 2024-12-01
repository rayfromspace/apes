import { create } from "zustand";
import { Project, ProjectFiltersState } from "@/types/project";

interface ProjectStore {
  projects: Project[];
  filters: ProjectFiltersState;
  isLoading: boolean;
  error: string | null;
  setProjects: (projects: Project[]) => void;
  setFilters: (filters: ProjectFiltersState) => void;
  fetchProjects: () => Promise<void>;
  createProject: (project: Omit<Project, "id">) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  filters: {},
  isLoading: false,
  error: null,

  setProjects: (projects) => set({ projects }),
  
  setFilters: (filters) => set({ filters }),

  fetchProjects: async () => {
    try {
      set({ isLoading: true, error: null });
      // TODO: Replace with actual API call
      const response = await fetch('/api/projects');
      const data = await response.json();
      set({ projects: data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch projects', isLoading: false });
    }
  },

  createProject: async (project) => {
    try {
      set({ isLoading: true, error: null });
      // TODO: Replace with actual API call
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      const newProject = await response.json();
      set((state) => ({
        projects: [...state.projects, newProject],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to create project', isLoading: false });
    }
  },

  updateProject: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      // TODO: Replace with actual API call
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const updatedProject = await response.json();
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? { ...p, ...updatedProject } : p
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update project', isLoading: false });
    }
  },

  deleteProject: async (id) => {
    try {
      set({ isLoading: true, error: null });
      // TODO: Replace with actual API call
      await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete project', isLoading: false });
    }
  },
}));
