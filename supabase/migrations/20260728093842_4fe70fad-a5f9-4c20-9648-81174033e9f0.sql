CREATE TABLE public.mysql_connection_config (
  id TEXT PRIMARY KEY DEFAULT 'singleton' CHECK (id = 'singleton'),
  host TEXT NOT NULL DEFAULT '',
  port INTEGER NOT NULL DEFAULT 3306 CHECK (port BETWEEN 1 AND 65535),
  database TEXT NOT NULL DEFAULT '',
  username TEXT NOT NULL DEFAULT '',
  password TEXT NOT NULL DEFAULT '',
  updated_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT ALL ON public.mysql_connection_config TO service_role;

ALTER TABLE public.mysql_connection_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_only" ON public.mysql_connection_config FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TRIGGER update_mysql_connection_config_updated_at
BEFORE UPDATE ON public.mysql_connection_config
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.mysql_connection_config (id) VALUES ('singleton') ON CONFLICT (id) DO NOTHING;