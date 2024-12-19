import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        visibility: true,
        created_at: true,
        description: true,
        founder: {
          select: {
            full_name: true,
            email: true
          }
        }
      },
      orderBy: {
        created_at: "desc"
      }
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const imageFile = formData.get('image') as File;

    if (!name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    // Handle image upload if present
    let imagePath = null;
    if (imageFile) {
      const { data: uploadData, error: uploadError } = await prisma.projectImage.create({
        data: {
          image: {
            upload: imageFile
          }
        }
      });

      if (uploadError) {
        return NextResponse.json({ error: uploadError.message }, { status: 400 });
      }
      imagePath = uploadData.image.url;
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        name,
        description,
        image_url: imagePath,
        founder: {
          connect: {
            id: session.user.id
          }
        }
      },
      include: {
        founder: {
          select: {
            full_name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
