import { create } from "zustand";
import { Project } from "@/types/project";

interface ProjectStore {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [], // Initialize with empty array
  setProjects: (projects) => set({ projects }),
  addProject: (project) =>
    set((state) => ({
      projects: [...state.projects, project],
    })),
  updateProject: (id, project) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...project } : p
      ),
    })),
  removeProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    })),
}));
