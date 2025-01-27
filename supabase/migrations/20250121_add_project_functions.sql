-- Create the delete_project function
CREATE OR REPLACE FUNCTION public.delete_project(p_project_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_founder_id UUID;
BEGIN
    -- Get the founder_id for the project
    SELECT founder_id INTO v_founder_id
    FROM public.projects
    WHERE id = p_project_id;

    -- Check if the user is the founder
    IF v_founder_id != auth.uid() THEN
        RAISE EXCEPTION 'Only the project founder can delete the project';
    END IF;

    -- Delete the project (this will cascade to related tables due to foreign key constraints)
    DELETE FROM public.projects
    WHERE id = p_project_id
    AND founder_id = auth.uid();
END;
$$;
