import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ubckieucltnuxweoipnv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViY2tpZXVjbHRudXh3ZW9pcG52Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzI2OTIwMSwiZXhwIjoyMDQ4ODQ1MjAxfQ.J9PCoBovk0X0tg9BQg64yGG1zQjYi22dG0mCIHoO2Jo'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDatabase() {
  try {
    // Try to select from projects table
    console.log('Checking projects table...')
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
    
    if (projectsError) {
      console.error('Error getting projects:', projectsError)
    } else {
      console.log('Projects:', projects)
    }

    // Try to select from events table
    console.log('\nChecking events table...')
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
    
    if (eventsError) {
      console.error('Error getting events:', eventsError)
    } else {
      console.log('Events:', events)
    }

    // Try to select from activities table
    console.log('\nChecking activities table...')
    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .select('*')
    
    if (activitiesError) {
      console.error('Error getting activities:', activitiesError)
    } else {
      console.log('Activities:', activities)
    }

    // Try to select from project_stats table
    console.log('\nChecking project_stats table...')
    const { data: stats, error: statsError } = await supabase
      .from('project_stats')
      .select('*')
    
    if (statsError) {
      console.error('Error getting project stats:', statsError)
    } else {
      console.log('Project Stats:', stats)
    }

  } catch (error) {
    console.error('Error checking database:', error)
  }
}

checkDatabase()
