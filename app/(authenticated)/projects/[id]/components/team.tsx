'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ProjectTeam } from '@/components/projects/team';
import { useParams } from 'next/navigation';

export function TeamPage() {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [canManageTeam, setCanManageTeam] = useState(false);
  const params = useParams();
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function loadProjectAndPermissions() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          return;
        }

        // Load project
        const { data: project, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', params.id)
          .single();

        if (projectError) throw projectError;

        // Check if user is founder or admin
        const isFounder = project.founder_id === session.user.id;
        
        if (!isFounder) {
          const { data: teamMember, error: teamError } = await supabase
            .from('team_members')
            .select('role')
            .eq('project_id', params.id)
            .eq('user_id', session.user.id)
            .single();

          if (!teamError && teamMember) {
            setCanManageTeam(teamMember.role === 'admin');
          }
        } else {
          setCanManageTeam(true);
        }

        setProject(project);
      } catch (error) {
        console.error('Error loading project:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProjectAndPermissions();
  }, [params.id, supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        Project not found
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <ProjectTeam project={project} canManageTeam={canManageTeam} />
    </div>
  );
}
