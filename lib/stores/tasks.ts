import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import { subscribeToProjectTasks } from '@/lib/utils/supabase-realtime';
import { useAuth } from '@/lib/auth/store';

export interface Task {
  id: string;
  title: string;
  description?: string;
  due_date: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'completed';
  project_id?: string;
  assignee_id?: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  assignee?: {
    id: string;
    email: string;
    avatar_url?: string;
  };
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  due_date: string;
  priority: Task['priority'];
  status: Task['status'];
  project_id?: string;
  assignee_id?: string;
}

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: (projectId?: string) => Promise<void>;
  createTask: (task: CreateTaskInput) => Promise<Task | null>;
  updateTask: (id: string, task: Partial<Task>) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
  reorderTasks: (projectId: string, taskId: string, newStatus: Task['status']) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async (projectId?: string) => {
    set({ isLoading: true, error: null });
    try {
      let query = supabase
        .from('tasks')
        .select(`
          *,
          assignee:assignee_id (
            id,
            email,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data: tasks, error } = await query;

      if (error) throw error;
      set({ tasks: tasks || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createTask: async (taskInput: CreateTaskInput) => {
    try {
      console.log('Getting user from auth store...');
      const user = useAuth.getState().user;
      if (!user) {
        console.error('No authenticated user found');
        throw new Error('Not authenticated');
      }

      // Validate required fields
      if (!taskInput.title) {
        throw new Error('Title is required');
      }
      if (!taskInput.due_date) {
        throw new Error('Due date is required');
      }
      if (!taskInput.priority) {
        throw new Error('Priority is required');
      }
      if (!taskInput.status) {
        throw new Error('Status is required');
      }

      console.log('Creating task with input:', taskInput);
      console.log('User ID:', user.id);
      
      // Format data to match Supabase schema
      const taskData = {
        title: taskInput.title.trim(),
        description: taskInput.description?.trim() || null,
        due_date: taskInput.due_date,  // Should be in YYYY-MM-DD format
        priority: taskInput.priority,
        status: taskInput.status,
        project_id: taskInput.project_id || null,
        assignee_id: taskInput.assignee_id || null,
        creator_id: user.id
      };

      console.log('Sending task data to Supabase:', taskData);
      
      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select(`
          *,
          assignee:assignee_id (
            id,
            email,
            avatar_url
          )
        `)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!data) {
        console.error('No data returned from Supabase');
        throw new Error('Failed to create task');
      }
      
      console.log('Task created successfully:', data);
      const { tasks } = get();
      set({ tasks: [data, ...tasks], error: null });
      return data;
    } catch (error: any) {
      console.error('Error in createTask:', error);
      set({ error: error.message });
      throw error;
    }
  },

  updateTask: async (id: string, taskUpdate: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(taskUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const { tasks } = get();
      set({ tasks: tasks.map(t => t.id === id ? data : t) });
      return data;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  deleteTask: async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      const { tasks } = get();
      set({ tasks: tasks.filter(t => t.id !== id) });
      return true;
    } catch (error: any) {
      set({ error: error.message });
      return false;
    }
  },

  reorderTasks: async (projectId: string, taskId: string, newStatus: Task['status']) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId)
        .eq('project_id', projectId);

      if (error) throw error;
      
      const { tasks } = get();
      set({ 
        tasks: tasks.map(t => 
          t.id === taskId ? { ...t, status: newStatus } : t
        ) 
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  }
}));
