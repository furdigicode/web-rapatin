-- Fix RLS policies for voting system to allow admin access

-- ============================================================================
-- 1. Fix votings table policies
-- ============================================================================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Only admins can insert votings" ON public.votings;
DROP POLICY IF EXISTS "Only admins can update votings" ON public.votings;
DROP POLICY IF EXISTS "Only admins can delete votings" ON public.votings;
DROP POLICY IF EXISTS "Anyone can view active votings" ON public.votings;

-- Create new policies using is_admin_user()
CREATE POLICY "Admins can insert votings"
  ON public.votings FOR INSERT
  WITH CHECK (is_admin_user());

CREATE POLICY "Admins can update votings"
  ON public.votings FOR UPDATE
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

CREATE POLICY "Admins can delete votings"
  ON public.votings FOR DELETE
  USING (is_admin_user());

CREATE POLICY "Public can view active/closed, admins can view all"
  ON public.votings FOR SELECT
  USING (
    (status IN ('active', 'closed')) OR is_admin_user()
  );

-- ============================================================================
-- 2. Fix voting_options table policies
-- ============================================================================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Only admins can insert options" ON public.voting_options;
DROP POLICY IF EXISTS "Only admins can update options" ON public.voting_options;
DROP POLICY IF EXISTS "Only admins can delete options" ON public.voting_options;
DROP POLICY IF EXISTS "Anyone can view options for active votings" ON public.voting_options;

-- Create new policies
CREATE POLICY "Admins can insert options"
  ON public.voting_options FOR INSERT
  WITH CHECK (is_admin_user());

CREATE POLICY "Admins can update options"
  ON public.voting_options FOR UPDATE
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

CREATE POLICY "Admins can delete options"
  ON public.voting_options FOR DELETE
  USING (is_admin_user());

CREATE POLICY "Public can view options for active votings, admins can view all"
  ON public.voting_options FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.votings
      WHERE votings.id = voting_options.voting_id
      AND (votings.status IN ('active', 'closed'))
    ) OR is_admin_user()
  );

-- ============================================================================
-- 3. Fix voting_categories table policies
-- ============================================================================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Only admins can insert categories" ON public.voting_categories;
DROP POLICY IF EXISTS "Only admins can update categories" ON public.voting_categories;
DROP POLICY IF EXISTS "Only admins can delete categories" ON public.voting_categories;

-- Create new policies
CREATE POLICY "Admins can insert categories"
  ON public.voting_categories FOR INSERT
  WITH CHECK (is_admin_user());

CREATE POLICY "Admins can update categories"
  ON public.voting_categories FOR UPDATE
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

CREATE POLICY "Admins can delete categories"
  ON public.voting_categories FOR DELETE
  USING (is_admin_user());

-- ============================================================================
-- 4. Fix voting_responses table policies
-- ============================================================================

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Only admins can view responses" ON public.voting_responses;

-- Create new policy allowing admins to view all responses
CREATE POLICY "Admins can view all responses"
  ON public.voting_responses FOR SELECT
  USING (is_admin_user());