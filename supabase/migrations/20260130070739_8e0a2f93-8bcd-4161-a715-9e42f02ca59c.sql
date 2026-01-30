-- Create table for Kledo authentication token caching
CREATE TABLE public.kledo_auth_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  access_token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (tanpa policy agar hanya service role yang bisa akses)
ALTER TABLE public.kledo_auth_tokens ENABLE ROW LEVEL SECURITY;

-- Add comment for documentation
COMMENT ON TABLE public.kledo_auth_tokens IS 'Stores Kledo API authentication tokens for caching (30-day validity)';