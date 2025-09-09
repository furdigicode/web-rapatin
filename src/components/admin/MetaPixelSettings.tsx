import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MetaPixelFormData {
  pixel_id: string;
  enabled: boolean;
  track_page_view: boolean;
}

export const MetaPixelSettings = () => {
  const { toast } = useToast();
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm<MetaPixelFormData>({
    defaultValues: {
      pixel_id: '',
      enabled: true,
      track_page_view: true
    }
  });

  const enabled = watch('enabled');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('meta_pixel_settings')
        .select('pixel_id, enabled, track_page_view')
        .maybeSingle();

      if (error) {
        console.error('Error loading settings:', error);
        return;
      }

      if (data) {
        setValue('pixel_id', data.pixel_id);
        setValue('enabled', data.enabled);
        setValue('track_page_view', data.track_page_view);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error",
        description: "Gagal memuat pengaturan pixel",
        variant: "destructive"
      });
    }
  };

  const onSubmit = async (data: MetaPixelFormData) => {
    try {
      // Check if settings exist
      const { data: existing } = await supabase
        .from('meta_pixel_settings')
        .select('id')
        .maybeSingle();

      let result;
      if (existing) {
        // Update existing
        result = await supabase
          .from('meta_pixel_settings')
          .update({
            pixel_id: data.pixel_id,
            enabled: data.enabled,
            track_page_view: data.track_page_view
          })
          .eq('id', existing.id);
      } else {
        // Insert new
        result = await supabase
          .from('meta_pixel_settings')
          .insert({
            pixel_id: data.pixel_id,
            enabled: data.enabled,
            track_page_view: data.track_page_view
          });
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: "Berhasil",
        description: "Pengaturan Meta Pixel telah disimpan"
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan pengaturan",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaturan Meta Pixel</CardTitle>
        <CardDescription>
          Kelola pengaturan Meta Pixel (Facebook Pixel) untuk tracking dan analitik
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="enabled"
              checked={enabled}
              onCheckedChange={(checked) => setValue('enabled', checked)}
            />
            <Label htmlFor="enabled">Aktifkan Meta Pixel</Label>
          </div>

          {enabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="pixel_id">Pixel ID *</Label>
                <Input
                  id="pixel_id"
                  placeholder="Masukkan Pixel ID (contoh: 678606711513436)"
                  {...register('pixel_id', { 
                    required: enabled ? 'Pixel ID wajib diisi' : false 
                  })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="track_page_view"
                  checked={watch('track_page_view')}
                  onCheckedChange={(checked) => setValue('track_page_view', checked)}
                />
                <Label htmlFor="track_page_view">Track Page View otomatis</Label>
              </div>
            </>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};