import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });

  const { data: project, error } = await supabase
    .from('projects')
    .select(`
      *,
      tasks (*),
      members:project_members (
        user_id,
        role,
        users (
          id,
          full_name,
          avatar_url
        )
      )
    `)
    .eq('id', params.id)
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ project });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const { title, description, status } = await request.json();

  const { data: project, error } = await supabase
    .from('projects')
    .update({ title, description, status })
    .eq('id', params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ project });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', params.id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { message: 'Project deleted successfully' },
    { status: 200 }
  );
}
