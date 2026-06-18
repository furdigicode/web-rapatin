
CREATE TABLE IF NOT EXISTS public.kirimchat_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id text NOT NULL,
  template_name text NOT NULL,
  language text NOT NULL DEFAULT 'id',
  status text,
  category text,
  header_type text,
  header_content text,
  body_content text,
  footer_content text,
  buttons jsonb NOT NULL DEFAULT '[]'::jsonb,
  variables jsonb NOT NULL DEFAULT '[]'::jsonb,
  has_variables boolean NOT NULL DEFAULT false,
  variable_count integer NOT NULL DEFAULT 0,
  raw jsonb,
  synced_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (template_name, language)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.kirimchat_templates TO authenticated;
GRANT ALL ON public.kirimchat_templates TO service_role;

ALTER TABLE public.kirimchat_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage kirimchat templates"
  ON public.kirimchat_templates FOR ALL
  USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

CREATE TRIGGER update_kirimchat_templates_updated_at
  BEFORE UPDATE ON public.kirimchat_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.kirimchat_rules
  ADD COLUMN IF NOT EXISTS body_variables jsonb NOT NULL DEFAULT '[]'::jsonb;
