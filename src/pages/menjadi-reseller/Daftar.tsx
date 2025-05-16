
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const formSchema = z.object({
  name: z.string().min(3, { message: "Nama harus minimal 3 karakter." }),
  email: z.string().email({ message: "Alamat email tidak valid." }),
  whatsapp: z.string()
    .min(10, { message: "Nomor WhatsApp minimal 10 digit." })
    .refine((val) => /^[0-9]+$/.test(val), { message: "Nomor WhatsApp hanya boleh berisi angka." }),
  has_sold_zoom: z.enum(["true", "false"]),
  selling_experience: z.string().optional(),
  reason: z.string().min(20, { message: "Alasan harus minimal 20 karakter." }),
  selling_plan: z.string().min(20, { message: "Rencana penjualan harus minimal 20 karakter." }),
  monthly_target: z.coerce.number().int().positive({ message: "Target bulanan harus berupa angka positif." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function DaftarReseller() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
      has_sold_zoom: "false",
      selling_experience: "",
      reason: "",
      selling_plan: "",
      monthly_target: 0,
    },
  });

  const hasSoldZoom = form.watch("has_sold_zoom");

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    
    try {
      // Convert string "true"/"false" to boolean for database
      const hasSold = values.has_sold_zoom === "true";
      
      const { error } = await supabase.from("reseller_applications").insert({
        name: values.name,
        email: values.email,
        whatsapp: values.whatsapp,
        has_sold_zoom: hasSold,
        selling_experience: hasSold ? values.selling_experience : null,
        reason: values.reason,
        selling_plan: values.selling_plan,
        monthly_target: values.monthly_target,
      });

      if (error) {
        console.error("Error submitting form:", error);
        toast.error("Terjadi kesalahan saat mengirim formulir. Silakan coba lagi.");
      } else {
        setIsSuccess(true);
        toast.success("Formulir pendaftaran berhasil dikirim!");
        setTimeout(() => {
          navigate("/menjadi-reseller");
        }, 5000);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
          <Card className="border border-green-200 shadow-md">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-center text-2xl text-green-700">Pendaftaran Berhasil!</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <svg className="h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="mb-6 text-lg">
                  Terima kasih telah mendaftar sebagai reseller Rapatin! Kami akan menghubungi Anda melalui WhatsApp atau email dalam 1-2 hari kerja.
                </p>
                <Button onClick={() => navigate("/menjadi-reseller")}>Kembali ke Halaman Reseller</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Daftar Sebagai Reseller</h1>
          <p className="text-muted-foreground">Lengkapi formulir di bawah untuk memulai perjalanan Anda sebagai reseller Rapatin</p>
        </div>

        <Card className="border shadow-lg">
          <CardHeader>
            <CardTitle>Formulir Pendaftaran Reseller</CardTitle>
            <CardDescription>
              Semua informasi yang Anda berikan akan diperlakukan dengan rahasia dan hanya digunakan untuk proses pendaftaran.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                          placeholder="Contoh: 081234567890" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Masukkan nomor tanpa tanda + atau angka 0 di depan
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="has_sold_zoom"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Apakah pernah menjual link Zoom?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="true" />
                            </FormControl>
                            <FormLabel className="font-normal">Ya</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="false" />
                            </FormControl>
                            <FormLabel className="font-normal">Tidak</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {hasSoldZoom === "true" && (
                  <FormField
                    control={form.control}
                    name="selling_experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ceritakan pengalaman berjualan Anda</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ceritakan bagaimana cara Anda berjualan selama ini..."
                            className="min-h-[120px]"
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
                          placeholder="Tuliskan alasan Anda ingin menjadi reseller Rapatin..."
                          className="min-h-[120px]"
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
                      <FormLabel>Kemana rencana Anda menawarkan layanan link Zoom</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Jelaskan rencana pemasaran Anda..."
                          className="min-h-[120px]"
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
                          min="1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Mengirim..." : "Kirim Pendaftaran"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t bg-muted/50 px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Dengan mengirimkan formulir ini, Anda setuju untuk dihubungi oleh tim Rapatin.
            </p>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </>
  );
}
