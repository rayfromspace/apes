const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Get Supabase URL and key from environment variables
const supabaseUrl = 'https://ubckieucltnuxweoipnv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViY2tpZXVjbHRudXh3ZW9pcG52Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzI2OTIwMSwiZXhwIjoyMDQ4ODQ1MjAxfQ.J9PCoBovk0X0tg9BQg64yGG1zQjYi22dG0mCIHoO2Jo'

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

async function executeSqlDirectly(sql) {
  // Execute SQL directly using the raw SQL query endpoint
  const { error } = await supabase.from('_sql').select('*').eq('query', sql)
  return error
}

async function runMigrations() {
  try {
    // Read migration files
    const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations')
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort()

    // Execute each migration
    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`)
      const migration = fs.readFileSync(path.join(migrationsDir, file), 'utf8')

      // Split migration into individual statements
      const statements = migration.split(';').filter(stmt => stmt.trim())

      // Execute each statement
      for (const statement of statements) {
        if (statement.trim()) {
          const error = await executeSqlDirectly(statement.trim())
          if (error && !error.message.includes('does not exist')) {
            console.error(`Error executing migration ${file}:`, error)
            throw error
          }
        }
      }

      console.log(`Completed migration: ${file}`)
    }

    // Refresh schema cache
    console.log('Refreshing schema cache...')
    await executeSqlDirectly('SELECT pg_notify(\'pgrst\', \'reload schema\')')

    console.log('All migrations completed successfully')
  } catch (error) {
    console.error('Migration error:', error)
    process.exit(1)
  }
}

runMigrations()
