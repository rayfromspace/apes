const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const { seedDatabase } = require('../lib/seed-data');

const supabaseUrl = 'https://ubckieucltnuxweoipnv.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViY2tpZXVjbHRudXh3ZW9pcG52Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzI2OTIwMSwiZXhwIjoyMDQ4ODQ1MjAxfQ.J9PCoBovk0X0tg9BQg64yGG1zQjYi22dG0mCIHoO2Jo';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function readSqlFile(filename: string): Promise<string> {
  return fs.readFileSync(path.join(__dirname, '..', 'supabase', 'migrations', filename), 'utf8');
}

async function executeSql(sql: string): Promise<void> {
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
  if (error) throw error;
  return data;
}

async function runMigrations() {
  try {
    console.log('Starting migrations...');

    // 1. Drop tables
    console.log('Running drop tables script...');
    const dropTablesSQL = await readSqlFile('20240110_drop_tables.sql');
    await executeSql(dropTablesSQL);

    // 2. Create tables
    console.log('Running create tables script...');
    const createTablesSQL = await readSqlFile('20240110_create_tables.sql');
    await executeSql(createTablesSQL);

    // 3. Enable RLS
    console.log('Running enable RLS script...');
    const enableRlsSQL = await readSqlFile('20240110_enable_rls.sql');
    await executeSql(enableRlsSQL);

    // 4. Run seed script
    console.log('Running seed script...');
    await seedDatabase(supabase);

    // 5. Refresh schema cache
    console.log('Refreshing schema cache...');
    await executeSql('SELECT pg_notify(\'pgrst\', \'reload schema\');');

    console.log('All migrations and seeding completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

runMigrations();
