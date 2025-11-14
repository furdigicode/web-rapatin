-- Create user_feedbacks table
CREATE TABLE IF NOT EXISTS public.user_feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  
  -- User Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  
  -- Feedback Details
  type TEXT NOT NULL CHECK (type IN ('complaint', 'feature_request', 'bug_report', 'general', 'question')),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Admin Response
  status TEXT DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  priority TEXT DEFAULT 'medium' NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  admin_notes TEXT,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES public.admin_users(id),
  
  -- Metadata
  user_agent TEXT,
  page_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for better query performance
CREATE INDEX idx_user_feedbacks_status ON public.user_feedbacks(status);
CREATE INDEX idx_user_feedbacks_type ON public.user_feedbacks(type);
CREATE INDEX idx_user_feedbacks_priority ON public.user_feedbacks(priority);
CREATE INDEX idx_user_feedbacks_created_at ON public.user_feedbacks(created_at DESC);
CREATE INDEX idx_user_feedbacks_email ON public.user_feedbacks(email);

-- Trigger for updated_at
CREATE TRIGGER update_user_feedbacks_updated_at
  BEFORE UPDATE ON public.user_feedbacks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.user_feedbacks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public: Anyone can insert feedback
CREATE POLICY "Anyone can submit feedback"
  ON public.user_feedbacks
  FOR INSERT
  WITH CHECK (true);

-- Admin: Can view all feedback
CREATE POLICY "Admins can view all feedback"
  ON public.user_feedbacks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Admin: Can update feedback
CREATE POLICY "Admins can update feedback"
  ON public.user_feedbacks
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Admin: Can delete feedback
CREATE POLICY "Admins can delete feedback"
  ON public.user_feedbacks
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Comment for documentation
COMMENT ON TABLE public.user_feedbacks IS 'User feedback submissions including complaints, feature requests, and bug reports';