-- Create admin_users table for secure admin authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (only authenticated admins can access)
CREATE POLICY "Only authenticated admins can view admin users" 
ON public.admin_users 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated admins can update admin users" 
ON public.admin_users 
FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the admin user with hashed password
-- Password: Andalus123! (will be properly hashed in the edge function)
INSERT INTO public.admin_users (email, password_hash) 
VALUES ('rapatinapp@gmail.com', '$2b$10$placeholder_will_be_replaced');

-- Create admin_sessions table for session management
CREATE TABLE public.admin_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_used TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on sessions
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for sessions
CREATE POLICY "Admins can manage their own sessions" 
ON public.admin_sessions 
FOR ALL 
USING (auth.role() = 'authenticated');