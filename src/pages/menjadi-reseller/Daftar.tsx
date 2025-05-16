
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  name: z.string().min(3, { message: 'Nama minimal 3 karakter' }),
  email: z.string().email({ message: 'Alamat email tidak valid' }),
  whatsapp: z.string().min(10, { message: 'Nomor WhatsApp tidak valid' }),
  has_sold_zoom: z.enum(['true', 'false']),
  selling_experience: z.string().optional(),
  reason: z.string().min(10, { message: 'Alasan harus diisi minimal 10 karakter' }),
  selling_plan: z.string().min(10, { message: 'Rencana penjualan harus diisi minimal 10 karakter' }),
  monthly_target: z.string().transform((val) => parseInt(val, 10)),
});

type FormValues = z.infer<typeof formSchema>;

const DaftarReseller = () => {
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      whatsapp: '',
      has_sold_zoom: 'false',
      selling_experience: '',
      reason: '',
      selling_plan: '',
      monthly_target: '0',
    },
  });

  const hasSoldZoom = form.watch('has_sold_zoom');

  const onSubmit = async (data: FormValues) => {
    try {
      const { error } = await supabase.from('reseller_applications').insert({
        name: data.name,
        email: data.email,
        whatsapp: data.whatsapp,
        has_sold_zoom: data.has_sold_zoom === 'true',
        selling_experience: data.selling_experience,
        reason: data.reason,
        selling_plan: data.selling_plan,
        monthly_target: data.monthly_target,
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
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-16">
        <div className="container max-w-3xl mx-auto px-4 md:px-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/menjadi-reseller')}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          
          <div className="space-y-4 mb-8">
            <div className="inline-flex items-center py-1 px-4 bg-primary/10 rounded-full">
              <span className="text-xs font-medium text-primary">Program Reseller</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Daftar Menjadi Reseller Rapatin</h1>
            <p className="text-lg text-muted-foreground">
              Lengkapi formulir di bawah ini untuk mulai menjadi Reseller Rapatin dan dapatkan
              penghasilan dari penjualan akses meeting Zoom.
            </p>
          </div>
          
          <div className="bg-white rounded-xl border shadow-sm p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Lengkap</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama lengkap Anda" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="contoh@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor WhatsApp</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="081234567890"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
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
                    control={form.control}
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
                
                <FormField
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                
                <div className="pt-4">
                  <Button type="submit" size="lg" className="w-full md:w-auto">
                    Kirim Pendaftaran
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DaftarReseller;
