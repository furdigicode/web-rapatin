import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { ArticleNotification } from '@/types/NotificationTypes';

interface NotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notification?: ArticleNotification | null;
  onSave: () => void;
}

export const NotificationDialog: React.FC<NotificationDialogProps> = ({
  open,
  onOpenChange,
  notification,
  onSave
}) => {
  const { toast } = useToast();
  const { checkSessionExpiry } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    category: '',
    image_url: ''
  });

  const isEditing = !!notification;

  useEffect(() => {
    if (notification) {
      setFormData({
        title: notification.title || '',
        excerpt: notification.excerpt || '',
        category: notification.category || '',
        image_url: notification.image_url || ''
      });
    } else {
      setFormData({
        title: '',
        excerpt: '',
        category: '',
        image_url: ''
      });
    }
  }, [notification, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast({
        title: 'Error',
        description: 'Judul notifikasi harus diisi',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      checkSessionExpiry();

      if (isEditing) {
        // Update existing notification
        const { error } = await supabase
          .from('article_notifications')
          .update({
            title: formData.title,
            excerpt: formData.excerpt || null,
            category: formData.category || null,
            image_url: formData.image_url || null
          })
          .eq('id', notification!.id);

        if (error) {
          console.error('Error updating notification:', error);
          
          if (error.message?.includes('new row violates row-level security policy') || 
              error.message?.includes('permission denied')) {
            toast({
              title: "Session Expired",
              description: "Your admin session has expired. Please log in again.",
              variant: "destructive",
            });
            window.location.href = '/admin/login';
            return;
          }
          throw error;
        }

        toast({
          title: 'Berhasil',
          description: 'Notifikasi berhasil diperbarui'
        });
      } else {
        // Create new notification
        const { error } = await supabase
          .from('article_notifications')
          .insert({
            blog_post_id: null,
            title: formData.title,
            excerpt: formData.excerpt || null,
            category: formData.category || null,
            image_url: formData.image_url || null,
            notification_type: 'custom'
          });

        if (error) {
          console.error('Error creating notification:', error);
          
          if (error.message?.includes('new row violates row-level security policy') || 
              error.message?.includes('permission denied')) {
            toast({
              title: "Session Expired",
              description: "Your admin session has expired. Please log in again.",
              variant: "destructive",
            });
            window.location.href = '/admin/login';
            return;
          }
          throw error;
        }

        toast({
          title: 'Berhasil',
          description: 'Notifikasi kustom berhasil dibuat'
        });
      }

      onSave();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: isEditing ? 'Gagal memperbarui notifikasi' : 'Gagal membuat notifikasi kustom',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Notifikasi' : 'Tambah Notifikasi Kustom'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Perbarui informasi notifikasi yang sudah ada'
              : 'Buat notifikasi kustom baru yang akan ditampilkan di widget'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Notifikasi *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Masukkan judul notifikasi"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Deskripsi Singkat</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Masukkan deskripsi singkat (opsional)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="Masukkan kategori (opsional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">URL Gambar</Label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              placeholder="https://example.com/image.jpg (opsional)"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : (isEditing ? 'Perbarui' : 'Simpan')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};