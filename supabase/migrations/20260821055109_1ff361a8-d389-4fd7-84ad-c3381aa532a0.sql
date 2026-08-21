ALTER TABLE public.surveys
  ADD COLUMN IF NOT EXISTS has_reward boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS reward_title text,
  ADD COLUMN IF NOT EXISTS reward_code text,
  ADD COLUMN IF NOT EXISTS reward_terms text;