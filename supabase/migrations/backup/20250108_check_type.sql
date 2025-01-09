-- Check if team_permission type exists
SELECT typname, typcategory 
FROM pg_type 
WHERE typname = 'team_permission';
