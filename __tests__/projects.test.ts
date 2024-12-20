import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useProjects } from '@/lib/hooks/use-projects';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    })),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(),
        getPublicUrl: vi.fn(),
      })),
    },
  })),
}));

const mockProject = {
  id: '1',
  title: 'Test Project',
  description: 'Test Description',
  category: 'technology',
  status: 'active',
  funding_goal: 100000,
  current_funding: 50000,
  progress: 50,
  start_date: new Date().toISOString(),
};

describe('Projects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Project List', () => {
    it('should render project list', async () => {
      const { result } = renderHook(() => useProjects());
      
      render(<ProjectList projects={[mockProject]} />);
      
      expect(screen.getByText(mockProject.title)).toBeInTheDocument();
      expect(screen.getByText(mockProject.description)).toBeInTheDocument();
    });

    it('should filter projects by category', async () => {
      const { result } = renderHook(() => useProjects());
      
      render(<ProjectList projects={[mockProject]} />);
      
      await userEvent.click(screen.getByRole('button', { name: /filter/i }));
      await userEvent.click(screen.getByRole('option', { name: /technology/i }));
      
      expect(screen.getByText(mockProject.title)).toBeInTheDocument();
    });

    it('should sort projects by funding progress', async () => {
      const { result } = renderHook(() => useProjects());
      
      render(<ProjectList projects={[mockProject]} />);
      
      await userEvent.click(screen.getByRole('button', { name: /sort/i }));
      await userEvent.click(screen.getByRole('option', { name: /progress/i }));
      
      expect(screen.getByText('50%')).toBeInTheDocument();
    });
  });

  describe('Project Details', () => {
    it('should render project details', async () => {
      const { result } = renderHook(() => useProjects());
      
      render(<ProjectDetails project={mockProject} />);
      
      expect(screen.getByText(mockProject.title)).toBeInTheDocument();
      expect(screen.getByText(mockProject.description)).toBeInTheDocument();
      expect(screen.getByText('$50,000')).toBeInTheDocument();
      expect(screen.getByText('$100,000')).toBeInTheDocument();
    });

    it('should update project details', async () => {
      const { result } = renderHook(() => useProjects());
      const mockUpdateProject = vi.fn().mockResolvedValue({ 
        data: { ...mockProject, title: 'Updated Title' } 
      });
      
      import { ProjectDetails } from '@/components/projects/project-details';
      render(<ProjectDetails project={mockProject} onUpdate={mockUpdateProject} />);
      
      await userEvent.click(screen.getByRole('button', { name: /edit/i }));
      await userEvent.clear(screen.getByLabelText(/title/i));
      await userEvent.type(screen.getByLabelText(/title/i), 'Updated Title');
      await userEvent.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        expect(mockUpdateProject).toHaveBeenCalledWith(expect.objectContaining({
          title: 'Updated Title',
        }));
      });
    });
  });
});
function renderHook(arg0: () => { projects: import("@/lib/hooks/use-projects").Project[]; loading: boolean; error: string | null; createProject: (projectData: FormData) => Promise<any>; updateProject: (id: string, updates: Partial<import("@/lib/hooks/use-projects").Project>, image?: File) => Promise<any>; deleteProject: (id: string) => Promise<boolean>; addProjectMember: (projectId: string, userId: string, role: "owner" | "member" | "viewer") => Promise<any>; refetch: () => Promise<void>; }): { result: any; } {
  throw new Error('Function not implemented.');
}
