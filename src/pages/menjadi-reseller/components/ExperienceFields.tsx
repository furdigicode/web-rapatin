
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ResellerFormValues } from '../schemas/resellerFormSchema';

const ExperienceFields: React.FC = () => {
  const { control, watch } = useFormContext<ResellerFormValues>();
  const hasSoldZoom = watch('has_sold_zoom');
  
  return (
    <>
      <FormField
        control={control}
        name="has_sold_zoom"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Apakah Anda pernah menjual link Zoom sebelumnya?</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="true">Ya</SelectItem>
                <SelectItem value="false">Tidak</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {hasSoldZoom === 'true' && (
        <FormField
          control={control}
          name="selling_experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ceritakan pengalaman Anda menjual link Zoom</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Bagaimana cara Anda berjualan dan ke siapa Anda menjual link Zoom selama ini..."
                  className="h-20"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default ExperienceFields;
