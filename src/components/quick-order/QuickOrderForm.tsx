import { useState, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { PackageSelector, packages } from "./PackageSelector";
import { PricingSummary } from "./PricingSummary";
import { PaymentMethods } from "./PaymentMethods";
import { MeetingSettingsSection } from "./MeetingSettingsSection";
import { RecurringMeetingSection } from "./RecurringMeetingSection";


// Generate time options from 00:00 to 23:00
const timeOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return { value: `${hour}:00`, label: `${hour}:00` };
});

// Helper function to get next hour
const getNextHour = (): string => {
  const now = new Date();
  let nextHour = now.getHours() + 1;
  
  if (nextHour >= 24) {
    nextHour = 0;
  }
  
  return `${nextHour.toString().padStart(2, '0')}:00`;
};

const formSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(100, "Nama maksimal 100 karakter"),
  email: z.string().email("Format email tidak valid").max(255, "Email maksimal 255 karakter"),
  whatsapp: z.string()
    .min(10, "Nomor WhatsApp minimal 10 digit")
    .max(15, "Nomor WhatsApp maksimal 15 digit")
    .regex(/^[0-9+]+$/, "Nomor WhatsApp hanya boleh angka"),
  meeting_date: z.date({
    required_error: "Tanggal meeting harus dipilih",
  }),
  meeting_time: z.string({
    required_error: "Jam meeting harus dipilih",
  }),
  participant_count: z.number({
    required_error: "Pilih jumlah peserta",
  }),
  meeting_topic: z.string()
    .min(3, "Topik minimal 3 karakter")
    .max(200, "Topik maksimal 200 karakter"),
  custom_passcode: z.string()
    .max(10, "Passcode maksimal 10 karakter")
    .regex(/^[a-zA-Z0-9]*$/, "Passcode hanya boleh huruf dan angka")
    .optional()
    .or(z.literal('')),
  is_meeting_registration: z.boolean().default(false),
  is_meeting_qna: z.boolean().default(false),
  is_language_interpretation: z.boolean().default(false),
  is_mute_upon_entry: z.boolean().default(false),
  is_req_unmute_permission: z.boolean().default(false),
  // Recurring meeting fields
  is_recurring: z.boolean().default(false),
  recurrence_type: z.number().nullable().optional(),
  repeat_interval: z.number().nullable().optional(),
  weekly_days: z.array(z.number()).nullable().optional(),
  monthly_day: z.number().nullable().optional(),
  monthly_week: z.number().nullable().optional(),
  end_type: z.enum(['end_date', 'end_after_type']).nullable().optional(),
  recurrence_end_date: z.date().nullable().optional(),
  recurrence_count: z.number().nullable().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function QuickOrderForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<number>(100);
  const [recurringData, setRecurringData] = useState<{
    isRecurring: boolean;
    totalDays: number;
    dates: Date[];
  }>({ isRecurring: false, totalDays: 1, dates: [] });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
      participant_count: 100,
      meeting_date: new Date(),
      meeting_time: getNextHour(),
      meeting_topic: "",
      custom_passcode: "",
      is_meeting_registration: false,
      is_meeting_qna: false,
      is_language_interpretation: false,
      is_mute_upon_entry: false,
      is_req_unmute_permission: false,
      is_recurring: false,
      recurrence_type: null,
      repeat_interval: null,
      weekly_days: null,
      monthly_day: null,
      monthly_week: null,
      end_type: null,
      recurrence_end_date: null,
      recurrence_count: null,
    },
  });

  const watchedDate = form.watch("meeting_date");
  const watchedTime = form.watch("meeting_time");
  const watchedTopic = form.watch("meeting_topic");
  const watchedPasscode = form.watch("custom_passcode");
  const watchedMeetingSettings = {
    is_meeting_registration: form.watch("is_meeting_registration"),
    is_meeting_qna: form.watch("is_meeting_qna"),
    is_language_interpretation: form.watch("is_language_interpretation"),
    is_mute_upon_entry: form.watch("is_mute_upon_entry"),
    is_req_unmute_permission: form.watch("is_req_unmute_permission"),
  };
  
  const basePrice = selectedPackage
    ? packages.find(p => p.participants === selectedPackage)?.promoPrice || 0 
    : 0;
  
  // Total price = base price × total days
  const totalPrice = basePrice * recurringData.totalDays;

  const handlePackageSelect = (participants: number) => {
    setSelectedPackage(participants);
    form.setValue("participant_count", participants);
  };

  const handleRecurringChange = useCallback((result: { isRecurring: boolean; totalDays: number; dates: Date[] }) => {
    setRecurringData(result);
  }, []);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-guest-order', {
        body: {
          name: values.name,
          email: values.email,
          whatsapp: values.whatsapp,
          meeting_date: format(values.meeting_date, 'yyyy-MM-dd'),
          meeting_time: values.meeting_time,
          participant_count: values.participant_count,
          meeting_topic: values.meeting_topic,
          custom_passcode: values.custom_passcode || null,
          is_meeting_registration: values.is_meeting_registration,
          is_meeting_qna: values.is_meeting_qna,
          is_language_interpretation: values.is_language_interpretation,
          is_mute_upon_entry: values.is_mute_upon_entry,
          is_req_unmute_permission: values.is_req_unmute_permission,
          // Recurring fields
          is_recurring: values.is_recurring,
          recurrence_type: values.recurrence_type,
          repeat_interval: values.repeat_interval,
          weekly_days: values.weekly_days,
          monthly_day: values.monthly_day,
          monthly_week: values.monthly_week,
          end_type: values.end_type,
          recurrence_end_date: values.recurrence_end_date 
            ? format(values.recurrence_end_date, 'yyyy-MM-dd') 
            : null,
          recurrence_count: values.recurrence_count,
          total_days: recurringData.totalDays,
        },
      });

      if (error) {
        console.error("Error creating order:", error);
        toast.error("Gagal membuat order. Silakan coba lagi.");
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      if (data?.access_slug) {
        // Store invoice URL for detail page auto-redirect
        if (data?.invoice_url) {
          sessionStorage.setItem(`xendit_url_${data.access_slug}`, data.invoice_url);
        }
        
        // Navigate to order detail page with pending status
        // User can see summary and click pay button from there
        window.location.href = `/quick-order/${data.access_slug}`;
      } else if (data?.invoice_url) {
        // Fallback: direct redirect to Xendit (legacy flow)
        window.location.href = data.invoice_url;
      } else {
        toast.error("Gagal mendapatkan link pembayaran");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Disable dates before today
  const disabledDays = { before: new Date() };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Data Pemesan</h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama lengkap" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="nama@email.com" {...field} />
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
                      <Input placeholder="08123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Detail Meeting</h3>
              
              {/* 1. Jumlah Peserta */}
              <FormField
                control={form.control}
                name="participant_count"
                render={() => (
                  <FormItem>
                    <FormLabel>Kapasitas Ruang Zoom</FormLabel>
                    <FormControl>
                      <PackageSelector
                        selected={selectedPackage}
                        onSelect={handlePackageSelect}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 2. Topik Meeting */}
              <FormField
                control={form.control}
                name="meeting_topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topik Meeting</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Contoh: Team Meeting Weekly" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 3. Tanggal & Jam (horizontal) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="meeting_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tanggal Meeting</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "EEEE, dd MMMM yyyy", { locale: id })
                              ) : (
                                <span>Pilih tanggal</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={disabledDays}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="meeting_time"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Jam Mulai</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih jam">
                              {field.value && (
                                <span className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  {field.value}
                                </span>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60">
                          {timeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 4. Passcode */}
              <FormField
                control={form.control}
                name="custom_passcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passcode (Opsional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Contoh: 123456" 
                        maxLength={10}
                        {...field} 
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Kosongkan untuk auto-generate passcode
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 5. Recurring Meeting Section */}
              <RecurringMeetingSection
                control={form.control}
                startDate={watchedDate}
                startTime={watchedTime}
                onRecurringChange={handleRecurringChange}
              />

              {/* 6. Pengaturan Lanjutan */}
              <MeetingSettingsSection control={form.control} />
            </div>
          </div>

          {/* Right Column - Summary (Sticky on Desktop) */}
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <PricingSummary
              participantCount={selectedPackage}
              meetingDate={watchedDate}
              meetingTime={watchedTime}
              price={basePrice}
              totalPrice={totalPrice}
              meetingTopic={watchedTopic}
              customPasscode={watchedPasscode}
              meetingSettings={watchedMeetingSettings}
              isRecurring={recurringData.isRecurring}
              totalDays={recurringData.totalDays}
              recurringDates={recurringData.dates}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting || !selectedPackage}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Bayar Sekarang"
              )}
            </Button>

            <PaymentMethods />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
