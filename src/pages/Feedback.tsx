import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MessageSquare, AlertCircle, Lightbulb, Bug, HelpCircle, FileText, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { FeedbackType } from '@/types/FeedbackTypes';

const feedbackSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100, 'Nama maksimal 100 karakter'),
  email: z.string().email('Email tidak valid').max(255, 'Email maksimal 255 karakter'),
  phone: z.string().optional(),
  type: z.enum(['complaint', 'feature_request', 'bug_report', 'general', 'question']),
  subject: z.string().min(5, 'Subjek minimal 5 karakter').max(200, 'Subjek maksimal 200 karakter'),
  message: z.string().min(20, 'Pesan minimal 20 karakter').max(2000, 'Pesan maksimal 2000 karakter'),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

const feedbackTypes = [
  { value: 'complaint', label: 'Komplain', icon: AlertCircle, color: 'text-destructive' },
  { value: 'feature_request', label: 'Request Fitur', icon: Lightbulb, color: 'text-primary' },
  { value: 'bug_report', label: 'Laporkan Bug', icon: Bug, color: 'text-orange-500' },
  { value: 'question', label: 'Pertanyaan', icon: HelpCircle, color: 'text-blue-500' },
  { value: 'general', label: 'Feedback Umum', icon: FileText, color: 'text-muted-foreground' },
];

const Feedback = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      type: 'general',
    },
  });

  const selectedType = watch('type');
  const message = watch('message') || '';

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true);

    try {
      const metadata = {
        user_agent: navigator.userAgent,
        page_url: document.referrer || window.location.href,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        timestamp: new Date().toISOString(),
      };

      const { error } = await supabase.from('user_feedbacks').insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        type: data.type,
        subject: data.subject,
        message: data.message,
        user_agent: metadata.user_agent,
        page_url: metadata.page_url,
        metadata,
      });

      if (error) throw error;

      setSubmitted(true);
      reset();
      toast({
        title: 'Feedback Berhasil Dikirim!',
        description: 'Terima kasih atas feedback Anda. Kami akan meresponnya secepatnya.',
      });

      // Reset submitted state after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Gagal Mengirim Feedback',
        description: 'Terjadi kesalahan. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-28 pb-20">
          <div className="container max-w-2xl">
            <Card className="text-center">
              <CardContent className="pt-12 pb-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Feedback Berhasil Dikirim!</h2>
                <p className="text-muted-foreground mb-6">
                  Terima kasih atas feedback Anda. Tim kami akan segera meresponnya.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => setSubmitted(false)}>
                    Kirim Feedback Lagi
                  </Button>
                  <Button variant="outline" onClick={() => window.location.href = '/'}>
                    Kembali ke Beranda
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SEO
        title="Berikan Feedback - Bantu Kami Tingkatkan Layanan | Rapatin"
        description="Punya komplain, saran fitur, atau bug report? Sampaikan feedback Anda dan bantu kami meningkatkan layanan meeting online Rapatin."
        keywords="feedback rapatin, komplain layanan, request fitur, bug report, customer feedback"
        canonicalUrl="https://rapatin.id/feedback"
      />
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Berikan Feedback Anda</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Suara Anda penting bagi kami. Sampaikan komplain, saran fitur, bug report, atau pertanyaan Anda di sini.
            </p>
          </div>

          {/* Feedback Type Selection */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {feedbackTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.value;
              
              return (
                <Card
                  key={type.value}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? 'border-primary shadow-md' : ''
                  }`}
                  onClick={() => setValue('type', type.value as FeedbackType)}
                >
                  <CardContent className="p-4 text-center">
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${type.color}`} />
                    <p className="text-sm font-medium">{type.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Feedback Form */}
          <Card>
            <CardHeader>
              <CardTitle>Form Feedback</CardTitle>
              <CardDescription>
                Isi form di bawah ini untuk mengirim feedback Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama *</Label>
                    <Input
                      id="name"
                      placeholder="Nama lengkap Anda"
                      {...register('name')}
                      className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      {...register('email')}
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">No. Telepon (Opsional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="08123456789"
                    {...register('phone')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipe Feedback *</Label>
                  <Select value={selectedType} onValueChange={(value) => setValue('type', value as FeedbackType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {feedbackTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subjek *</Label>
                  <Input
                    id="subject"
                    placeholder="Ringkasan singkat feedback Anda"
                    {...register('subject')}
                    className={errors.subject ? 'border-destructive' : ''}
                  />
                  {errors.subject && (
                    <p className="text-sm text-destructive">{errors.subject.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Pesan Detail *</Label>
                  <Textarea
                    id="message"
                    placeholder="Jelaskan feedback Anda secara detail..."
                    rows={6}
                    {...register('message')}
                    className={errors.message ? 'border-destructive' : ''}
                  />
                  <div className="flex justify-between text-sm">
                    {errors.message ? (
                      <p className="text-destructive">{errors.message.message}</p>
                    ) : (
                      <span className="text-muted-foreground">Minimal 20 karakter</span>
                    )}
                    <span className={`${message.length > 2000 ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {message.length}/2000
                    </span>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Mengirim...' : 'Kirim Feedback'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <div className="mt-12">
            <h3 className="text-xl font-bold mb-4">Pertanyaan Umum</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Berapa lama waktu respon yang dibutuhkan?</AccordionTrigger>
                <AccordionContent>
                  Kami berusaha merespons semua feedback dalam waktu 1-3 hari kerja. Untuk feedback dengan prioritas tinggi atau urgent, kami akan merespons lebih cepat.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Apakah data saya aman?</AccordionTrigger>
                <AccordionContent>
                  Ya, semua data yang Anda kirimkan dilindungi dengan enkripsi dan hanya digunakan untuk meningkatkan layanan kami. Kami tidak akan membagikan informasi Anda kepada pihak ketiga.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Bagaimana cara melacak status feedback saya?</AccordionTrigger>
                <AccordionContent>
                  Setelah mengirim feedback, Anda akan menerima konfirmasi via email. Tim kami akan menghubungi Anda melalui email yang Anda berikan untuk update status feedback Anda.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Apakah saya perlu login untuk mengirim feedback?</AccordionTrigger>
                <AccordionContent>
                  Tidak, Anda tidak perlu login. Cukup isi form dengan informasi Anda dan kirim feedback. Kami menghargai setiap masukan dari siapa saja.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Feedback;
