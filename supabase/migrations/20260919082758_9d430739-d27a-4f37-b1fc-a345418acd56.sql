CREATE TABLE public.payment_gateway_settings (
  id text NOT NULL PRIMARY KEY DEFAULT 'default',
  active_gateway text NOT NULL DEFAULT 'duitku',
  updated_by text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.payment_gateway_settings TO anon;
GRANT SELECT ON public.payment_gateway_settings TO authenticated;
GRANT ALL ON public.payment_gateway_settings TO service_role;

ALTER TABLE public.payment_gateway_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view payment gateway settings"
ON public.payment_gateway_settings
FOR SELECT
USING (true);

CREATE POLICY "Only admins can manage payment gateway settings"
ON public.payment_gateway_settings
FOR ALL
USING (public.is_custom_admin_user())
WITH CHECK (public.is_custom_admin_user());

CREATE TRIGGER update_payment_gateway_settings_updated_at
BEFORE UPDATE ON public.payment_gateway_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.payment_gateway_settings (id, active_gateway) VALUES ('default', 'duitku');