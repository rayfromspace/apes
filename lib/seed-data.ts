import { createClient } from '@supabase/supabase-js'
import type { Database } from './types/database'

// Initialize Supabase client
const supabaseUrl = 'https://ubckieucltnuxweoipnv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViY2tpZXVjbHRudXh3ZW9pcG52Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzI2OTIwMSwiZXhwIjoyMDQ4ODQ1MjAxfQ.J9PCoBovk0X0tg9BQg64yGG1zQjYi22dG0mCIHoO2Jo'
const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// Sample data
const sampleProjects = [
  {
    title: 'AI-Powered Task Manager',
    description: 'A smart task management system that uses AI to prioritize and organize tasks.',
    type: 'product' as const,
    category: 'Software/Apps',
    status: 'planning',
    visibility: 'public' as const,
    tech_stack: ['React', 'Python', 'TensorFlow']
  },
  {
    title: 'Sustainable Energy Marketplace',
    description: 'An online platform connecting renewable energy providers with consumers.',
    type: 'service' as const,
    category: 'Sustainability',
    status: 'planning',
    visibility: 'public' as const,
    tech_stack: ['Vue.js', 'Node.js', 'PostgreSQL']
  }
]

const sampleEvents = [
  {
    title: 'Project Kickoff Meeting',
    description: 'Initial team meeting to discuss project goals and timeline',
    event_date: '2025-01-15',
    start_time: '10:00:00',
    duration: 60,
    type: 'meeting' as const,
    is_virtual: true
  },
  {
    title: 'First Sprint Deadline',
    description: 'Complete initial prototype',
    event_date: '2025-01-30',
    start_time: '17:00:00',
    duration: 0,
    type: 'deadline' as const,
    is_virtual: true
  }
]

export async function seedDatabase() {
  try {
    // Get the first user from auth.users
    const { data: users, error: userError } = await supabase
      .from('auth.users')
      .select('id')
      .limit(1)
      .single()

    if (userError) {
      console.error('Error getting user:', userError)
      return
    }

    const userId = users.id

    // Create projects
    for (const project of sampleProjects) {
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert([
          {
            ...project,
            founder_id: userId
          }
        ])
        .select()
        .single()

      if (projectError) {
        console.error('Error creating project:', projectError)
        continue
      }

      // Create project stats
      const { error: statsError } = await supabase
        .from('project_stats')
        .insert([
          {
            project_id: projectData.id,
            views_count: 0,
            likes_count: 0,
            team_size: 1,
            tasks_completed: 0
          }
        ])

      if (statsError) {
        console.error('Error creating project stats:', statsError)
      }

      // Create events for the project
      for (const event of sampleEvents) {
        const { error: eventError } = await supabase
          .from('events')
          .insert([
            {
              ...event,
              project_id: projectData.id
            }
          ])

        if (eventError) {
          console.error('Error creating event:', eventError)
        }
      }

      // Create an activity for project creation
      const { error: activityError } = await supabase
        .from('activities')
        .insert([
          {
            user_id: userId,
            project_id: projectData.id,
            action_type: 'project_created',
            description: `Created project: ${project.title}`
          }
        ])

      if (activityError) {
        console.error('Error creating activity:', activityError)
      }
    }

    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}
