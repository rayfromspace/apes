-- Update projects table with missing columns
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS total_budget DECIMAL(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS treasury_balance DECIMAL(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS team_size INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS active_tasks INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS completed_tasks INTEGER DEFAULT 0;

-- Update team_members table
ALTER TABLE team_members
ADD COLUMN IF NOT EXISTS salary DECIMAL(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
ADD COLUMN IF NOT EXISTS last_active timestamptz;

-- Create or update function to maintain team size
CREATE OR REPLACE FUNCTION update_project_team_size()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE projects 
    SET team_size = team_size + 1
    WHERE id = NEW.project_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE projects 
    SET team_size = team_size - 1
    WHERE id = OLD.project_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create or update trigger for team size
DROP TRIGGER IF EXISTS update_team_size_trigger ON team_members;
CREATE TRIGGER update_team_size_trigger
AFTER INSERT OR DELETE ON team_members
FOR EACH ROW
EXECUTE FUNCTION update_project_team_size();

-- Create or update function to maintain task counts
CREATE OR REPLACE FUNCTION update_project_task_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.status = 'completed' THEN
      UPDATE projects 
      SET completed_tasks = completed_tasks + 1
      WHERE id = NEW.project_id;
    ELSE
      UPDATE projects 
      SET active_tasks = active_tasks + 1
      WHERE id = NEW.project_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != 'completed' AND NEW.status = 'completed' THEN
      UPDATE projects 
      SET active_tasks = active_tasks - 1,
          completed_tasks = completed_tasks + 1
      WHERE id = NEW.project_id;
    ELSIF OLD.status = 'completed' AND NEW.status != 'completed' THEN
      UPDATE projects 
      SET active_tasks = active_tasks + 1,
          completed_tasks = completed_tasks - 1
      WHERE id = NEW.project_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.status = 'completed' THEN
      UPDATE projects 
      SET completed_tasks = completed_tasks - 1
      WHERE id = OLD.project_id;
    ELSE
      UPDATE projects 
      SET active_tasks = active_tasks - 1
      WHERE id = OLD.project_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create or update trigger for task counts
DROP TRIGGER IF EXISTS update_task_counts_trigger ON tasks;
CREATE TRIGGER update_task_counts_trigger
AFTER INSERT OR UPDATE OR DELETE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_project_task_counts();

-- Update RLS policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects are viewable by team members"
ON projects FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM team_members
        WHERE project_id = id 
        AND user_id = auth.uid()
    )
    OR visibility = 'public'
);

CREATE POLICY "Projects are editable by team members with admin role"
ON projects FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM team_members
        WHERE project_id = id 
        AND user_id = auth.uid()
        AND role IN ('founder', 'admin')
    )
);
