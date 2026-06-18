
CREATE TABLE public.kirimchat_webhook_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL DEFAULT 'unknown',
  channel TEXT,
  message_id TEXT,
  phone_number TEXT,
  template_name TEXT,
  status TEXT,
  error_message TEXT,
  payload JSONB NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_kirimchat_webhook_events_event_type ON public.kirimchat_webhook_events(event_type);
CREATE INDEX idx_kirimchat_webhook_events_phone ON public.kirimchat_webhook_events(phone_number);
CREATE INDEX idx_kirimchat_webhook_events_received_at ON public.kirimchat_webhook_events(received_at DESC);

GRANT SELECT ON public.kirimchat_webhook_events TO authenticated;
GRANT ALL ON public.kirimchat_webhook_events TO service_role;

ALTER TABLE public.kirimchat_webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view kirimchat webhook events"
ON public.kirimchat_webhook_events
FOR SELECT
USING (public.is_admin_user());
