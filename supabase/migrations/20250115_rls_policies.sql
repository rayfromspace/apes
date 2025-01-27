-- RLS Policies for all tables

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Projects policies
CREATE POLICY "Projects are viewable by members"
ON public.projects FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_members.project_id = id
    AND project_members.profile_id = auth.uid()
  )
  OR created_by = auth.uid()
  OR status = 'public'
);

CREATE POLICY "Project creators can insert"
ON public.projects FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Project admins can update"
ON public.projects FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_members.project_id = id
    AND project_members.profile_id = auth.uid()
    AND project_members.role = 'admin'
  )
  OR created_by = auth.uid()
);

-- Project members policies
CREATE POLICY "Project members are viewable by project members"
ON public.project_members FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.project_members pm
    WHERE pm.project_id = project_id
    AND pm.profile_id = auth.uid()
  )
);

CREATE POLICY "Project admins can manage members"
ON public.project_members FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_members.project_id = project_id
    AND project_members.profile_id = auth.uid()
    AND project_members.role = 'admin'
  )
);

-- Learning pools policies
CREATE POLICY "Public pools are viewable by everyone"
ON public.learning_pools FOR SELECT
TO authenticated
USING (
  NOT is_private OR created_by = auth.uid()
);

CREATE POLICY "Users can create pools"
ON public.learning_pools FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Pool creators can update"
ON public.learning_pools FOR UPDATE
TO authenticated
USING (auth.uid() = created_by);

-- Learning courses policies
CREATE POLICY "Courses are viewable by pool members"
ON public.learning_courses FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.learning_pools
    WHERE learning_pools.id = pool_id
    AND (NOT learning_pools.is_private OR learning_pools.created_by = auth.uid())
  )
);

CREATE POLICY "Pool members can create courses"
ON public.learning_courses FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.learning_pools
    WHERE learning_pools.id = pool_id
    AND learning_pools.created_by = auth.uid()
  )
);

-- Posts policies
CREATE POLICY "Posts are viewable by project members"
ON public.posts FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_members.project_id = project_id
    AND project_members.profile_id = auth.uid()
  )
  OR project_id IS NULL
);

CREATE POLICY "Users can create posts"
ON public.posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Post authors can update own posts"
ON public.posts FOR UPDATE
TO authenticated
USING (auth.uid() = author_id);

-- Comments policies
CREATE POLICY "Comments are viewable by post viewers"
ON public.comments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.posts
    WHERE posts.id = post_id
    AND (
      EXISTS (
        SELECT 1 FROM public.project_members
        WHERE project_members.project_id = posts.project_id
        AND project_members.profile_id = auth.uid()
      )
      OR posts.project_id IS NULL
    )
  )
);

CREATE POLICY "Users can create comments"
ON public.comments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

-- Value stakes policies
CREATE POLICY "Stakes are viewable by project members"
ON public.value_stakes FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_members.project_id = project_id
    AND project_members.profile_id = auth.uid()
  )
);

CREATE POLICY "Project admins can manage stakes"
ON public.value_stakes FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_members.project_id = project_id
    AND project_members.profile_id = auth.uid()
    AND project_members.role = 'admin'
  )
);

-- NFT contracts policies
CREATE POLICY "Contracts are viewable by project members"
ON public.nft_contracts FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_members.project_id = project_id
    AND project_members.profile_id = auth.uid()
  )
);

CREATE POLICY "Project admins can manage contracts"
ON public.nft_contracts FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_members.project_id = project_id
    AND project_members.profile_id = auth.uid()
    AND project_members.role = 'admin'
  )
);

-- Payments policies
CREATE POLICY "Payments are viewable by involved parties"
ON public.payments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_members.project_id = project_id
    AND project_members.profile_id = auth.uid()
  )
  OR recipient_id = auth.uid()
);

CREATE POLICY "Project admins can manage payments"
ON public.payments FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_members.project_id = project_id
    AND project_members.profile_id = auth.uid()
    AND project_members.role = 'admin'
  )
);

-- Proposals policies
CREATE POLICY "Proposals are viewable by project members"
ON public.proposals FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_members.project_id = project_id
    AND project_members.profile_id = auth.uid()
  )
);

CREATE POLICY "Project members can create proposals"
ON public.proposals FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_members.project_id = project_id
    AND project_members.profile_id = auth.uid()
  )
  AND auth.uid() = proposed_by
);

CREATE POLICY "Project admins can update proposals"
ON public.proposals FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_members.project_id = project_id
    AND project_members.profile_id = auth.uid()
    AND project_members.role = 'admin'
  )
);
