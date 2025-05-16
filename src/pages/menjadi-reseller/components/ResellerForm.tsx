
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { resellerFormSchema, ResellerFormValues } from '../schemas/resellerFormSchema';
import { useResellerFormSubmission } from '../hooks/useResellerFormSubmission';
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
      monthly_target: '0', // Keep it as a string in the form, Zod will transform it
    },
  });
  
  const { handleSubmit, isSubmitting } = useResellerFormSubmission();
  
  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 md:p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
