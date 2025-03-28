
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, Plus, Trash, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

// Schema for privacy policy section validation
const privacySectionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Judul bagian harus diisi"),
  content: z.string().min(10, "Konten harus diisi minimal 10 karakter"),
});

const privacyHeaderSchema = z.object({
  title: z.string().min(3, "Judul harus diisi"),
  lastUpdated: z.string().min(3, "Tanggal pembaruan harus diisi"),
});

// Interface for a privacy policy section
interface PrivacySection {
  id: string;
  title: string;
  content: string;
}

// Interface for overall privacy policy data
interface PrivacyData {
  header: {
    title: string;
    lastUpdated: string;
  };
  sections: PrivacySection[];
}

const PrivacyManagement = () => {
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [privacyData, setPrivacyData] = useState<PrivacyData>({
    header: {
      title: "Kebijakan Privasi",
      lastUpdated: "1 Juni 2023",
    },
    sections: []
  });

  // Forms
  const headerForm = useForm<{title: string, lastUpdated: string}>({
    resolver: zodResolver(privacyHeaderSchema),
    defaultValues: {
      title: "Kebijakan Privasi",
      lastUpdated: "1 Juni 2023",
    }
  });

  const sectionForm = useForm<PrivacySection>({
    resolver: zodResolver(privacySectionSchema),
    defaultValues: {
      id: "",
      title: "",
      content: "",
    }
  });

  // Load privacy policy data from localStorage or use defaults
  const loadPrivacyData = (): PrivacyData => {
    const savedData = localStorage.getItem("privacyData");
    if (savedData) {
      return JSON.parse(savedData);
    }
    
    // Default data if nothing is saved
    return {
      header: {
        title: "Kebijakan Privasi",
        lastUpdated: "1 Juni 2023",
      },
      sections: [
        {
          id: "1",
          title: "1. Pendahuluan",
          content: "PT Rapatin Teknologi Indonesia (\"Rapatin,\" \"kami,\" atau \"kita\") menghargai privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan mengungkapkan informasi pribadi Anda saat Anda menggunakan layanan kami.\n\nDengan menggunakan layanan kami, Anda menyetujui praktik yang dijelaskan dalam Kebijakan Privasi ini. Jika Anda tidak setuju dengan kebijakan ini, harap jangan gunakan layanan kami."
        },
        {
          id: "2",
          title: "2. Informasi yang Kami Kumpulkan",
          content: "Kami dapat mengumpulkan beberapa jenis informasi dari dan tentang pengguna layanan kami, termasuk:\n\n- Informasi pribadi seperti nama, alamat email, dan nomor telepon.\n- Informasi pembayaran untuk memproses transaksi.\n- Informasi tentang penggunaan layanan kami, seperti waktu, durasi, dan jumlah peserta rapat.\n- Informasi teknis seperti alamat IP, jenis perangkat, dan jenis browser."
        }
      ]
    };
  };

  // Load data when component mounts
  useEffect(() => {
    const data = loadPrivacyData();
    setPrivacyData(data);
    headerForm.reset(data.header);
  }, []);

  // Save privacy data
  const savePrivacyData = (data: PrivacyData) => {
    localStorage.setItem("privacyData", JSON.stringify(data));
    toast({
      title: "Berhasil",
      description: "Kebijakan Privasi telah disimpan",
    });
  };

  // Update header
  const onSaveHeader = (data: {title: string, lastUpdated: string}) => {
    const updatedPrivacyData = {
      ...privacyData,
      header: data
    };
    setPrivacyData(updatedPrivacyData);
    savePrivacyData(updatedPrivacyData);
  };

  // Add or update a section
  const handleSectionSubmit = (data: PrivacySection) => {
    let updatedSections: PrivacySection[];
    
    if (editingSection) {
      // Update existing section
      updatedSections = privacyData.sections.map(section => 
        section.id === editingSection ? {...data, id: editingSection} : section
      );
    } else {
      // Add new section
      const newSection = {
        ...data,
        id: Date.now().toString()
      };
      updatedSections = [...privacyData.sections, newSection];
    }
    
    const updatedPrivacyData = {
      ...privacyData,
      sections: updatedSections
    };
    
    setPrivacyData(updatedPrivacyData);
    savePrivacyData(updatedPrivacyData);
    setShowDialog(false);
    setEditingSection(null);
    sectionForm.reset({id: "", title: "", content: ""});
  };

  // Delete a section
  const handleDeleteSection = (id: string) => {
    const updatedSections = privacyData.sections.filter(section => section.id !== id);
    const updatedPrivacyData = {
      ...privacyData,
      sections: updatedSections
    };
    
    setPrivacyData(updatedPrivacyData);
    savePrivacyData(updatedPrivacyData);
  };

  // Edit a section
  const handleEditSection = (section: PrivacySection) => {
    setEditingSection(section.id);
    sectionForm.reset(section);
    setShowDialog(true);
  };

  // Add a new section
  const handleAddNewSection = () => {
    setEditingSection(null);
    sectionForm.reset({id: "", title: "", content: ""});
    setShowDialog(true);
  };

  return (
    <AdminLayout title="Manajemen Kebijakan Privasi">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Manajemen Kebijakan Privasi</h2>
            <p className="text-muted-foreground">
              Kelola Kebijakan Privasi website
            </p>
          </div>
        </div>

        {/* Header Section */}
        <Card>
          <CardContent className="pt-6">
            <Form {...headerForm}>
              <form onSubmit={headerForm.handleSubmit(onSaveHeader)} className="space-y-4">
                <h3 className="text-lg font-semibold">Header</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={headerForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Judul</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={headerForm.control}
                    name="lastUpdated"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Terakhir Diperbarui</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Header
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Sections */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Bagian</h3>
              <Button onClick={handleAddNewSection}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Bagian
              </Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Konten (Preview)</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {privacyData.sections.map((section) => (
                  <TableRow key={section.id}>
                    <TableCell className="font-medium">{section.title}</TableCell>
                    <TableCell className="max-w-md">
                      <div className="line-clamp-2">{section.content}</div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditSection(section)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteSection(section.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                
                {privacyData.sections.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      Belum ada bagian. Klik "Tambah Bagian" untuk menambahkan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Section Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSection ? "Edit Bagian" : "Tambah Bagian Baru"}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...sectionForm}>
            <form onSubmit={sectionForm.handleSubmit(handleSectionSubmit)} className="space-y-4 pt-4">
              <FormField
                control={sectionForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul Bagian</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: 1. Pendahuluan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={sectionForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konten</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Isi konten bagian ini..." 
                        rows={10}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowDialog(false)}
                >
                  Batal
                </Button>
                <Button type="submit">
                  {editingSection ? "Perbarui" : "Tambah"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default PrivacyManagement;
