
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  FormDescription 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ResellerFormValues } from '../schemas/resellerFormSchema';

const PlanningFields: React.FC = () => {
  const { control } = useFormContext<ResellerFormValues>();
  
  return (
    <>
      <FormField
        control={control}
        name="reason"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alasan ingin menjadi reseller Rapatin</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Ceritakan mengapa Anda tertarik menjadi reseller Rapatin..."
                className="h-24"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="selling_plan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Kemana rencana Anda menawarkan layanan link Zoom?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Jelaskan strategi atau target pasar Anda..."
                className="h-24"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="monthly_target"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Perkiraan target jumlah pembeli dalam 1 bulan</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={0}
                {...field}
              />
            </FormControl>
            <FormDescription>
              Masukkan perkiraan jumlah pembeli yang Anda targetkan per bulan
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default PlanningFields;
