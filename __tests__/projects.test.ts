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

  describe('Project Creation', () => {
    it('should create new project', async () => {
      const { result } = renderHook(() => useProjects());
      const mockCreateProject = vi.fn().mockResolvedValue({ data: mockProject });
      
      render(<CreateProjectForm onSubmit={mockCreateProject} />);
      
      await userEvent.type(screen.getByLabelText(/title/i), mockProject.title);
      await userEvent.type(screen.getByLabelText(/description/i), mockProject.description);
      await userEvent.type(screen.getByLabelText(/funding goal/i), '100000');
      await userEvent.click(screen.getByRole('button', { name: /create/i }));

      await waitFor(() => {
        expect(mockCreateProject).toHaveBeenCalledWith(expect.objectContaining({
          title: mockProject.title,
          description: mockProject.description,
          funding_goal: 100000,
        }));
      });
    });

    it('should handle project creation errors', async () => {
      const { result } = renderHook(() => useProjects());
      const mockCreateProject = vi.fn().mockRejectedValue(new Error('Failed to create project'));
      
      render(<CreateProjectForm onSubmit={mockCreateProject} />);
      
      await userEvent.type(screen.getByLabelText(/title/i), mockProject.title);
      await userEvent.click(screen.getByRole('button', { name: /create/i }));

      await waitFor(() => {
        expect(screen.getByText(/failed to create project/i)).toBeInTheDocument();
      });
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
