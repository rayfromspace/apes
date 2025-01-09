import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json(
      { error: { message: 'You must be logged in to create a project' } },
      { status: 401 }
    );
  }

  try {
    const projectData = await request.json();
    
    // Validate required fields
    if (!projectData.name?.trim()) {
      return NextResponse.json(
        { error: { message: 'Project name is required' } },
        { status: 400 }
      );
    }

    // Create project with only essential fields
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        name: projectData.name.trim(),
        founder_id: session.user.id
      })
      .select()
      .single();

    if (projectError) {
      console.error('Project creation error:', projectError);
      return NextResponse.json(
        { error: { message: projectError.message || 'Failed to create project' } },
        { status: 500 }
      );
    }

    // Add the creator as the founder in team_members
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        project_id: project.id,
        user_id: session.user.id,
        role: 'founder'
      });

    if (memberError) {
      console.error('Member creation error:', memberError);
      return NextResponse.json(
        { error: { message: memberError.message || 'Failed to add project member' } },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: project });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: { message: error instanceof Error ? error.message : 'Failed to create project' } },
      { status: 500 }
    );
  }
}
