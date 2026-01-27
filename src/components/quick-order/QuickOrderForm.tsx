import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
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
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { PackageSelector, packages } from "./PackageSelector";
import { PricingSummary } from "./PricingSummary";
import { PaymentMethods } from "./PaymentMethods";

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
  participant_count: z.number({
    required_error: "Pilih jumlah peserta",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function QuickOrderForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
    },
  });

  const watchedDate = form.watch("meeting_date");
  
  const currentPrice = selectedPackage 
    ? packages.find(p => p.participants === selectedPackage)?.promoPrice || 0 
    : 0;

  const handlePackageSelect = (participants: number) => {
    setSelectedPackage(participants);
    form.setValue("participant_count", participants);
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-guest-order', {
        body: {
          name: values.name,
          email: values.email,
          whatsapp: values.whatsapp,
          meeting_date: format(values.meeting_date, 'yyyy-MM-dd'),
          participant_count: values.participant_count,
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

      if (data?.invoice_url) {
        // Redirect to Xendit payment page
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
    <Form {...form}>
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
                              <span>Pilih tanggal meeting</span>
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
                name="participant_count"
                render={() => (
                  <FormItem>
                    <FormLabel>Jumlah Peserta</FormLabel>
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
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-4">
            <PricingSummary
              participantCount={selectedPackage}
              meetingDate={watchedDate}
              price={currentPrice}
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
    </Form>
  );
}
