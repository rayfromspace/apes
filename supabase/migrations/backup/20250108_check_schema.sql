-- Check existing tables and their structures
SELECT 
    table_name,
    column_name,
    data_type,
    column_default,
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name IN ('team_members', 'team_invites')
ORDER BY 
    table_name,
    ordinal_position;

-- Check existing policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM
    pg_policies
WHERE
    tablename IN ('team_members', 'team_invites');

-- Check existing types
SELECT
    t.typname,
    e.enumlabel
FROM
    pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
WHERE
    t.typname = 'team_permission'
ORDER BY
    e.enumsortorder;
