const { createClient } = require('@supabase/supabase-js');
const { seedDatabase } = require('../lib/seed-data');

const supabaseUrl = 'https://ubckieucltnuxweoipnv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViY2tpZXVjbHRudXh3ZW9pcG52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyNjkyMDEsImV4cCI6MjA0ODg0NTIwMX0.-UAQWs7uKJ4v0YXFq9UPfeEuW8Yh_VZOrAD6yFjAMSs';

const supabase = createClient(supabaseUrl, supabaseKey);

seedDatabase(supabase)
  .then((result: any) => {
    console.log('Database seeded successfully!', result);
    process.exit(0);
  })
  .catch((error: Error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  });
