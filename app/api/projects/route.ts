import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const formData = await request.formData();
  
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const imageFile = formData.get('image') as File;

  // Handle image upload if present
  let imagePath = null;
  if (imageFile) {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(`${Date.now()}-${imageFile.name}`, imageFile);

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 400 });
    }
    imagePath = uploadData.path;
  }

  // Create project
  const { data: project, error } = await supabase
    .from('projects')
    .insert([
      {
        title,
        description,
        image_url: imagePath,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ project });
}
