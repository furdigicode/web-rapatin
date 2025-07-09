import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, User, Mail, Globe, Twitter, Linkedin, Instagram } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Author, AuthorFormData, defaultAuthorFormData } from '@/types/AuthorTypes';
import AdminPageHeader from './AdminPageHeader';

const AuthorManagement: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<string | null>(null);
  const [formData, setFormData] = useState<AuthorFormData>(defaultAuthorFormData);

  const { data: authors = [], isLoading } = useQuery({
    queryKey: ['authors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Author[];
    }
  });

  const createAuthorMutation = useMutation({
    mutationFn: async (authorData: AuthorFormData) => {
      const { data, error } = await supabase
        .from('authors')
        .insert({
          name: authorData.name,
          slug: authorData.slug,
          email: authorData.email || null,
          bio: authorData.bio || null,
          avatar_url: authorData.avatar_url || null,
          social_links: authorData.social_links,
          specialization: authorData.specialization || null,
          is_active: authorData.is_active
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      toast({
        title: "Penulis berhasil dibuat",
        description: "Penulis baru telah ditambahkan ke sistem",
      });
      handleCancelForm();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Gagal membuat penulis",
        description: error.message,
      });
    }
  });

  const updateAuthorMutation = useMutation({
    mutationFn: async ({ id, authorData }: { id: string; authorData: AuthorFormData }) => {
      const { data, error } = await supabase
        .from('authors')
        .update({
          name: authorData.name,
          slug: authorData.slug,
          email: authorData.email || null,
          bio: authorData.bio || null,
          avatar_url: authorData.avatar_url || null,
          social_links: authorData.social_links,
          specialization: authorData.specialization || null,
          is_active: authorData.is_active
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      toast({
        title: "Penulis berhasil diupdate",
        description: "Data penulis telah diperbarui",
      });
      handleCancelForm();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Gagal mengupdate penulis",
        description: error.message,
      });
    }
  });

  const deleteAuthorMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('authors')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      toast({
        title: "Penulis berhasil dihapus",
        description: "Data penulis telah dihapus dari sistem",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Gagal menghapus penulis",
        description: error.message,
      });
    }
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleInputChange = (field: keyof AuthorFormData, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug from name
      if (field === 'name' && value) {
        updated.slug = generateSlug(value);
      }
      
      return updated;
    });
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value
      }
    }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Nama penulis harus diisi",
      });
      return;
    }

    if (editingAuthor) {
      updateAuthorMutation.mutate({ id: editingAuthor, authorData: formData });
    } else {
      createAuthorMutation.mutate(formData);
    }
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author.id);
    setFormData({
      name: author.name,
      slug: author.slug,
      email: author.email || '',
      bio: author.bio || '',
      avatar_url: author.avatar_url || '',
      social_links: {
        twitter: author.social_links?.twitter || '',
        linkedin: author.social_links?.linkedin || '',
        instagram: author.social_links?.instagram || '',
        website: author.social_links?.website || ''
      },
      specialization: author.specialization || '',
      is_active: author.is_active
    });
    setIsFormOpen(true);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingAuthor(null);
    setFormData(defaultAuthorFormData);
  };

  const getAuthorInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader 
        title="Kelola Penulis" 
        description="Kelola data penulis artikel dan informasi profil"
      >
        <Button onClick={() => setIsFormOpen(true)} className="gap-2 w-full sm:w-auto">
          <Plus size={16} />
          Tambah Penulis
        </Button>
      </AdminPageHeader>

      {/* Author Form Modal */}
      {isFormOpen && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingAuthor ? 'Edit Penulis' : 'Tambah Penulis Baru'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="john-doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Spesialisasi</Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => handleInputChange('specialization', e.target.value)}
                  placeholder="Technology & Business"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar_url">URL Foto Profil</Label>
              <Input
                id="avatar_url"
                value={formData.avatar_url}
                onChange={(e) => handleInputChange('avatar_url', e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio/Deskripsi</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tulis bio singkat tentang penulis..."
                rows={3}
              />
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Social Media Links</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="twitter" className="flex items-center gap-2">
                    <Twitter size={16} />
                    Twitter
                  </Label>
                  <Input
                    id="twitter"
                    value={formData.social_links.twitter}
                    onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                    placeholder="https://twitter.com/username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="flex items-center gap-2">
                    <Linkedin size={16} />
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedin"
                    value={formData.social_links.linkedin}
                    onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram" className="flex items-center gap-2">
                    <Instagram size={16} />
                    Instagram
                  </Label>
                  <Input
                    id="instagram"
                    value={formData.social_links.instagram}
                    onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                    placeholder="https://instagram.com/username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="flex items-center gap-2">
                    <Globe size={16} />
                    Website
                  </Label>
                  <Input
                    id="website"
                    value={formData.social_links.website}
                    onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleInputChange('is_active', checked)}
              />
              <Label htmlFor="is_active">Penulis Aktif</Label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleSubmit}
                disabled={createAuthorMutation.isPending || updateAuthorMutation.isPending}
                className="flex-1"
              >
                {editingAuthor ? 'Update Penulis' : 'Tambah Penulis'}
              </Button>
              <Button variant="outline" onClick={handleCancelForm} className="flex-1">
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Authors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {authors.map((author) => (
          <Card key={author.id} className="relative">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={author.avatar_url} alt={author.name} />
                    <AvatarFallback>
                      {getAuthorInitials(author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{author.name}</h3>
                    <p className="text-sm text-muted-foreground">@{author.slug}</p>
                  </div>
                </div>
                <Badge variant={author.is_active ? "default" : "secondary"}>
                  {author.is_active ? 'Aktif' : 'Non-aktif'}
                </Badge>
              </div>
              
              {author.specialization && (
                <p className="text-sm font-medium text-primary mb-2">
                  {author.specialization}
                </p>
              )}
              
              {author.bio && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {author.bio}
                </p>
              )}

              {/* Social Links */}
              {(author.social_links?.twitter || author.social_links?.linkedin || author.social_links?.instagram || author.social_links?.website) && (
                <div className="flex gap-2 mb-4">
                  {author.social_links?.twitter && (
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Twitter size={14} />
                    </Button>
                  )}
                  {author.social_links?.linkedin && (
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Linkedin size={14} />
                    </Button>
                  )}
                  {author.social_links?.instagram && (
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Instagram size={14} />
                    </Button>
                  )}
                  {author.social_links?.website && (
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Globe size={14} />
                    </Button>
                  )}
                </div>
              )}

              <Separator className="mb-4" />

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(author)}
                  className="flex-1 gap-2"
                >
                  <Edit size={14} />
                  Edit
                </Button>
                {author.slug !== 'admin' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Trash2 size={14} />
                        Hapus
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Penulis</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus penulis "{author.name}"? 
                          Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteAuthorMutation.mutate(author.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {authors.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Belum ada penulis</h3>
            <p className="text-muted-foreground mb-4">
              Tambahkan penulis pertama untuk memulai mengelola konten.
            </p>
            <Button onClick={() => setIsFormOpen(true)} className="gap-2">
              <Plus size={16} />
              Tambah Penulis Pertama
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AuthorManagement;