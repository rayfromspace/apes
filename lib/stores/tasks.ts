import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'completed';
  projectId?: string;
  assigneeId?: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate: string;
  priority: Task['priority'];
  status: Task['status'];
  projectId?: string;
  assigneeId?: string;
}

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: (projectId?: string) => Promise<void>;
  createTask: (task: CreateTaskInput) => Promise<Task | null>;
  updateTask: (id: string, task: Partial<Task>) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
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
          creator:creator_id (
            id,
            email
          ),
          assignee:assignee_id (
            id,
            email
          )
        `)
        .order('due_date', { ascending: true });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data: tasks, error } = await query;

      if (error) throw error;

      const formattedTasks: Task[] = tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        dueDate: task.due_date,
        priority: task.priority,
        status: task.status,
        projectId: task.project_id,
        assigneeId: task.assignee_id,
        creatorId: task.creator_id,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
      }));

      set({ tasks: formattedTasks, isLoading: false });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      set({ error: 'Failed to fetch tasks', isLoading: false });
    }
  },

  createTask: async (taskInput: CreateTaskInput) => {
    set({ isLoading: true, error: null });
    try {
      const { data: task, error } = await supabase
        .from('tasks')
        .insert({
          title: taskInput.title,
          description: taskInput.description,
          due_date: taskInput.dueDate,
          priority: taskInput.priority,
          status: taskInput.status,
          project_id: taskInput.projectId,
          assignee_id: taskInput.assigneeId,
        })
        .select()
        .single();

      if (error) throw error;

      // Fetch updated tasks
      await get().fetchTasks(taskInput.projectId);

      set({ isLoading: false });
      return task as Task;
    } catch (error) {
      console.error('Error creating task:', error);
      set({ error: 'Failed to create task', isLoading: false });
      return null;
    }
  },

  updateTask: async (id: string, taskUpdate: Partial<Task>) => {
    set({ isLoading: true, error: null });
    try {
      const { data: task, error } = await supabase
        .from('tasks')
        .update({
          title: taskUpdate.title,
          description: taskUpdate.description,
          due_date: taskUpdate.dueDate,
          priority: taskUpdate.priority,
          status: taskUpdate.status,
          project_id: taskUpdate.projectId,
          assignee_id: taskUpdate.assigneeId,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Fetch updated tasks
      await get().fetchTasks(taskUpdate.projectId);

      set({ isLoading: false });
      return task as Task;
    } catch (error) {
      console.error('Error updating task:', error);
      set({ error: 'Failed to update task', isLoading: false });
      return null;
    }
  },

  deleteTask: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        isLoading: false,
      }));

      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      set({ error: 'Failed to delete task', isLoading: false });
      return false;
    }
  },
}));
