-- Create table for caching Rapatin auth tokens
CREATE TABLE public.rapatin_auth_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  access_token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (no policies = only service role can access)
ALTER TABLE public.rapatin_auth_tokens ENABLE ROW LEVEL SECURITY;

-- Add comment for documentation
COMMENT ON TABLE public.rapatin_auth_tokens IS 'Cached authentication tokens for Rapatin API to avoid login on every webhook call';