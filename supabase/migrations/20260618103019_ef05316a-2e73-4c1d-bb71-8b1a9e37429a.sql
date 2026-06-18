ALTER TABLE public.kirimchat_webhook_events
  ADD COLUMN IF NOT EXISTS dispatch_request jsonb,
  ADD COLUMN IF NOT EXISTS dispatch_response jsonb,
  ADD COLUMN IF NOT EXISTS dispatch_status_code int,
  ADD COLUMN IF NOT EXISTS dispatch_duration_ms int,
  ADD COLUMN IF NOT EXISTS dispatched_at timestamptz;