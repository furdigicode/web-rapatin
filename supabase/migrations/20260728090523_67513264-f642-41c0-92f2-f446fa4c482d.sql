
CREATE TABLE public.mysql_query_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid,
  admin_email text,
  action text NOT NULL,
  sql text,
  params jsonb,
  status text NOT NULL,
  row_count integer,
  duration_ms integer,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.mysql_query_log TO authenticated;
GRANT ALL ON public.mysql_query_log TO service_role;

ALTER TABLE public.mysql_query_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_select_mysql_query_log"
  ON public.mysql_query_log
  FOR SELECT
  USING (public.is_custom_admin_user());

CREATE INDEX idx_mysql_query_log_created_at ON public.mysql_query_log (created_at DESC);
