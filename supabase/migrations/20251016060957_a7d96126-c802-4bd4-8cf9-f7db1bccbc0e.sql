-- Create voting categories table
CREATE TABLE IF NOT EXISTS public.voting_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create votings table
CREATE TABLE IF NOT EXISTS public.votings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed')),
  voting_type TEXT NOT NULL DEFAULT 'single' CHECK (voting_type IN ('single', 'multiple')),
  max_selections INTEGER,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  show_results BOOLEAN DEFAULT false,
  require_login BOOLEAN DEFAULT false,
  allow_anonymous BOOLEAN DEFAULT true,
  cover_image TEXT,
  category TEXT,
  total_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Create voting options table
CREATE TABLE IF NOT EXISTS public.voting_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  voting_id UUID NOT NULL REFERENCES public.votings(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  option_order INTEGER NOT NULL DEFAULT 0,
  option_image TEXT,
  vote_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(voting_id, option_order)
);

-- Create voting responses table
CREATE TABLE IF NOT EXISTS public.voting_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  voting_id UUID NOT NULL REFERENCES public.votings(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES public.voting_options(id) ON DELETE CASCADE,
  user_id UUID,
  user_identifier TEXT NOT NULL,
  user_email TEXT,
  user_name TEXT,
  voted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_voting_options_voting_id ON public.voting_options(voting_id);
CREATE INDEX IF NOT EXISTS idx_voting_responses_voting_id ON public.voting_responses(voting_id);
CREATE INDEX IF NOT EXISTS idx_voting_responses_option_id ON public.voting_responses(option_id);
CREATE INDEX IF NOT EXISTS idx_voting_responses_voting_user ON public.voting_responses(voting_id, user_identifier);
CREATE INDEX IF NOT EXISTS idx_voting_responses_voted_at ON public.voting_responses(voted_at);
CREATE INDEX IF NOT EXISTS idx_votings_status ON public.votings(status);
CREATE INDEX IF NOT EXISTS idx_votings_slug ON public.votings(slug);

-- Add unique constraint for single choice voting (one vote per user per voting)
CREATE UNIQUE INDEX IF NOT EXISTS idx_voting_responses_unique_vote ON public.voting_responses(voting_id, user_identifier);

-- Enable Row Level Security
ALTER TABLE public.voting_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voting_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voting_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for voting_categories
CREATE POLICY "Anyone can view categories"
  ON public.voting_categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert categories"
  ON public.voting_categories FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Only admins can update categories"
  ON public.voting_categories FOR UPDATE
  USING (false);

CREATE POLICY "Only admins can delete categories"
  ON public.voting_categories FOR DELETE
  USING (false);

-- RLS Policies for votings
CREATE POLICY "Anyone can view active votings"
  ON public.votings FOR SELECT
  USING (status = 'active' OR status = 'closed');

CREATE POLICY "Only admins can insert votings"
  ON public.votings FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Only admins can update votings"
  ON public.votings FOR UPDATE
  USING (false);

CREATE POLICY "Only admins can delete votings"
  ON public.votings FOR DELETE
  USING (false);

-- RLS Policies for voting_options
CREATE POLICY "Anyone can view options for active votings"
  ON public.voting_options FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.votings
      WHERE votings.id = voting_options.voting_id
      AND (votings.status = 'active' OR votings.status = 'closed')
    )
  );

CREATE POLICY "Only admins can insert options"
  ON public.voting_options FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Only admins can update options"
  ON public.voting_options FOR UPDATE
  USING (false);

CREATE POLICY "Only admins can delete options"
  ON public.voting_options FOR DELETE
  USING (false);

-- RLS Policies for voting_responses
CREATE POLICY "Anyone can insert responses"
  ON public.voting_responses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.votings
      WHERE votings.id = voting_responses.voting_id
      AND votings.status = 'active'
    )
  );

CREATE POLICY "Only admins can view responses"
  ON public.voting_responses FOR SELECT
  USING (false);

CREATE POLICY "No one can update responses"
  ON public.voting_responses FOR UPDATE
  USING (false);

CREATE POLICY "No one can delete responses"
  ON public.voting_responses FOR DELETE
  USING (false);

-- Function to update vote counts when a new response is added
CREATE OR REPLACE FUNCTION public.update_voting_vote_counts()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update vote count for the option
  UPDATE public.voting_options
  SET vote_count = vote_count + 1,
      updated_at = now()
  WHERE id = NEW.option_id;

  -- Update total votes for the voting
  UPDATE public.votings
  SET total_votes = total_votes + 1,
      updated_at = now()
  WHERE id = NEW.voting_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update vote counts
CREATE TRIGGER trigger_update_voting_vote_counts
AFTER INSERT ON public.voting_responses
FOR EACH ROW
EXECUTE FUNCTION public.update_voting_vote_counts();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_voting_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER trigger_votings_updated_at
BEFORE UPDATE ON public.votings
FOR EACH ROW
EXECUTE FUNCTION public.update_voting_updated_at();

CREATE TRIGGER trigger_voting_options_updated_at
BEFORE UPDATE ON public.voting_options
FOR EACH ROW
EXECUTE FUNCTION public.update_voting_updated_at();

-- Function to check if voting is active
CREATE OR REPLACE FUNCTION public.check_voting_status(voting_id_param UUID)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_status TEXT;
  v_start_date TIMESTAMP WITH TIME ZONE;
  v_end_date TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT status, start_date, end_date
  INTO v_status, v_start_date, v_end_date
  FROM public.votings
  WHERE id = voting_id_param;

  -- Check if voting exists and is active
  IF v_status IS NULL OR v_status != 'active' THEN
    RETURN false;
  END IF;

  -- Check start date
  IF v_start_date IS NOT NULL AND v_start_date > now() THEN
    RETURN false;
  END IF;

  -- Check end date
  IF v_end_date IS NOT NULL AND v_end_date < now() THEN
    RETURN false;
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function to get voting results with percentages
CREATE OR REPLACE FUNCTION public.get_voting_results(voting_id_param UUID)
RETURNS TABLE (
  option_id UUID,
  option_text TEXT,
  option_image TEXT,
  vote_count INTEGER,
  percentage NUMERIC
)
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_votes INTEGER;
BEGIN
  -- Get total votes for the voting
  SELECT total_votes INTO v_total_votes
  FROM public.votings
  WHERE id = voting_id_param;

  -- Return results with percentage calculation
  RETURN QUERY
  SELECT 
    vo.id,
    vo.option_text,
    vo.option_image,
    vo.vote_count,
    CASE 
      WHEN v_total_votes > 0 THEN ROUND((vo.vote_count::NUMERIC / v_total_votes::NUMERIC) * 100, 2)
      ELSE 0
    END AS percentage
  FROM public.voting_options vo
  WHERE vo.voting_id = voting_id_param
  ORDER BY vo.option_order ASC;
END;
$$ LANGUAGE plpgsql;