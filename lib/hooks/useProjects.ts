import { useState, useEffect } from 'react';
import { subscribeToProjects } from '../utils/supabase-realtime';

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data.projects);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToProjects((payload) => {
      if (payload.eventType === 'INSERT') {
        setProjects((prev) => [payload.new, ...prev]);
      } else if (payload.eventType === 'DELETE') {
        setProjects((prev) => prev.filter((p) => p.id !== payload.old.id));
      } else if (payload.eventType === 'UPDATE') {
        setProjects((prev) =>
          prev.map((p) => (p.id === payload.new.id ? payload.new : p))
        );
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const createProject = async (formData: FormData) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const { project } = await response.json();
      return project;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  return {
    projects,
    loading,
    error,
    createProject,
  };
}
