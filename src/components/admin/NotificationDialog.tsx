import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { ArticleNotification } from '@/types/NotificationTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface NotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notification?: ArticleNotification | null;
  onSave: () => void;
  defaultType?: 'custom' | 'popup';
}

export const NotificationDialog: React.FC<NotificationDialogProps> = ({
  open,
  onOpenChange,
  notification,
  onSave,
  defaultType = 'custom'
}) => {
  const { toast } = useToast();
  const { checkSessionExpiry } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    category: '',
    image_url: '',
    target_url: '',
    notification_type: defaultType as 'custom' | 'popup',
    // Popup-specific fields
    button_text: '',
    button_url: '',
    display_frequency: 'once' as 'once' | 'every_visit' | 'every_session',
    show_close_button: true,
    is_active: true,
    priority: 0
  });

  const isEditing = !!notification;
  const isPopup = formData.notification_type === 'popup';

  useEffect(() => {
    if (notification) {
      setFormData({
        title: notification.title || '',
        excerpt: notification.excerpt || '',
        category: notification.category || '',
        image_url: notification.image_url || '',
        target_url: notification.target_url || '',
        notification_type: notification.notification_type as 'custom' | 'popup',
        button_text: notification.button_text || '',
        button_url: notification.button_url || '',
        display_frequency: notification.display_frequency || 'once',
        show_close_button: notification.show_close_button ?? true,
        is_active: notification.is_active ?? true,
        priority: notification.priority || 0
      });
    } else {
      setFormData({
        title: '',
        excerpt: '',
        category: '',
        image_url: '',
        target_url: '',
        notification_type: defaultType,
        button_text: '',
        button_url: '',
        display_frequency: 'once',
        show_close_button: true,
        is_active: true,
        priority: 0
      });
    }
  }, [notification, open, defaultType]);

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

    // Validate URL format if provided
    if (formData.target_url && formData.target_url.trim()) {
      const urlPattern = /^(https?:\/\/|\/)/;
      if (!urlPattern.test(formData.target_url.trim())) {
        toast({
          title: 'Error', 
          description: 'URL tujuan harus dimulai dengan http://, https://, atau /',
          variant: 'destructive',
        });
        return;
      }
    }

    setLoading(true);
    try {
      checkSessionExpiry();

      const payload: Record<string, unknown> = {
        title: formData.title.trim(),
        excerpt: formData.excerpt?.trim() || null,
        category: formData.category?.trim() || null,
        image_url: formData.image_url?.trim() || null,
        target_url: formData.target_url?.trim() || '#',
        notification_type: formData.notification_type
      };

      // Add popup-specific fields
      if (formData.notification_type === 'popup') {
        payload.button_text = formData.button_text?.trim() || null;
        payload.button_url = formData.button_url?.trim() || null;
        payload.display_frequency = formData.display_frequency;
        payload.show_close_button = formData.show_close_button;
        payload.is_active = formData.is_active;
        payload.priority = formData.priority;
      }

      console.log('Saving notification payload:', payload);

      if (isEditing) {
        const { error } = await supabase
          .from('article_notifications')
          .update(payload)
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
        const insertPayload = {
          ...payload,
          blog_post_id: null as string | null
        };
        
        const { error } = await supabase
          .from('article_notifications')
          .insert(insertPayload);

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
          description: isPopup ? 'Popup notifikasi berhasil dibuat' : 'Notifikasi kustom berhasil dibuat'
        });
      }

      onSave();
      onOpenChange(false);
    } catch (error: unknown) {
      console.error('Full error details:', error);
      
      let errorMessage = isEditing ? 'Gagal memperbarui notifikasi' : 'Gagal membuat notifikasi';
      
      const err = error as { code?: string; message?: string };
      if (err?.code === 'PGRST301') {
        errorMessage = "Permission denied. Please check your admin authentication.";
      } else if (err?.message?.includes('RLS')) {
        errorMessage = "Access denied. Please refresh the page and try again.";
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Notifikasi' : (isPopup ? 'Tambah Popup Notifikasi' : 'Tambah Notifikasi Kustom')}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Perbarui informasi notifikasi yang sudah ada'
              : (isPopup 
                  ? 'Buat popup yang akan muncul di tengah halaman website'
                  : 'Buat notifikasi kustom baru yang akan ditampilkan di widget')
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Notification Type Selector */}
          {!isEditing && (
            <div className="space-y-2">
              <Label>Tipe Notifikasi</Label>
              <Tabs 
                value={formData.notification_type} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, notification_type: v as 'custom' | 'popup' }))}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="custom">Widget</TabsTrigger>
                  <TabsTrigger value="popup">Popup</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Judul {isPopup ? 'Popup' : 'Notifikasi'} *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Masukkan judul"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">{isPopup ? 'Konten/Pesan' : 'Deskripsi Singkat'}</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              placeholder={isPopup ? "Masukkan konten popup" : "Masukkan deskripsi singkat (opsional)"}
              rows={isPopup ? 4 : 3}
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

          {/* Popup-specific fields */}
          {isPopup && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="button_text">Teks Tombol CTA</Label>
                  <Input
                    id="button_text"
                    value={formData.button_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
                    placeholder="Pelajari Lebih Lanjut"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="button_url">URL Tombol CTA</Label>
                  <Input
                    id="button_url"
                    value={formData.button_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, button_url: e.target.value }))}
                    placeholder="https://rapatin.id/promo"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_frequency">Frekuensi Tampil</Label>
                <Select 
                  value={formData.display_frequency} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, display_frequency: v as 'once' | 'every_visit' | 'every_session' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">Sekali per User (disimpan di localStorage)</SelectItem>
                    <SelectItem value="every_session">Setiap Session (disimpan di sessionStorage)</SelectItem>
                    <SelectItem value="every_visit">Setiap Kunjungan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Prioritas (semakin tinggi = tampil duluan)</Label>
                <Input
                  id="priority"
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show_close_button">Tampilkan Tombol Tutup</Label>
                  <p className="text-xs text-muted-foreground">User dapat menutup popup dengan tombol X</p>
                </div>
                <Switch
                  id="show_close_button"
                  checked={formData.show_close_button}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, show_close_button: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is_active">Aktifkan Popup</Label>
                  <p className="text-xs text-muted-foreground">Popup akan ditampilkan jika aktif</p>
                </div>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
              </div>
            </>
          )}

          {/* Common fields */}
          {!isPopup && (
            <>
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
                <Label htmlFor="target_url">URL Tujuan</Label>
                <Input
                  id="target_url"
                  type="url"
                  value={formData.target_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_url: e.target.value }))}
                  placeholder="https://rapatin.id/blog (opsional, default: #)"
                />
              </div>
            </>
          )}

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