
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
      console.log('Form values to be submitted:', data);
      console.log('monthly_target (value):', data.monthly_target);
      console.log('monthly_target (type):', typeof data.monthly_target);
      
      // Create the data object that will be sent to Supabase
      const submitData = {
        name: data.name,
        email: data.email,
        whatsapp: data.whatsapp,
        has_sold_zoom: data.has_sold_zoom === 'true',
        selling_experience: data.selling_experience || '',
        reason: data.reason,
        selling_plan: data.selling_plan,
        monthly_target: Number(data.monthly_target), // Ensure it's a number
      };
      
      console.log('Prepared data for Supabase:', submitData);
      
      const { data: insertedData, error } = await supabase.from('reseller_applications').insert(submitData);

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      console.log('Submission successful:', insertedData);

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
      // More detailed error message
      let errorMessage = 'Terjadi kesalahan saat mengirim pendaftaran. Silakan coba lagi.';
      
      if (error instanceof Error) {
        errorMessage += ` Detail: ${error.message}`;
        console.error('Error stack:', error.stack);
      }
      
      toast({
        variant: 'destructive',
        title: 'Pendaftaran Gagal',
        description: errorMessage,
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
