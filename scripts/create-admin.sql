INSERT INTO "users" (
  id,
  email,
  full_name,
  role,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'blackwoodroen@gmail.com',
  'Roen Blackwood',
  'admin',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);
