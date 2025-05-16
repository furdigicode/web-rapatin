
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ResellerFormValues } from '../schemas/resellerFormSchema';

export const useResellerFormSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: ResellerFormValues) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('reseller_applications').insert({
        name: data.name,
        email: data.email,
        whatsapp: data.whatsapp,
        has_sold_zoom: data.has_sold_zoom === 'true',
        selling_experience: data.selling_experience,
        reason: data.reason,
        selling_plan: data.selling_plan,
        monthly_target: data.monthly_target, // This is now definitely a number after transform
      });

      if (error) throw error;

      toast({
        title: 'Pendaftaran Berhasil',
        description: 'Permintaan menjadi reseller Rapatin telah diterima. Tim kami akan menghubungi Anda segera.',
      });
      
      // Track Facebook Pixel event
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', {
          content_name: 'reseller_registration'
        });
      }
      
      // Redirect to thank you page or back to reseller info
      navigate('/menjadi-reseller');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        variant: 'destructive',
        title: 'Pendaftaran Gagal',
        description: 'Terjadi kesalahan saat mengirim pendaftaran. Silakan coba lagi.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting
  };
};
