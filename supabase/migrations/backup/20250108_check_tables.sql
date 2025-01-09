-- Check if tables exist and their structure
SELECT table_name, column_name, data_type, udt_name
FROM information_schema.columns
WHERE table_name IN ('team_members', 'team_invites')
ORDER BY table_name, ordinal_position;
