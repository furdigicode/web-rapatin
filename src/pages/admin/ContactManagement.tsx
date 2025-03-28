
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Schema for contact form validation
const contactFormSchema = z.object({
  email: z.string().email("Email harus valid"),
  phone: z.string().min(5, "Nomor telepon harus diisi"),
  address: z.string().min(3, "Alamat harus diisi"),
  officeHours: z.string().min(3, "Jam operasional harus diisi"),
  formTitle: z.string().min(3, "Judul formulir harus diisi"),
  formSubtitle: z.string().min(3, "Subjudul formulir harus diisi")
});

// Interface for contact data
interface ContactData {
  email: string;
  phone: string;
  address: string;
  officeHours: string;
  formTitle: string;
  formSubtitle: string;
}

const ContactManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("info");

  // Default contact information
  const defaultContactData: ContactData = {
    email: "hello@rapatin.id",
    phone: "+62 812 3456 7890",
    address: "Jl. Sudirman No. 123, Jakarta Selatan, 12190, Indonesia",
    officeHours: "Senin - Jumat, 9:00 - 17:00 WIB",
    formTitle: "Kirim Pesan",
    formSubtitle: "Isi formulir di bawah ini dan kami akan segera menghubungi Anda"
  };

  // Load saved contact data from localStorage or use defaults
  const loadContactData = (): ContactData => {
    const savedData = localStorage.getItem("contactData");
    if (savedData) {
      return JSON.parse(savedData);
    }
    return defaultContactData;
  };

  // Initialize form with contact data
  const form = useForm<ContactData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: loadContactData()
  });

  // Load data when component mounts
  useEffect(() => {
    const contactData = loadContactData();
    form.reset(contactData);
  }, [form]);

  // Save contact data
  const onSubmit = (data: ContactData) => {
    localStorage.setItem("contactData", JSON.stringify(data));
    toast({
      title: "Berhasil",
      description: "Informasi kontak telah disimpan",
    });
  };

  return (
    <AdminLayout title="Manajemen Kontak">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Manajemen Kontak</h2>
            <p className="text-muted-foreground">
              Kelola informasi kontak dan formulir kontak
            </p>
          </div>
          <Button onClick={form.handleSubmit(onSubmit)}>
            <Save className="mr-2 h-4 w-4" />
            Simpan Perubahan
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="info">Informasi Kontak</TabsTrigger>
                <TabsTrigger value="form">Formulir Kontak</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info">
                <Card>
                  <CardContent className="pt-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <div className="flex items-center gap-2">
                                <Mail size={16} />
                                <span>Email</span>
                              </div>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="hello@rapatin.id" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <div className="flex items-center gap-2">
                                <Phone size={16} />
                                <span>Telepon</span>
                              </div>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="+62 812 3456 7890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center gap-2">
                              <MapPin size={16} />
                              <span>Alamat</span>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Jl. Sudirman No. 123, Jakarta Selatan, 12190, Indonesia" 
                              rows={3}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="officeHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jam Operasional</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Senin - Jumat, 9:00 - 17:00 WIB" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="form">
                <Card>
                  <CardContent className="pt-6 space-y-6">
                    <FormField
                      control={form.control}
                      name="formTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Judul Formulir</FormLabel>
                          <FormControl>
                            <Input placeholder="Kirim Pesan" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="formSubtitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subjudul Formulir</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Isi formulir di bawah ini dan kami akan segera menghubungi Anda" 
                              rows={3}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default ContactManagement;
