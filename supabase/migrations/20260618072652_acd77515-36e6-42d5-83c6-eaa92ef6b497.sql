CREATE TABLE public.kirimchat_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  event_type text NOT NULL DEFAULT '*',
  match_mode text NOT NULL DEFAULT 'contains',
  keyword text,
  case_sensitive boolean NOT NULL DEFAULT false,
  delay_seconds integer NOT NULL DEFAULT 0,
  template_name text NOT NULL,
  template_language text NOT NULL DEFAULT 'id',
  priority integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT kirimchat_rules_match_mode_chk CHECK (match_mode IN ('any','contains','exact','starts_with','ends_with','regex')),
  CONSTRAINT kirimchat_rules_delay_chk CHECK (delay_seconds >= 0 AND delay_seconds <= 300)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.kirimchat_rules TO authenticated;
GRANT ALL ON public.kirimchat_rules TO service_role;

ALTER TABLE public.kirimchat_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage kirimchat_rules"
  ON public.kirimchat_rules
  FOR ALL
  TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

CREATE TRIGGER update_kirimchat_rules_updated_at
  BEFORE UPDATE ON public.kirimchat_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.kirimchat_webhook_events
  ADD COLUMN IF NOT EXISTS matched_rule_id uuid REFERENCES public.kirimchat_rules(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS rule_action text;
