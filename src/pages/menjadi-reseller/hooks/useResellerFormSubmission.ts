
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ResellerFormValues } from '../schemas/resellerFormSchema';

export const useResellerFormSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);
  const navigate = useNavigate();

  const testConnection = async (): Promise<boolean> => {
    try {
      console.log('Testing Supabase connection before submission...');
      const { data, error } = await supabase
        .from('reseller_applications')
        .select('id')
        .limit(1)
        .single();
      
      if (error) {
        console.error('Connection test failed with error:', error);
        setLastError(new Error(`Connection test failed: ${error.message}`));
        return false;
      }
      
      console.log('Connection test successful', data);
      return true;
    } catch (error) {
      console.error('Exception during connection test:', error);
      setLastError(error instanceof Error ? error : new Error(String(error)));
      return false;
    }
  };

  const handleSubmit = async (data: ResellerFormValues) => {
    setIsSubmitting(true);
    setLastError(null);
    
    try {
      // Log form values for debugging
      console.log('Form values to be submitted:', data);
      console.log('monthly_target (value):', data.monthly_target);
      console.log('monthly_target (type):', typeof data.monthly_target);
      
      // Test connection before attempting submission
      const isConnected = await testConnection();
      if (!isConnected) {
        toast({
          variant: 'destructive',
          title: 'Koneksi Gagal',
          description: 'Tidak dapat terhubung ke server. Mohon cek koneksi internet Anda dan coba lagi.',
        });
        return;
      }
      
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
      
      // Attempt to insert with more detailed error logging
      const { data: insertedData, error } = await supabase
        .from('reseller_applications')
        .insert(submitData)
        .select();

      if (error) {
        console.error('Supabase error details:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
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
      // More detailed error message with network info
      let errorMessage = 'Terjadi kesalahan saat mengirim pendaftaran.';
      
      if (error instanceof Error) {
        setLastError(error);
        errorMessage += ` Detail: ${error.message}`;
        console.error('Error stack:', error.stack);
        
        // Add network status info
        if (navigator.onLine === false) {
          errorMessage += ' Anda sedang offline. Mohon periksa koneksi internet Anda.';
        }
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
    isSubmitting,
    lastError
  };
};
