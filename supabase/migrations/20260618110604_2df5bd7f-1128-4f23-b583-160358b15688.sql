ALTER TABLE public.kirimchat_rules
  ADD COLUMN IF NOT EXISTS action_type text NOT NULL DEFAULT 'template',
  ADD COLUMN IF NOT EXISTS text_content text,
  ALTER COLUMN template_name DROP NOT NULL;

ALTER TABLE public.kirimchat_rules
  DROP CONSTRAINT IF EXISTS kirimchat_rules_action_type_check;
ALTER TABLE public.kirimchat_rules
  ADD CONSTRAINT kirimchat_rules_action_type_check
  CHECK (action_type IN ('template','text'));