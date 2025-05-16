
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { resellerFormSchema, ResellerFormValues } from '../schemas/resellerFormSchema';
import { useResellerFormSubmission } from '../hooks/useResellerFormSubmission';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import PersonalInfoFields from './PersonalInfoFields';
import ExperienceFields from './ExperienceFields';
import PlanningFields from './PlanningFields';

const ResellerForm: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  const form = useForm<ResellerFormValues>({
    resolver: zodResolver(resellerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      whatsapp: '',
      has_sold_zoom: 'false',
      selling_experience: '',
      reason: '',
      selling_plan: '',
      monthly_target: 0,
    },
  });
  
  const { handleSubmit, isSubmitting, lastError } = useResellerFormSubmission();
  
  const onSubmit = async (data: ResellerFormValues) => {
    console.log('Form submitted with values:', data);
    await handleSubmit(data);
  };
  
  // Test Supabase connection on component mount with improved error handling
  useEffect(() => {
    const testSupabaseConnection = async () => {
      try {
        console.log('Testing Supabase connection...');
        setConnectionStatus('checking');
        
        // Try a simple ping to the Supabase API
        const { data, error } = await supabase
          .from('reseller_applications')
          .select('id')
          .limit(1);
        
        if (error) {
          console.error('Supabase connection test failed:', error);
          setConnectionError(`${error.message}`);
          setConnectionStatus('error');
          
          toast({
            title: 'Koneksi Database Gagal',
            description: `Tidak dapat terhubung ke database. Detail: ${error.message}`,
            variant: 'destructive',
          });
        } else {
          console.log('Supabase connection successful:', data);
          setConnectionStatus('success');
          setConnectionError(null);
        }
      } catch (error) {
        console.error('Exception during connection test:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        setConnectionError(errorMessage);
        setConnectionStatus('error');
        
        toast({
          title: 'Error Koneksi',
          description: `Terjadi kesalahan saat memeriksa koneksi: ${errorMessage}`,
          variant: 'destructive',
        });
      }
    };
    
    testSupabaseConnection();
  }, []);
  
  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 md:p-8">
      {connectionStatus === 'error' && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Masalah Koneksi</AlertTitle>
          <AlertDescription>
            Tidak dapat terhubung ke database. Formulir mungkin tidak berfungsi dengan benar.
            {connectionError && (
              <div className="mt-2 text-sm">
                <strong>Detail Error:</strong> {connectionError}
              </div>
            )}
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.reload()}
              >
                Muat Ulang Halaman
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <PersonalInfoFields />
          <ExperienceFields />
          <PlanningFields />
          
          {lastError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Saat Pengiriman</AlertTitle>
              <AlertDescription>
                {lastError.message}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="pt-4">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full md:w-auto"
              disabled={isSubmitting || connectionStatus === 'error'}
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Pendaftaran'}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ResellerForm;
