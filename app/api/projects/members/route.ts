import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// POST - Add a new member to a project
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { projectId, userId, role } = await request.json();

    // Check if the user making the request is the project founder
    const { data: project } = await supabase
      .from('projects')
      .select('founder_id')
      .eq('id', projectId)
      .single();

    if (!project || project.founder_id !== session.user.id) {
      return NextResponse.json({ error: 'Only project founders can add members' }, { status: 403 });
    }

    // Add the new member
    const { data: member, error } = await supabase
      .from('project_members')
      .insert({
        project_id: projectId,
        user_id: userId,
        role: role,
        joined_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(member);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add member' }, { status: 500 });
  }
}

// GET - Get project members with their roles
export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  try {
    const { data: members, error } = await supabase
      .from('project_members')
      .select(`
        *,
        user:users (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('project_id', projectId);

    if (error) throw error;

    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}
