-- Drop existing foreign key if it exists
ALTER TABLE IF EXISTS team_members
DROP CONSTRAINT IF EXISTS team_members_user_id_fkey;

-- Add the correct foreign key constraint
ALTER TABLE team_members
ADD CONSTRAINT team_members_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id)
ON DELETE CASCADE;
