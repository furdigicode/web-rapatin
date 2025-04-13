
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash, Eye, ArrowRight, Calendar, Tag, User, Link as LinkIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from '@/components/admin/RichTextEditor';
import SEOPanel from '@/components/admin/SEOPanel';
import { BlogPost, BlogPostFormData, defaultBlogPostFormData } from '@/types/BlogTypes';

const BlogManagement = () => {
  const { toast } = useToast();

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: 1,
      title: "Cara Mengoptimalkan Rapat Online Anda",
      slug: "cara-mengoptimalkan-rapat-online-anda",
      excerpt: "Pelajari cara membuat rapat online Anda lebih produktif dan efisien dengan tips dan trik dari para ahli.",
      content: "<h2>Pendahuluan</h2><p>Rapat online telah menjadi bagian penting dari rutinitas kerja modern. Artikel ini akan membahas cara mengoptimalkan rapat online agar lebih efektif dan efisien.</p><h2>Tips Mengoptimalkan Rapat Online</h2><ul><li>Siapkan agenda yang jelas</li><li>Tentukan durasi yang tepat</li><li>Gunakan fitur screen sharing</li><li>Rekam rapat untuk referensi</li></ul>",
      coverImage: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=627&q=80",
      category: "Tips & Trik",
      author: "Budi Setiawan",
      date: "10 Juni 2023",
      status: "published",
      publishedAt: "2023-06-10T09:00:00",
      seoTitle: "10 Cara Mengoptimalkan Rapat Online untuk Efisiensi Maksimal",
      metaDescription: "Pelajari cara membuat rapat online Anda lebih produktif dan efisien dengan panduan lengkap ini. Dapatkan tips terbaik dari para ahli untuk meningkatkan kolaborasi tim.",
      focusKeyword: "rapat online"
    },
    {
      id: 2,
      title: "Mengapa Model Bayar-Sesuai-Pakai Lebih Ekonomis",
      slug: "mengapa-model-bayar-sesuai-pakai-lebih-ekonomis",
      excerpt: "Analisis mendalam tentang bagaimana model bayar-sesuai-pakai dapat menghemat biaya rapat online Anda secara signifikan.",
      content: "<h2>Model Bayar-Sesuai-Pakai</h2><p>Dalam model bisnis ini, Anda hanya membayar untuk apa yang Anda gunakan, tidak lebih dan tidak kurang.</p>",
      coverImage: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=627&q=80",
      category: "Bisnis",
      author: "Dewi Lestari",
      date: "28 Mei 2023",
      status: "published",
      publishedAt: "2023-05-28T10:30:00",
      seoTitle: "Model Bayar-Sesuai-Pakai: Solusi Ekonomis untuk Rapat Online",
      metaDescription: "Temukan bagaimana model bayar-sesuai-pakai dapat menghemat biaya rapat online Anda hingga 40%. Analisis perbandingan dengan model langganan bulanan.",
      focusKeyword: "bayar sesuai pakai"
    },
    {
      id: 3,
      title: "Fitur Baru: Laporan Peserta yang Ditingkatkan",
      slug: "fitur-baru-laporan-peserta-yang-ditingkatkan",
      excerpt: "Jelajahi fitur laporan peserta baru kami yang memberi Anda wawasan lebih mendalam tentang partisipasi rapat.",
      content: "<h2>Fitur Laporan Peserta</h2><p>Dengan fitur baru ini, Anda dapat melihat statistik lengkap tentang partisipasi peserta dalam rapat.</p>",
      coverImage: "https://images.unsplash.com/photo-1559223607-a43c990c692c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=627&q=80",
      category: "Fitur Baru",
      author: "Adi Nugroho",
      date: "15 Mei 2023",
      status: "draft",
      publishedAt: "",
      seoTitle: "Fitur Baru: Tingkatkan Analisis Rapat dengan Laporan Peserta",
      metaDescription: "Kenali fitur laporan peserta terbaru dari Rapatin yang memberikan wawasan mendalam tentang keterlibatan dan partisipasi dalam rapat online Anda.",
      focusKeyword: "laporan peserta"
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
  
  const [formData, setFormData] = useState<BlogPostFormData>({
    ...defaultBlogPostFormData,
    category: categories[0]
  });

  // Auto-update SEO title when main title changes (if SEO title is empty)
  useEffect(() => {
    if (formData.title && !formData.seoTitle) {
      setFormData({...formData, seoTitle: formData.title});
    }
  }, [formData.title]);

  const handleInputChange = (field: keyof BlogPostFormData, value: string) => {
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
    
    // Generate slug if empty
    let finalSlug = formData.slug;
    if (!finalSlug) {
      finalSlug = formData.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      
      // Check for duplicate slug
      const existingSlug = blogPosts.find(post => post.slug === finalSlug);
      if (existingSlug) {
        finalSlug = `${finalSlug}-${Date.now()}`;
      }
    }
    
    const newId = blogPosts.length > 0 ? Math.max(...blogPosts.map(post => post.id)) + 1 : 1;
    
    // Update sitemap for published posts (in real implementation)
    if (formData.status === 'published') {
      console.log('Updating sitemap.xml with new article');
    }
    
    // Ensure the status is one of the allowed values
    const validStatus = formData.status === 'published' || formData.status === 'scheduled' 
      ? formData.status 
      : 'draft';
      
    const newPost: BlogPost = {
      ...formData,
      id: newId,
      slug: finalSlug,
      status: validStatus
    };
    
    setBlogPosts([...blogPosts, newPost]);
    
    // Reset form
    setFormData({
      ...defaultBlogPostFormData,
      category: categories[0]
    });
    
    setIsCreating(false);
    
    toast({
      title: "Artikel berhasil dibuat",
      description: `Artikel "${formData.title}" telah berhasil dibuat sebagai ${validStatus}`,
    });
  };

  const handleStartEdit = (post: BlogPost) => {
    setIsEditing(post.id);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      category: post.category,
      author: post.author,
      date: post.date,
      status: post.status,
      publishedAt: post.publishedAt,
      seoTitle: post.seoTitle,
      metaDescription: post.metaDescription,
      focusKeyword: post.focusKeyword
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
    
    // Generate slug if empty
    let finalSlug = formData.slug;
    if (!finalSlug) {
      finalSlug = formData.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      
      // Check for duplicate slug that isn't the current post
      const existingSlug = blogPosts.find(post => post.slug === finalSlug && post.id !== isEditing);
      if (existingSlug) {
        finalSlug = `${finalSlug}-${Date.now()}`;
      }
    }
    
    // Update sitemap for published posts (in real implementation)
    if (formData.status === 'published') {
      console.log('Updating sitemap.xml with updated article');
    }
    
    // Ensure the status is one of the allowed values
    const validStatus = formData.status === 'published' || formData.status === 'scheduled' 
      ? formData.status 
      : 'draft';
    
    setBlogPosts(blogPosts.map(post => 
      post.id === isEditing ? { ...post, ...formData, slug: finalSlug, status: validStatus } : post
    ));
    
    setIsEditing(null);
    
    toast({
      title: "Artikel berhasil diperbarui",
      description: `Artikel "${formData.title}" telah berhasil diperbarui`,
    });
  };

  const handleDeletePost = (id: number) => {
    const postToDelete = blogPosts.find(post => post.id === id);
    
    // Update sitemap by removing the deleted post (in real implementation)
    if (postToDelete && postToDelete.status === 'published') {
      console.log(`Removing ${postToDelete.slug} from sitemap.xml`);
    }
    
    setBlogPosts(blogPosts.filter(post => post.id !== id));
    
    toast({
      title: "Artikel berhasil dihapus",
      description: "Artikel telah berhasil dihapus",
    });
  };

  const handlePublishPost = (id: number) => {
    const updatedPosts = blogPosts.map(post => 
      post.id === id ? { 
        ...post, 
        status: 'published' as const, 
        publishedAt: new Date().toISOString() 
      } : post
    );
    
    setBlogPosts(updatedPosts);
    
    // Update sitemap with newly published post (in real implementation)
    const publishedPost = updatedPosts.find(post => post.id === id);
    if (publishedPost) {
      console.log(`Adding ${publishedPost.slug} to sitemap.xml`);
    }
    
    toast({
      title: "Artikel berhasil dipublikasikan",
      description: "Artikel telah berhasil dipublikasikan",
    });
  };

  const handleImageUpload = () => {
    // In a real implementation, this would open a file picker and upload the image
    const imageUrl = prompt("Enter image URL (in production, this would be a file upload):");
    if (imageUrl) {
      setFormData({...formData, coverImage: imageUrl});
    }
  };

  const renderBlogForm = (action: 'create' | 'edit') => {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {action === 'create' ? 'Buat Artikel Baru' : 'Edit Artikel'}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => action === 'create' ? setIsCreating(false) : setIsEditing(null)}>
              Batal
            </Button>
            <Button onClick={action === 'create' ? handleCreatePost : handleUpdatePost}>
              {action === 'create' ? 'Simpan Artikel' : 'Perbarui Artikel'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="content">
          <TabsList>
            <TabsTrigger value="content">Konten</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="settings">Pengaturan</TabsTrigger>
          </TabsList>
          
          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Judul Artikel</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Masukkan judul artikel"
                className="text-lg"
              />
            </div>
            
            {/* Cover Image */}
            <div className="space-y-2">
              <Label>Cover Image</Label>
              <div className="flex items-start gap-4">
                {formData.coverImage && (
                  <div className="w-1/3">
                    <img 
                      src={formData.coverImage} 
                      alt="Cover preview" 
                      className="w-full h-auto rounded-md border object-cover aspect-[16/9]" 
                    />
                  </div>
                )}
                <div className={formData.coverImage ? "w-2/3" : "w-full"}>
                  <div className="flex gap-2">
                    <Input
                      value={formData.coverImage}
                      onChange={(e) => handleInputChange('coverImage', e.target.value)}
                      placeholder="URL gambar cover"
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" onClick={handleImageUpload}>
                      Upload
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ukuran ideal: 1200x627 piksel (rasio 1.91:1)
                  </p>
                </div>
              </div>
            </div>
            
            {/* Excerpt */}
            <div className="space-y-2">
              <Label htmlFor="excerpt">Ringkasan</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                placeholder="Masukkan ringkasan artikel (akan ditampilkan di halaman blog)"
                rows={2}
              />
            </div>
            
            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Konten</Label>
              <RichTextEditor 
                value={formData.content}
                onChange={(value) => handleInputChange('content', value)}
              />
            </div>
          </TabsContent>
          
          {/* SEO Tab */}
          <TabsContent value="seo">
            <SEOPanel
              title={formData.seoTitle}
              setTitle={(value) => handleInputChange('seoTitle', value)}
              slug={formData.slug}
              setSlug={(value) => handleInputChange('slug', value)}
              metaDescription={formData.metaDescription}
              setMetaDescription={(value) => handleInputChange('metaDescription', value)}
              focusKeyword={formData.focusKeyword}
              setFocusKeyword={(value) => handleInputChange('focusKeyword', value)}
              content={formData.content}
            />
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-6">
                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="flex items-center gap-2">
                    <Tag size={14} />
                    Kategori
                  </Label>
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
                
                {/* Author */}
                <div className="space-y-2">
                  <Label htmlFor="author" className="flex items-center gap-2">
                    <User size={14} />
                    Penulis
                  </Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                  />
                </div>
                
                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status Publikasi</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value as 'draft' | 'published' | 'scheduled')}
                    className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
                
                {/* Published Date/Time */}
                {formData.status === 'scheduled' && (
                  <div className="space-y-2">
                    <Label htmlFor="publishedAt" className="flex items-center gap-2">
                      <Calendar size={14} />
                      Jadwal Publikasi
                    </Label>
                    <Input
                      id="publishedAt"
                      type="datetime-local"
                      value={formData.publishedAt}
                      onChange={(e) => handleInputChange('publishedAt', e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
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
              <h2 className="text-2xl font-bold">Manajemen Artikel</h2>
              <p className="text-muted-foreground">Kelola semua artikel blog Anda</p>
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
                  <div className="flex gap-6">
                    {/* Cover image */}
                    {post.coverImage && (
                      <div className="hidden sm:block w-32 h-32 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={post.coverImage} 
                          alt={post.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              post.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : post.status === 'scheduled'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {post.status === 'published' 
                                ? 'Published' 
                                : post.status === 'scheduled'
                                ? 'Scheduled'
                                : 'Draft'
                              }
                            </span>
                            <span className="text-xs text-muted-foreground">{post.date}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{post.category}</span>
                          </div>
                          <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User size={12} />
                              <span>{post.author}</span>
                            </div>
                            {post.slug && (
                              <div className="flex items-center gap-1">
                                <LinkIcon size={12} />
                                <span className="truncate max-w-[200px]">/blog/{post.slug}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" className="h-8 gap-1 min-w-20" title="Lihat">
                        <Eye size={14} />
                        <span>Lihat</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 gap-1 min-w-20" 
                        onClick={() => handleStartEdit(post)}
                        title="Edit"
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </Button>
                      {post.status === 'draft' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 gap-1 text-green-600 hover:text-green-700 min-w-20" 
                          onClick={() => handlePublishPost(post.id)}
                          title="Publikasikan"
                        >
                          <ArrowRight size={14} />
                          <span>Publish</span>
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 gap-1 text-destructive hover:text-destructive min-w-20" 
                        onClick={() => handleDeletePost(post.id)}
                        title="Hapus"
                      >
                        <Trash size={14} />
                        <span>Hapus</span>
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
