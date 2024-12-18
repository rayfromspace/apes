import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: params.userId,
      },
      include: {
        projects: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        followers: {
          select: {
            follower: {
              select: {
                id: true,
                full_name: true,
                avatar_url: true,
              }
            }
          }
        },
        following: {
          select: {
            following: {
              select: {
                id: true,
                full_name: true,
                avatar_url: true,
              }
            }
          }
        }
      },
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    // Transform the user data to match the expected format
    const transformedUser = {
      id: user.id,
      name: user.full_name,
      email: user.email,
      avatar: user.avatar_url,
      role: user.role,
      bio: user.bio,
      location: user.location,
      company: user.company,
      position: user.position,
      linkedin: user.linkedin_url,
      twitter: user.twitter_url,
      skills: user.skills,
      projects: user.projects,
      stats: {
        followers: user.followers.length,
        following: user.following.length,
        projects: user.projects.length
      }
    }

    return NextResponse.json(transformedUser)
  } catch (error) {
    console.error('Error fetching user:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
