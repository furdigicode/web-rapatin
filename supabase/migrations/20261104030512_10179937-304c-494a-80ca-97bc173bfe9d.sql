CREATE TABLE public.followup_settings (
  id text PRIMARY KEY DEFAULT 'default',
  template_name text,
  template_language text NOT NULL DEFAULT 'id',
  updated_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.followup_settings TO service_role;
ALTER TABLE public.followup_settings ENABLE ROW LEVEL SECURITY;
INSERT INTO public.followup_settings (id) VALUES ('default');
CREATE TRIGGER update_followup_settings_updated_at BEFORE UPDATE ON public.followup_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.followup_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mysql_user_id text,
  name text,
  email text,
  phone text NOT NULL,
  template_name text NOT NULL,
  status text NOT NULL,
  is_test boolean NOT NULL DEFAULT false,
  response jsonb,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.followup_logs TO service_role;
ALTER TABLE public.followup_logs ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_followup_logs_created ON public.followup_logs(created_at DESC);