
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Star, Pencil, Trash2, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

type Testimonial = {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  imageUrl?: string;
};

const TestimonialManagement = () => {
  // Example testimonials - in a real app, these would come from an API
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: '1',
      name: 'Budi Santoso',
      position: 'CEO',
      company: 'PT Maju Bersama',
      content: 'Rapatin sangat membantu bisnis kami menghemat biaya rapat online. Kami hanya membayar sesuai penggunaan, tanpa perlu langganan bulanan yang mahal.',
      rating: 5,
      imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      id: '2',
      name: 'Siti Rahayu',
      position: 'HR Manager',
      company: 'Startup Indonesia',
      content: 'Fitur laporan peserta sangat berguna untuk memantau kehadiran tim dalam rapat. Kualitas video dan audio juga sangat baik!',
      rating: 5,
      imageUrl: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    {
      id: '3',
      name: 'Ahmad Hidayat',
      position: 'Project Manager',
      company: 'Konsultan Digital',
      content: 'Saya suka kemudahan menjadwalkan rapat dan tidak ada batasan waktu. Sangat cocok untuk diskusi proyek yang kadang membutuhkan waktu panjang.',
      rating: 4,
      imageUrl: 'https://randomuser.me/api/portraits/men/3.jpg'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null);

  const handleAddNew = () => {
    setCurrentTestimonial({
      id: Date.now().toString(),
      name: '',
      position: '',
      company: '',
      content: '',
      rating: 5,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setCurrentTestimonial(testimonial);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setTestimonials(testimonials.filter(t => t.id !== id));
    toast.success("Testimonial berhasil dihapus");
  };

  const handleSave = (testimonial: Testimonial) => {
    if (testimonials.find(t => t.id === testimonial.id)) {
      // Update existing
      setTestimonials(testimonials.map(t => 
        t.id === testimonial.id ? testimonial : t
      ));
      toast.success("Testimonial berhasil diperbarui");
    } else {
      // Add new
      setTestimonials([...testimonials, testimonial]);
      toast.success("Testimonial baru berhasil ditambahkan");
    }
    setIsDialogOpen(false);
  };

  return (
    <AdminLayout title="Manajemen Testimonial">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Testimonial</h1>
          <p className="text-muted-foreground">Kelola testimonial yang ditampilkan di halaman utama</p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus size={16} />
          Tambah Testimonial
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < testimonial.rating ? "fill-primary text-primary" : "text-gray-300"}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(testimonial)}>
                    <Pencil size={16} />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 size={16} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Testimonial</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus testimonial dari {testimonial.name}? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(testimonial.id)} className="bg-destructive text-destructive-foreground">
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="italic mb-4">"{testimonial.content}"</p>
              <div className="flex items-center mt-4">
                {testimonial.imageUrl && (
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <img
                      src={testimonial.imageUrl}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.position}, {testimonial.company}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog for adding/editing testimonials */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentTestimonial && testimonials.find(t => t.id === currentTestimonial.id)
                ? 'Edit Testimonial'
                : 'Tambah Testimonial Baru'
              }
            </DialogTitle>
            <DialogDescription>
              Isi formulir di bawah untuk {currentTestimonial && testimonials.find(t => t.id === currentTestimonial.id) ? 'memperbarui' : 'menambahkan'} testimonial.
            </DialogDescription>
          </DialogHeader>

          {currentTestimonial && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">Nama</label>
                <Input
                  id="name"
                  value={currentTestimonial.name}
                  onChange={(e) => setCurrentTestimonial({...currentTestimonial, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="position" className="text-right">Jabatan</label>
                <Input
                  id="position"
                  value={currentTestimonial.position}
                  onChange={(e) => setCurrentTestimonial({...currentTestimonial, position: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="company" className="text-right">Perusahaan</label>
                <Input
                  id="company"
                  value={currentTestimonial.company}
                  onChange={(e) => setCurrentTestimonial({...currentTestimonial, company: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="content" className="text-right">Testimonial</label>
                <Textarea
                  id="content"
                  value={currentTestimonial.content}
                  onChange={(e) => setCurrentTestimonial({...currentTestimonial, content: e.target.value})}
                  className="col-span-3"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="rating" className="text-right">Rating</label>
                <div className="col-span-3 flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={`cursor-pointer ${i < currentTestimonial.rating ? "fill-primary text-primary" : "text-gray-300"}`}
                      onClick={() => setCurrentTestimonial({...currentTestimonial, rating: i + 1})}
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="imageUrl" className="text-right">URL Foto</label>
                <Input
                  id="imageUrl"
                  value={currentTestimonial.imageUrl || ''}
                  onChange={(e) => setCurrentTestimonial({...currentTestimonial, imageUrl: e.target.value})}
                  className="col-span-3"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
            <Button onClick={() => currentTestimonial && handleSave(currentTestimonial)}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default TestimonialManagement;
