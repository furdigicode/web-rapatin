import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, Trash, Move } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const FAQManagement = () => {
  const { toast } = useToast();
  
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: 1,
      question: "Apa itu Rapatin?",
      answer: "Rapatin adalah platform penjadwalan rapat online dengan model bayar-sesuai-pakai, tanpa memerlukan langganan bulanan atau akun Zoom berbayar.",
      category: "Umum"
    },
    {
      id: 2,
      question: "Bagaimana cara kerja model bayar-sesuai-pakai?",
      answer: "Anda cukup isi saldo akun Anda dan bayar hanya untuk rapat yang benar-benar Anda jadwalkan. Tidak ada biaya langganan tetap atau minimum.",
      category: "Pembayaran"
    },
    {
      id: 3,
      question: "Berapa lama rekaman cloud tersimpan?",
      answer: "Rekaman cloud tersimpan selama 72 jam setelah rapat selesai dan dapat diunduh kapan saja selama periode tersebut.",
      category: "Fitur"
    }
  ]);
  
  const [newFAQ, setNewFAQ] = useState<Omit<FAQ, 'id'>>({
    question: "",
    answer: "",
    category: "Umum"
  });

  const categories = ["Umum", "Pembayaran", "Fitur", "Teknis", "Akun"];

  const handleAddFAQ = () => {
    if (!newFAQ.question || !newFAQ.answer) {
      toast({
        variant: "destructive",
        title: "Terjadi kesalahan",
        description: "Pertanyaan dan jawaban harus diisi",
      });
      return;
    }
    
    const newId = faqs.length > 0 ? Math.max(...faqs.map(faq => faq.id)) + 1 : 1;
    setFaqs([...faqs, { ...newFAQ, id: newId }]);
    setNewFAQ({
      question: "",
      answer: "",
      category: "Umum"
    });
    
    toast({
      title: "FAQ berhasil ditambahkan",
      description: "FAQ baru telah berhasil ditambahkan",
    });
  };

  const handleUpdateFAQ = (id: number, field: keyof Omit<FAQ, 'id'>, value: string) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, [field]: value } : faq
    ));
  };

  const handleDeleteFAQ = (id: number) => {
    setFaqs(faqs.filter(faq => faq.id !== id));
    toast({
      title: "FAQ berhasil dihapus",
      description: "FAQ telah berhasil dihapus",
    });
  };

  const handleSaveAll = () => {
    // In a real app, this would save to a backend
    toast({
      title: "Perubahan berhasil disimpan",
      description: "Semua perubahan FAQ telah berhasil disimpan",
    });
  };

  return (
    <AdminLayout title="Manajemen FAQ">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
            <p className="text-sm text-muted-foreground">Kelola pertanyaan yang sering diajukan</p>
          </div>
          <Button onClick={handleSaveAll} className="gap-2">
            <Save size={16} />
            Simpan Semua
          </Button>
        </div>
        
        {/* Add New FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Tambah FAQ Baru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="new-question">Pertanyaan</Label>
              <Input
                id="new-question"
                value={newFAQ.question}
                onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                placeholder="Masukkan pertanyaan baru"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="new-answer">Jawaban</Label>
              <Textarea
                id="new-answer"
                value={newFAQ.answer}
                onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                placeholder="Masukkan jawaban"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="new-category">Kategori</Label>
              <select
                id="new-category"
                value={newFAQ.category}
                onChange={(e) => setNewFAQ({ ...newFAQ, category: e.target.value })}
                className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <Button onClick={handleAddFAQ} className="w-full gap-2">
              <Plus size={16} />
              Tambah FAQ
            </Button>
          </CardContent>
        </Card>
        
        {/* Existing FAQs */}
        <h3 className="text-lg font-semibold mt-8 mb-4">FAQ yang Ada</h3>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <Card key={faq.id} className="relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8" title="Pindahkan">
                  <Move size={16} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 text-destructive hover:text-destructive" 
                  onClick={() => handleDeleteFAQ(faq.id)}
                  title="Hapus"
                >
                  <Trash size={16} />
                </Button>
              </div>
              <CardContent className="pt-6 space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor={`question-${faq.id}`}>Pertanyaan</Label>
                  <Input
                    id={`question-${faq.id}`}
                    value={faq.question}
                    onChange={(e) => handleUpdateFAQ(faq.id, 'question', e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor={`answer-${faq.id}`}>Jawaban</Label>
                  <Textarea
                    id={`answer-${faq.id}`}
                    value={faq.answer}
                    onChange={(e) => handleUpdateFAQ(faq.id, 'answer', e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor={`category-${faq.id}`}>Kategori</Label>
                  <select
                    id={`category-${faq.id}`}
                    value={faq.category}
                    onChange={(e) => handleUpdateFAQ(faq.id, 'category', e.target.value)}
                    className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default FAQManagement;
