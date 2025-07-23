-- Fix search_path for existing functions
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  current_user_email text;
  admin_session_exists boolean := false;
BEGIN
  -- Get the current user's email from auth.jwt()
  current_user_email := auth.jwt() ->> 'email';
  
  -- If no email found in JWT, return false
  IF current_user_email IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if user exists in admin_users table and is active
  IF NOT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = current_user_email 
    AND is_active = true
  ) THEN
    RETURN false;
  END IF;
  
  -- Check if there's an active session for this admin user
  SELECT EXISTS (
    SELECT 1 FROM public.admin_sessions s
    JOIN public.admin_users a ON s.admin_id = a.id
    WHERE a.email = current_user_email
    AND s.expires_at > now()
  ) INTO admin_session_exists;
  
  RETURN admin_session_exists;
EXCEPTION WHEN OTHERS THEN
  RETURN false;
END;
$$;

-- Fix search_path for update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;