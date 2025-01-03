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

    if (!projectData.type?.trim()) {
      return NextResponse.json(
        { error: { message: 'Project type is required' } },
        { status: 400 }
      );
    }

    // First, create the project with basic info
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        title: projectData.name.trim(),
        description: projectData.description?.trim() || '',
        cover_image: projectData.image_url,
        visibility: projectData.visibility || 'private',
        status: 'draft',
        tags: projectData.tags || [],
        founder_id: session.user.id,
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

    // Then update with additional fields
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        slug: `${project.id}-${projectData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        stage: projectData.type,
        industry: projectData.category || 'Other',
        team_size: 1,
        project_health: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', project.id);

    if (updateError) {
      console.error('Project update error:', updateError);
      return NextResponse.json(
        { error: { message: updateError.message || 'Failed to update project details' } },
        { status: 500 }
      );
    }

    // Add the creator as the founder in project_members
    const { error: memberError } = await supabase
      .from('project_members')
      .insert({
        project_id: project.id,
        user_id: session.user.id,
        role: 'founder',
        joined_at: new Date().toISOString()
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
