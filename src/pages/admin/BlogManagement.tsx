import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash, Eye, ArrowRight, Calendar, Tag, User, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from '@/components/admin/RichTextEditor';
import SEOPanel from '@/components/admin/SEOPanel';
import { BlogPost, BlogPostFormData, defaultBlogPostFormData } from '@/types/BlogTypes';
import { supabase } from '@/integrations/supabase/client';
import { DeleteConfirmation } from '@/components/blog/DeleteConfirmation';
import AIArticleGenerator from '@/components/admin/AIArticleGenerator';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AuthorSelector from '@/components/admin/AuthorSelector';
import { FileUpload } from '@/components/ui/file-upload';
import { calculateWordCount } from '@/utils/wordCount';
import { CoverImageSelector } from "@/components/admin/CoverImageSelector";
import { BlogPreviewDialog } from '@/components/admin/BlogPreviewDialog';

const BlogManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [imageUploadMode, setImageUploadMode] = useState<'url' | 'upload'>('upload');
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);

  const [formData, setFormData] = useState<BlogPostFormData>({
    ...defaultBlogPostFormData
  });
  const [showCoverImageSelector, setShowCoverImageSelector] = useState(false);

  const { data: categoriesData } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      // Use a raw query approach to get around TypeScript limitations
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*');
      
      if (error) {
        console.error('Error fetching categories:', error);
        toast({
          variant: "destructive",
          title: "Error fetching categories",
          description: error.message,
        });
        return [];
      }
      
      // Extract category names from the data
      return data.map((category: any) => category.name);
    },
  });

  const categories = categoriesData || [];

  const { data: blogPosts = [], isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          authors!inner(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching blog posts:', error);
        toast({
          variant: "destructive",
          title: "Error fetching blog posts",
          description: error.message,
        });
        return [];
      }
      
      return data.map(post => ({
        id: post.id,
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        coverImage: post.cover_image || '',
        category: post.category || '',
        author: post.authors?.name || post.author || 'Admin',
        author_id: post.author_id || '',
        date: new Date(post.created_at).toLocaleDateString('id-ID', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        status: post.status as 'draft' | 'published' | 'scheduled',
        publishedAt: post.published_at || '',
        seoTitle: post.seo_title || '',
        metaDescription: post.meta_description || '',
        focusKeyword: post.focus_keyword || '',
        wordCount: post.word_count || 0
      }));
    },
  });

  useEffect(() => {
    if (formData.title && !formData.seoTitle) {
      setFormData({...formData, seoTitle: formData.title});
    }
  }, [formData.title]);

  const createPostMutation = useMutation({
    mutationFn: async (postData: BlogPostFormData) => {
      // Get author name if author_id is provided
      let authorName = postData.author;
      if (postData.author_id) {
        const { data: authorData } = await supabase
          .from('authors')
          .select('name')
          .eq('id', postData.author_id)
          .single();
        authorName = authorData?.name || postData.author;
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          title: postData.title,
          slug: postData.slug,
          excerpt: postData.excerpt,
          content: postData.content,
          cover_image: postData.coverImage,
          category: postData.category,
          author: authorName,
          author_id: postData.author_id || 'da51c3a0-4e84-4fe2-adfe-bd681a2fda2f',
          status: postData.status,
          published_at: postData.status === 'published' ? new Date().toISOString() : (postData.publishedAt || null),
          seo_title: postData.seoTitle,
          meta_description: postData.metaDescription,
          focus_keyword: postData.focusKeyword,
          word_count: postData.wordCount
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast({
        title: "Artikel berhasil dibuat",
        description: `Artikel "${formData.title}" telah berhasil dibuat`,
      });
      setIsCreating(false);
      setFormData({
        ...defaultBlogPostFormData,
        category: categories.length > 0 ? categories[0] : ''
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Terjadi kesalahan",
        description: error.message,
      });
    }
  });

  const updatePostMutation = useMutation({
    mutationFn: async (postData: BlogPostFormData & { id: string }) => {
      console.log("🔄 Starting update for post ID:", postData.id);
      console.log("📝 Form data:", postData);
      
      // Check if we have proper authentication
      const { data: { session } } = await supabase.auth.getSession();
      console.log("🔐 Auth session:", session ? "Found" : "Missing");
      
      // Get author name if author_id is provided
      let authorName = postData.author;
      if (postData.author_id) {
        const { data: authorData } = await supabase
          .from('authors')
          .select('name')
          .eq('id', postData.author_id)
          .single();
        authorName = authorData?.name || postData.author;
      }

      const updateData = {
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt,
        content: postData.content,
        cover_image: postData.coverImage,
        category: postData.category,
        author: authorName,
        author_id: postData.author_id,
        status: postData.status,
        published_at: postData.status === 'published' && !postData.publishedAt ? new Date().toISOString() : (postData.publishedAt || null),
        seo_title: postData.seoTitle,
        meta_description: postData.metaDescription,
        focus_keyword: postData.focusKeyword,
        word_count: postData.wordCount
      };
      
      console.log("📦 Update payload:", updateData);
      
      // Perform the update with detailed error handling
      const { data: updatedData, error } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('id', postData.id)
        .select('*')
        .maybeSingle();
      
      if (error) {
        console.error("❌ Supabase update error:", error);
        console.error("Error details:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw new Error(`Update failed: ${error.message}`);
      }
      
      if (!updatedData) {
        console.error("❌ No data returned from update");
        throw new Error("Update completed but no data was returned");
      }
      
      console.log("✅ Update successful:", updatedData);
      console.log("🔍 Verifying changes:", {
        titleChanged: updatedData.title === postData.title,
        excerptChanged: updatedData.excerpt === postData.excerpt,
        updatedAt: updatedData.updated_at
      });
      
      return updatedData;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast({
        title: "Artikel berhasil diperbarui",
        description: `Artikel "${data.title}" telah berhasil diperbarui`,
      });
      setIsEditing(null);
      setFormData({...defaultBlogPostFormData});
    },
    onError: (error: any) => {
      console.error("Update error:", error);
      toast({
        variant: "destructive",
        title: "Terjadi kesalahan",
        description: error.message || "Gagal memperbarui artikel",
      });
    }
  });

  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast({
        title: "Artikel berhasil dihapus",
        description: "Artikel telah berhasil dihapus",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Terjadi kesalahan",
        description: error.message,
      });
    }
  });

  const publishPostMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .update({
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast({
        title: "Artikel berhasil dipublikasikan",
        description: "Artikel telah berhasil dipublikasikan",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Terjadi kesalahan",
        description: error.message,
      });
    }
  });

  const handleInputChange = (field: keyof BlogPostFormData, value: string) => {
    const updatedData = {
      ...formData,
      [field]: value
    };

    // Auto-generate slug from title
    if (field === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      updatedData.slug = slug;
    }

    // Calculate word count for content changes
    if (field === 'content') {
      updatedData.wordCount = calculateWordCount(value);
    }

    setFormData(updatedData);
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
    
    let finalSlug = formData.slug;
    if (!finalSlug) {
      finalSlug = formData.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
    }
    
    createPostMutation.mutate({
      ...formData,
      slug: finalSlug
    });
  };

  const handleStartEdit = (post: BlogPost) => {
    console.log("Starting edit for post:", post);
    setIsEditing(post.id as string);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      category: post.category,
      author: post.author,
      author_id: post.author_id,
      status: post.status,
      publishedAt: post.publishedAt || null,
      seoTitle: post.seoTitle,
      metaDescription: post.metaDescription,
      focusKeyword: post.focusKeyword,
      wordCount: post.wordCount || calculateWordCount(post.content)
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
    
    let finalSlug = formData.slug;
    if (!finalSlug) {
      finalSlug = formData.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
    }
    
    console.log("Updating post with ID:", isEditing);
    console.log("Current form data title:", formData.title);
    
    updatePostMutation.mutate({
      id: isEditing,
      ...formData,
      slug: finalSlug
    });
  };

  const handleDeleteClick = (id: string) => {
    setPostToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (postToDelete) {
      deletePostMutation.mutate(postToDelete);
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const handlePublishPost = (id: string) => {
    publishPostMutation.mutate(id);
  };

  const handleImageUploadComplete = (url: string) => {
    setFormData({...formData, coverImage: url});
  };

  const handleAIArticleGenerated = (articleData: Partial<BlogPostFormData>) => {
    const wordCount = articleData.content ? calculateWordCount(articleData.content) : 0;
    setFormData({
      ...formData,
      ...articleData,
      category: articleData.category || formData.category || (categories.length > 0 ? categories[0] : ''),
      wordCount: wordCount
    });
    
    // Show cover image selector after AI generation
    setShowCoverImageSelector(true);
    toast({
      title: "Artikel berhasil di-generate",
      description: "Silahkan pilih gambar cover untuk artikel Anda."
    });
  };

  const handleCoverImageSelect = (imageUrl: string, altText: string) => {
    setFormData(prev => ({
      ...prev,
      coverImage: imageUrl
    }));
    toast({
      title: "Gambar cover dipilih",
      description: "Gambar cover berhasil ditambahkan ke artikel."
    });
  };

  const handlePreviewPost = (post: BlogPost) => {
    setPreviewPost(post);
    setPreviewDialogOpen(true);
  };

  const handleViewPost = (post: BlogPost) => {
    if (post.status === 'published') {
      window.open(`/blog/${post.slug}`, '_blank');
    } else {
      handlePreviewPost(post);
    }
  };

  const renderBlogForm = (action: 'create' | 'edit') => {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold">
            {action === 'create' ? 'Buat Artikel Baru' : 'Edit Artikel'}
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button 
              variant="outline" 
              onClick={() => action === 'create' ? setIsCreating(false) : setIsEditing(null)}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Batal
            </Button>
            <Button 
              onClick={action === 'create' ? handleCreatePost : handleUpdatePost}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              {action === 'create' ? 'Simpan Artikel' : 'Perbarui Artikel'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="content">
          <TabsList>
            <TabsTrigger value="ai-generator">AI Generator</TabsTrigger>
            <TabsTrigger value="content">Konten</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="settings">Pengaturan</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ai-generator">
            <AIArticleGenerator 
              onArticleGenerated={handleAIArticleGenerated}
              currentFormData={formData}
            />
          </TabsContent>
          
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Konten Artikel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
                
                 <div className="space-y-4">
                   <Label>Cover Image</Label>
                   
                   {/* Simplified single upload interface */}
                   <div className="space-y-3">
                     <div className="flex gap-2">
                       <FileUpload
                         onUploadComplete={handleImageUploadComplete}
                         currentImage={formData.coverImage}
                       />
                       <Button 
                         type="button"
                         variant="outline"
                         onClick={() => setShowCoverImageSelector(true)}
                         className="px-4"
                       >
                         <ImageIcon className="h-4 w-4 mr-2" />
                         Browse Unsplash
                       </Button>
                     </div>
                     
                     {formData.coverImage && (
                       <div className="relative w-full max-w-md">
                         <img 
                           src={formData.coverImage} 
                           alt="Cover preview" 
                           className="w-full h-auto rounded-md border object-cover aspect-[16/9]" 
                         />
                         <Button
                           type="button"
                           variant="outline"
                           size="sm"
                           onClick={() => setShowCoverImageSelector(true)}
                           className="absolute top-2 right-2"
                         >
                           Change
                         </Button>
                       </div>
                     )}
                   </div>
                 </div>
                
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
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="content">Konten</Label>
                    <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-md">
                      Jumlah kata: <span className="font-semibold text-foreground">{formData.wordCount}</span> kata
                    </div>
                  </div>
                  <RichTextEditor 
                    value={formData.content}
                    onChange={(value) => handleInputChange('content', value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
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
          
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-6">
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
                
                <AuthorSelector
                  selectedAuthorId={formData.author_id}
                  onAuthorChange={(authorId) => handleInputChange('author_id', authorId)}
                />
                
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
      <DeleteConfirmation 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />

      <BlogPreviewDialog
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        post={previewPost}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : isCreating ? (
        renderBlogForm('create')
      ) : isEditing !== null ? (
        renderBlogForm('edit')
      ) : (
        <div className="space-y-6">
          <AdminPageHeader 
            title="Manajemen Artikel" 
            description="Kelola semua artikel blog dan konten website"
          >
            <Button onClick={() => setIsCreating(true)} className="gap-2 w-full sm:w-auto">
              <Plus size={16} />
              Tambah Artikel
            </Button>
          </AdminPageHeader>
          
          <div className="space-y-4">
            {blogPosts.length === 0 ? (
                <Card>
                <CardContent className="p-6 sm:p-8 text-center">
                  <p className="text-muted-foreground mb-6">Belum ada artikel. Klik tombol di atas untuk membuat artikel pertama Anda.</p>
                  <Button onClick={() => setIsCreating(true)} className="gap-2 w-full sm:w-auto">
                    <Plus size={16} />
                    Tambah Artikel
                  </Button>
                </CardContent>
              </Card>
            ) : (
              blogPosts.map((post) => (
                <Card key={post.id} className={post.status === 'draft' ? 'border-dashed' : ''}>
                  <CardContent className="p-4 sm:p-6">
                    {/* Mobile Layout */}
                    <div className="sm:hidden">
                      {post.coverImage && (
                        <div className="w-full h-48 rounded-md overflow-hidden mb-4">
                          <img 
                            src={post.coverImage} 
                            alt={post.title} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
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
                        
                        <h3 className="text-lg font-semibold">{post.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                        
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User size={12} />
                            <span>{post.author}</span>
                          </div>
                          {post.slug && (
                            <div className="flex items-center gap-1">
                              <LinkIcon size={12} />
                              <span className="truncate max-w-[150px]">/blog/{post.slug}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Mobile Action Buttons - Horizontal */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 gap-1.5 flex-1 min-w-[80px]" 
                            onClick={() => handleViewPost(post)}
                            title="Lihat"
                          >
                            <Eye size={14} />
                            <span>Lihat</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 gap-1.5 flex-1 min-w-[80px]" 
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
                              className="h-9 gap-1.5 text-green-600 hover:text-green-700 flex-1 min-w-[80px]" 
                              onClick={() => handlePublishPost(post.id as string)}
                              title="Publikasikan"
                            >
                              <ArrowRight size={14} />
                              <span>Publish</span>
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 gap-1.5 text-destructive hover:text-destructive flex-1 min-w-[80px]" 
                            onClick={() => handleDeleteClick(post.id as string)}
                            title="Hapus"
                          >
                            <Trash size={14} />
                            <span>Hapus</span>
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex gap-6">
                      {post.coverImage && (
                        <div className="w-32 h-32 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={post.coverImage} 
                            alt={post.title} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      )}
                      
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
                      
                      <div className="flex flex-col gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 gap-1 min-w-20" 
                          onClick={() => handleViewPost(post)}
                          title="Lihat"
                        >
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
                            onClick={() => handlePublishPost(post.id as string)}
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
                          onClick={() => handleDeleteClick(post.id as string)}
                          title="Hapus"
                        >
                          <Trash size={14} />
                          <span>Hapus</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      <CoverImageSelector
        isOpen={showCoverImageSelector}
        onClose={() => setShowCoverImageSelector(false)}
        onSelect={handleCoverImageSelect}
        initialKeyword={formData.focusKeyword || formData.title}
      />
    </AdminLayout>
  );
};

export default BlogManagement;
