-- Fix RLS policies for user_feedbacks table to use is_custom_admin_user()
-- This aligns with other admin-protected tables and fixes empty admin page issue

-- Drop old policies that use auth.uid() check
DROP POLICY IF EXISTS "Admins can view all feedback" ON public.user_feedbacks;
DROP POLICY IF EXISTS "Admins can update feedback" ON public.user_feedbacks;
DROP POLICY IF EXISTS "Admins can delete feedback" ON public.user_feedbacks;

-- Create new policies using is_custom_admin_user()
CREATE POLICY "Admins can view all feedback"
  ON public.user_feedbacks
  FOR SELECT
  USING (is_custom_admin_user());

CREATE POLICY "Admins can update feedback"
  ON public.user_feedbacks
  FOR UPDATE
  USING (is_custom_admin_user())
  WITH CHECK (is_custom_admin_user());

CREATE POLICY "Admins can delete feedback"
  ON public.user_feedbacks
  FOR DELETE
  USING (is_custom_admin_user());