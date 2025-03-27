
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash, Eye, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  status: 'draft' | 'published';
}

const BlogManagement = () => {
  const { toast } = useToast();

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: 1,
      title: "Cara Mengoptimalkan Rapat Online Anda",
      excerpt: "Pelajari cara membuat rapat online Anda lebih produktif dan efisien dengan tips dan trik dari para ahli.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut...",
      category: "Tips & Trik",
      author: "Budi Setiawan",
      date: "10 Juni 2023",
      status: "published"
    },
    {
      id: 2,
      title: "Mengapa Model Bayar-Sesuai-Pakai Lebih Ekonomis",
      excerpt: "Analisis mendalam tentang bagaimana model bayar-sesuai-pakai dapat menghemat biaya rapat online Anda secara signifikan.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut...",
      category: "Bisnis",
      author: "Dewi Lestari",
      date: "28 Mei 2023",
      status: "published"
    },
    {
      id: 3,
      title: "Fitur Baru: Laporan Peserta yang Ditingkatkan (Draft)",
      excerpt: "Jelajahi fitur laporan peserta baru kami yang memberi Anda wawasan lebih mendalam tentang partisipasi rapat.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut...",
      category: "Fitur Baru",
      author: "Adi Nugroho",
      date: "15 Mei 2023",
      status: "draft"
    }
  ]);
  
  const categories = [
    "Tips & Trik", 
    "Bisnis", 
    "Fitur Baru", 
    "Keamanan", 
    "Studi Kasus", 
    "Produktivitas"
  ];

  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<Omit<BlogPost, 'id'>>({
    title: "",
    excerpt: "",
    content: "",
    category: categories[0],
    author: "Admin",
    date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
    status: "draft"
  });

  const handleInputChange = (field: keyof Omit<BlogPost, 'id'>, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCreatePost = () => {
    if (!formData.title || !formData.content) {
      toast({
        variant: "destructive",
        title: "Terjadi kesalahan",
        description: "Judul dan konten harus diisi",
      });
      return;
    }
    
    const newId = blogPosts.length > 0 ? Math.max(...blogPosts.map(post => post.id)) + 1 : 1;
    setBlogPosts([...blogPosts, { ...formData, id: newId }]);
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: categories[0],
      author: "Admin",
      date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
      status: "draft"
    });
    setIsCreating(false);
    
    toast({
      title: "Artikel berhasil dibuat",
      description: `Artikel "${formData.title}" telah berhasil dibuat sebagai ${formData.status}`,
    });
  };

  const handleStartEdit = (post: BlogPost) => {
    setIsEditing(post.id);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      author: post.author,
      date: post.date,
      status: post.status
    });
  };

  const handleUpdatePost = () => {
    if (!isEditing) return;
    
    if (!formData.title || !formData.content) {
      toast({
        variant: "destructive",
        title: "Terjadi kesalahan",
        description: "Judul dan konten harus diisi",
      });
      return;
    }
    
    setBlogPosts(blogPosts.map(post => 
      post.id === isEditing ? { ...post, ...formData } : post
    ));
    setIsEditing(null);
    
    toast({
      title: "Artikel berhasil diperbarui",
      description: `Artikel "${formData.title}" telah berhasil diperbarui`,
    });
  };

  const handleDeletePost = (id: number) => {
    setBlogPosts(blogPosts.filter(post => post.id !== id));
    
    toast({
      title: "Artikel berhasil dihapus",
      description: "Artikel telah berhasil dihapus",
    });
  };

  const handlePublishPost = (id: number) => {
    setBlogPosts(blogPosts.map(post => 
      post.id === id ? { ...post, status: 'published' } : post
    ));
    
    toast({
      title: "Artikel berhasil dipublikasikan",
      description: "Artikel telah berhasil dipublikasikan",
    });
  };

  const renderBlogForm = (action: 'create' | 'edit') => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{action === 'create' ? 'Buat Artikel Baru' : 'Edit Artikel'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Judul</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Masukkan judul artikel"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="excerpt">Ringkasan</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              placeholder="Masukkan ringkasan artikel"
              rows={2}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="content">Konten</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Masukkan konten artikel"
              rows={8}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Kategori</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="author">Penulis</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value as 'draft' | 'published')}
              className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => action === 'create' ? setIsCreating(false) : setIsEditing(null)}>
            Batal
          </Button>
          <Button onClick={action === 'create' ? handleCreatePost : handleUpdatePost}>
            {action === 'create' ? 'Buat Artikel' : 'Perbarui Artikel'}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <AdminLayout title="Manajemen Blog">
      {isCreating ? (
        renderBlogForm('create')
      ) : isEditing !== null ? (
        renderBlogForm('edit')
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Artikel Blog</h2>
              <p className="text-sm text-muted-foreground">Kelola semua artikel blog Anda</p>
            </div>
            <Button onClick={() => setIsCreating(true)} className="gap-2">
              <Plus size={16} />
              Tambah Artikel
            </Button>
          </div>
          
          <div className="space-y-4">
            {blogPosts.map((post) => (
              <Card key={post.id} className={post.status === 'draft' ? 'border-dashed' : ''}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          post.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {post.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                        <span className="text-xs text-muted-foreground">{post.date}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{post.category}</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{post.excerpt}</p>
                      <div className="text-xs text-muted-foreground">
                        Penulis: {post.author}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 gap-1" title="Lihat">
                        <Eye size={14} />
                        <span className="sr-only md:not-sr-only">Lihat</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 gap-1" 
                        onClick={() => handleStartEdit(post)}
                        title="Edit"
                      >
                        <Edit size={14} />
                        <span className="sr-only md:not-sr-only">Edit</span>
                      </Button>
                      {post.status === 'draft' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 gap-1 text-green-600 hover:text-green-700" 
                          onClick={() => handlePublishPost(post.id)}
                          title="Publikasikan"
                        >
                          <ArrowRight size={14} />
                          <span className="sr-only md:not-sr-only">Publikasikan</span>
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 gap-1 text-destructive hover:text-destructive" 
                        onClick={() => handleDeletePost(post.id)}
                        title="Hapus"
                      >
                        <Trash size={14} />
                        <span className="sr-only md:not-sr-only">Hapus</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default BlogManagement;
