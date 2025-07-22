import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash, Save, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { DeleteConfirmation } from '@/components/blog/DeleteConfirmation';

interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface CategoryFormData {
  name: string;
  description: string;
}

const defaultCategoryFormData: CategoryFormData = {
  name: '',
  description: ''
};

const CategoryManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState<CategoryFormData>(defaultCategoryFormData);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['blog-categories-full'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching categories",
          description: error.message,
        });
        return [];
      }
      
      return data as Category[];
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData: CategoryFormData) => {
      const { data, error } = await supabase
        .from('blog_categories')
        .insert({
          name: categoryData.name,
          description: categoryData.description || null
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories-full'] });
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      toast({
        title: "Kategori berhasil dibuat",
        description: `Kategori "${formData.name}" telah berhasil dibuat`,
      });
      setIsCreating(false);
      setFormData(defaultCategoryFormData);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Terjadi kesalahan",
        description: error.message,
      });
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async (categoryData: CategoryFormData & { id: string }) => {
      const { data, error } = await supabase
        .from('blog_categories')
        .update({
          name: categoryData.name,
          description: categoryData.description || null
        })
        .eq('id', categoryData.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories-full'] });
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      toast({
        title: "Kategori berhasil diperbarui",
        description: `Kategori "${formData.name}" telah berhasil diperbarui`,
      });
      setEditingId(null);
      setFormData(defaultCategoryFormData);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Terjadi kesalahan",
        description: error.message,
      });
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      // First check if any blog posts are using this category
      const { data: postsUsingCategory, error: checkError } = await supabase
        .from('blog_posts')
        .select('id, title')
        .eq('category', categories.find(c => c.id === id)?.name || '');
      
      if (checkError) throw checkError;
      
      if (postsUsingCategory && postsUsingCategory.length > 0) {
        throw new Error(`Cannot delete category. ${postsUsingCategory.length} blog post(s) are using this category.`);
      }

      const { error } = await supabase
        .from('blog_categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories-full'] });
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      toast({
        title: "Kategori berhasil dihapus",
        description: "Kategori telah berhasil dihapus",
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

  const handleInputChange = (field: keyof CategoryFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCreateCategory = () => {
    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Terjadi kesalahan",
        description: "Nama kategori harus diisi",
      });
      return;
    }
    
    createCategoryMutation.mutate(formData);
  };

  const handleStartEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
  };

  const handleUpdateCategory = () => {
    if (!editingId || !formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Terjadi kesalahan",
        description: "Nama kategori harus diisi",
      });
      return;
    }
    
    updateCategoryMutation.mutate({
      id: editingId,
      ...formData
    });
  };

  const handleDeleteClick = (id: string) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategoryMutation.mutate(categoryToDelete);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(defaultCategoryFormData);
  };

  const cancelCreate = () => {
    setIsCreating(false);
    setFormData(defaultCategoryFormData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kelola Kategori Blog</h2>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
            <Plus size={16} />
            Tambah Kategori
          </Button>
        )}
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Buat Kategori Baru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Kategori</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Masukkan nama kategori"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi (Opsional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Masukkan deskripsi kategori"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateCategory} disabled={createCategoryMutation.isPending}>
                <Save size={16} className="mr-2" />
                Simpan
              </Button>
              <Button variant="outline" onClick={cancelCreate}>
                <X size={16} className="mr-2" />
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="pt-6">
              {editingId === category.id ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${category.id}`}>Nama Kategori</Label>
                    <Input
                      id={`name-${category.id}`}
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Masukkan nama kategori"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`description-${category.id}`}>Deskripsi</Label>
                    <Textarea
                      id={`description-${category.id}`}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Masukkan deskripsi kategori"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleUpdateCategory} disabled={updateCategoryMutation.isPending}>
                      <Save size={16} className="mr-2" />
                      Simpan
                    </Button>
                    <Button variant="outline" onClick={cancelEdit}>
                      <X size={16} className="mr-2" />
                      Batal
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    {category.description && (
                      <p className="text-muted-foreground">{category.description}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Dibuat: {new Date(category.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartEdit(category)}
                    >
                      <Edit size={16} className="mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(category.id)}
                    >
                      <Trash size={16} className="mr-2" />
                      Hapus
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Belum ada kategori blog. Buat kategori pertama Anda!</p>
          </CardContent>
        </Card>
      )}

      <DeleteConfirmation
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Hapus Kategori"
        description="Apakah Anda yakin ingin menghapus kategori ini? Kategori yang sedang digunakan oleh artikel tidak dapat dihapus."
      />
    </div>
  );
};

export default CategoryManagement;