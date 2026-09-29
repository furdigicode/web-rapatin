CREATE TABLE public.duitku_callback_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_order_id text,
  destination text NOT NULL,
  result_code text,
  status text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  target_url text,
  response_status integer,
  response_body text,
  duration_ms integer,
  error_message text,
  resend_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.duitku_callback_log TO service_role;
ALTER TABLE public.duitku_callback_log ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_duitku_callback_log_created ON public.duitku_callback_log (created_at DESC);