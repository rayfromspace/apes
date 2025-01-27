import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        id,
        title,
        description,
        type,
        category,
        status,
        visibility,
        created_at,
        founder_id,
        team_members (
          id,
          role,
          user_id
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data: projects });
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const imageFile = formData.get('image') as File;

    if (!title) {
      return NextResponse.json(
        { error: "Project title is required" },
        { status: 400 }
      );
    }

    // Handle image upload if present
    let imagePath = null;
    if (imageFile) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(`public/${imageFile.name}`, imageFile, {
          upsert: true,
        });

      if (uploadError) {
        return NextResponse.json({ error: uploadError.message }, { status: 400 });
      }
      imagePath = uploadData.Key;
    }

    // Create project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert([
        {
          title,
          description,
          image_url: imagePath,
          founder_id: session.user.id,
        },
      ])
      .select(`
        id,
        title,
        description,
        type,
        category,
        status,
        visibility,
        created_at,
        founder_id,
        team_members (
          id,
          role,
          user_id
        )
      `);

    if (projectError) throw projectError;

    return NextResponse.json({ data: project[0] });
  } catch (error: any) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create project" },
      { status: 500 }
    );
  }
}
