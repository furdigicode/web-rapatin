-- Create meta pixel settings table
CREATE TABLE public.meta_pixel_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pixel_id text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  track_page_view boolean NOT NULL DEFAULT true,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.meta_pixel_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view pixel settings"
ON public.meta_pixel_settings
FOR SELECT
USING (true);

CREATE POLICY "Admin users can manage pixel settings"
ON public.meta_pixel_settings
FOR ALL
USING (is_admin_user());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_meta_pixel_settings_updated_at
BEFORE UPDATE ON public.meta_pixel_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER TABLE public.meta_pixel_settings REPLICA IDENTITY FULL;

-- Insert default pixel settings
INSERT INTO public.meta_pixel_settings (pixel_id, enabled, track_page_view)
VALUES ('678606711513436', true, true);