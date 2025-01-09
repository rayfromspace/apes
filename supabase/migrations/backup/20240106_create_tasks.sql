-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    due_date date NOT NULL,
    priority text NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
    status text NOT NULL CHECK (status IN ('todo', 'in_progress', 'completed')),
    project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
    assignee_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    creator_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create task comments table
CREATE TABLE IF NOT EXISTS public.task_comments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;

-- Tasks policies
CREATE POLICY "Users can view tasks they created or are assigned to" ON public.tasks
    FOR SELECT USING (
        auth.uid() = creator_id OR
        auth.uid() = assignee_id OR
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE id = project_id AND creator_id = auth.uid()
        )
    );

CREATE POLICY "Users can create tasks" ON public.tasks
    FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update tasks they created or are assigned to" ON public.tasks
    FOR UPDATE USING (
        auth.uid() = creator_id OR
        auth.uid() = assignee_id
    );

CREATE POLICY "Users can delete their own tasks" ON public.tasks
    FOR DELETE USING (auth.uid() = creator_id);

-- Task comments policies
CREATE POLICY "Users can view comments on tasks they can see" ON public.task_comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.tasks
            WHERE id = task_id AND (
                creator_id = auth.uid() OR
                assignee_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.projects
                    WHERE id = project_id AND creator_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Users can create comments on tasks they can see" ON public.task_comments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.tasks
            WHERE id = task_id AND (
                creator_id = auth.uid() OR
                assignee_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.projects
                    WHERE id = project_id AND creator_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Users can update their own comments" ON public.task_comments
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments" ON public.task_comments
    FOR DELETE USING (user_id = auth.uid());

-- Create updated_at trigger
CREATE TRIGGER handle_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
