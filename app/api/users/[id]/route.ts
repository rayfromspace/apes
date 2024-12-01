import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });

  const { data: user, error } = await supabase
    .from('users')
    .select(`
      *,
      projects:project_members (
        project:projects (
          id,
          title,
          status
        ),
        role
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

  return NextResponse.json({ user });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const formData = await request.formData();
  const full_name = formData.get('full_name');
  const avatar = formData.get('avatar') as File | null;

  let avatar_url;
  if (avatar) {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(`${params.id}/${Date.now()}-${avatar.name}`, avatar);

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 400 }
      );
    }

    avatar_url = uploadData.path;
  }

  const updateData: any = {};
  if (full_name) updateData.full_name = full_name;
  if (avatar_url) updateData.avatar_url = avatar_url;

  const { data: user, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ user });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });

  // Remove user from all projects first
  await supabase
    .from('project_members')
    .delete()
    .eq('user_id', params.id);

  // Delete the user
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', params.id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { message: 'User deleted successfully' },
    { status: 200 }
  );
}
