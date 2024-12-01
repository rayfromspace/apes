import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const subscribeToProjects = (callback: (payload: any) => void) => {
  const supabase = createClientComponentClient();
  
  const subscription = supabase
    .channel('projects_channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'projects',
      },
      (payload) => callback(payload)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};

export const subscribeToProjectTasks = (projectId: string, callback: (payload: any) => void) => {
  const supabase = createClientComponentClient();
  
  const subscription = supabase
    .channel(`project_${projectId}_tasks`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `project_id=eq.${projectId}`,
      },
      (payload) => callback(payload)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};
