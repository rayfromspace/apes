import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Project } from "@/types/project";
import { TEST_PROJECTS } from "@/data/test-projects";

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projects: TEST_PROJECTS, // Initialize with test projects
      selectedProject: null,
      setSelectedProject: (project) => set({ selectedProject: project }),
      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, project],
        })),
      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? { ...project, ...updates } : project
          ),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
          selectedProject:
            state.selectedProject?.id === id ? null : state.selectedProject,
        })),
    }),
    {
      name: "project-store",
      partialize: (state) => ({
        projects: state.projects,
        selectedProject: state.selectedProject,
      }),
    }
  )
);
