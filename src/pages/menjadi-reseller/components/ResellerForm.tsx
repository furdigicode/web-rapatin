
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { resellerFormSchema, ResellerFormValues } from '../schemas/resellerFormSchema';
import { useResellerFormSubmission } from '../hooks/useResellerFormSubmission';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import PersonalInfoFields from './PersonalInfoFields';
import ExperienceFields from './ExperienceFields';
import PlanningFields from './PlanningFields';

const ResellerForm: React.FC = () => {
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
  
  const { handleSubmit, isSubmitting } = useResellerFormSubmission();
  
  const onSubmit = async (data: ResellerFormValues) => {
    console.log('Form submitted with values:', data);
    await handleSubmit(data);
  };
  
  // Test Supabase connection on component mount
  useEffect(() => {
    const testSupabaseConnection = async () => {
      try {
        console.log('Testing Supabase connection...');
        // Simple query to check connection
        const { data, error } = await supabase
          .from('reseller_applications')
          .select('id')
          .limit(1);
        
        if (error) {
          console.error('Supabase connection test failed:', error);
          toast({
            title: 'Connection Test Failed',
            description: `Error connecting to database: ${error.message}`,
            variant: 'destructive',
          });
        } else {
          console.log('Supabase connection successful:', data);
          toast({
            title: 'Connection Test Successful',
            description: 'Successfully connected to the database.',
          });
        }
      } catch (error) {
        console.error('Exception during connection test:', error);
        toast({
          title: 'Connection Test Exception',
          description: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
          variant: 'destructive',
        });
      }
    };
    
    testSupabaseConnection();
  }, []);
  
  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 md:p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <PersonalInfoFields />
          <ExperienceFields />
          <PlanningFields />
          
          <div className="pt-4">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full md:w-auto"
              disabled={isSubmitting}
            >
              Kirim Pendaftaran
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ResellerForm;
