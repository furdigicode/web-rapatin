CREATE TABLE public.admin_notification_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid,
  event_type text NOT NULL,
  template_name text,
  phone_number text,
  attempt integer NOT NULL DEFAULT 1,
  status text NOT NULL,
  status_code integer,
  request jsonb,
  response jsonb,
  error_message text,
  duration_ms integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.admin_notification_log TO authenticated;
GRANT ALL ON public.admin_notification_log TO service_role;

ALTER TABLE public.admin_notification_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view notification log"
  ON public.admin_notification_log
  FOR SELECT
  TO authenticated
  USING (public.is_custom_admin_user());

CREATE INDEX idx_admin_notification_log_created_at ON public.admin_notification_log (created_at DESC);
CREATE INDEX idx_admin_notification_log_order_id ON public.admin_notification_log (order_id);