import { useState, useEffect } from 'react';
import { fetchApi, uploadFile } from '../utils/api';
import { useAuth } from '../auth/store';

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  image_url?: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  tasks?: Task[];
  members?: ProjectMember[];
}

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'completed';
  due_date?: string;
  assigned_to?: string;
}

interface ProjectMember {
  user_id: string;
  role: 'owner' | 'member' | 'viewer';
  user: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export function useProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchProjects();
    }
  }, [user?.id]);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await fetchApi<{ projects: Project[] }>('/projects');

    if (error) {
      setError(error.error);
    } else if (data) {
      setProjects(data.projects);
    }
    setLoading(false);
  };

  const createProject = async (
    projectData: FormData
  ) => {
    const { data, error } = await uploadFile('/projects', projectData);

    if (error) {
      setError(error.error);
      return null;
    }

    setProjects((prev) => [data.project, ...prev]);
    return data.project;
  };

  const updateProject = async (
    id: string,
    updates: Partial<Project>,
    image?: File
  ) => {
    const formData = new FormData();
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    if (image) {
      formData.append('image', image);
    }

    const { data, error } = await uploadFile(
      `/projects/${id}`,
      formData,
      { method: 'PATCH' }
    );

    if (error) {
      setError(error.error);
      return null;
    }

    setProjects((prev) =>
      prev.map((proj) => (proj.id === id ? data.project : proj))
    );
    return data.project;
  };

  const deleteProject = async (id: string) => {
    const { error } = await fetchApi(`/projects/${id}`, {
      method: 'DELETE',
    });

    if (error) {
      setError(error.error);
      return false;
    }

    setProjects((prev) => prev.filter((proj) => proj.id !== id));
    return true;
  };

  const addProjectMember = async (
    projectId: string,
    userId: string,
    role: ProjectMember['role']
  ) => {
    const { data, error } = await fetchApi(`/projects/${projectId}/members`, {
      method: 'POST',
      body: JSON.stringify({ userId, role }),
    });

    if (error) {
      setError(error.error);
      return null;
    }

    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === projectId
          ? { ...proj, members: [...(proj.members || []), data.member] }
          : proj
      )
    );
    return data.member;
  };

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    addProjectMember,
    refetch: fetchProjects,
  };
}
