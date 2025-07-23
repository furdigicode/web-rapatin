import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Code, Eye, Settings, Trash2, Plus } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { NotificationWidget } from '@/components/ui/notification-widget';

export const NotificationManagement = () => {
  const { toast } = useToast();
  const { notifications, refetch } = useNotifications({ limit: 50 });
  const [previewConfig, setPreviewConfig] = useState({
    position: 'top-right' as const,
    theme: 'auto' as const,
    limit: 5,
    autoHide: false
  });

  // Custom notification form
  const [customNotification, setCustomNotification] = useState({
    title: '',
    excerpt: '',
    category: '',
    image_url: ''
  });

  const handleCreateCustomNotification = async () => {
    try {
      const { error } = await supabase
        .from('article_notifications')
        .insert({
          blog_post_id: null, // Custom notifications don't need blog post reference
          title: customNotification.title,
          excerpt: customNotification.excerpt,
          category: customNotification.category,
          image_url: customNotification.image_url || null,
          notification_type: 'custom'
        });

      if (error) throw error;

      toast({
        title: 'Berhasil',
        description: 'Notifikasi kustom berhasil dibuat'
      });

      setCustomNotification({ title: '', excerpt: '', category: '', image_url: '' });
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal membuat notifikasi kustom',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('article_notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Berhasil',
        description: 'Notifikasi berhasil dihapus'
      });

      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal menghapus notifikasi',
        variant: 'destructive'
      });
    }
  };

  const embedCode = `<!-- Embed Blog Notification Widget -->
<script 
  src="${window.location.origin}/notification-widget.js"
  data-blog-notifications="true"
  data-limit="${previewConfig.limit}"
  data-position="${previewConfig.position}"
  data-theme="${previewConfig.theme}"
  data-auto-hide="${previewConfig.autoHide}"
></script>`;

  const jsApiCode = `// JavaScript API Usage
window.BlogNotificationWidget.init({
  limit: ${previewConfig.limit},
  position: '${previewConfig.position}',
  theme: '${previewConfig.theme}',
  autoHide: ${previewConfig.autoHide},
  categories: 'teknologi,bisnis' // Optional category filter
});`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Notifikasi</h1>
        <p className="text-muted-foreground">
          Kelola notifikasi artikel dan konfigurasi widget embed
        </p>
      </div>

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifikasi
          </TabsTrigger>
          <TabsTrigger value="embed">
            <Code className="w-4 h-4 mr-2" />
            Widget Embed
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="custom">
            <Plus className="w-4 h-4 mr-2" />
            Notifikasi Kustom
          </TabsTrigger>
        </TabsList>

        {/* Notifications List */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Notifikasi</CardTitle>
              <CardDescription>
                Semua notifikasi yang telah dibuat secara otomatis dan manual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{notification.title}</h3>
                        <Badge variant={notification.notification_type === 'custom' ? 'secondary' : 'default'}>
                          {notification.notification_type === 'custom' ? 'Kustom' : 'Artikel'}
                        </Badge>
                        {notification.category && (
                          <Badge variant="outline">{notification.category}</Badge>
                        )}
                      </div>
                      {notification.excerpt && (
                        <p className="text-sm text-muted-foreground mt-1">{notification.excerpt}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notification.created_at).toLocaleString('id-ID')}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Embed Configuration */}
        <TabsContent value="embed" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Konfigurasi Widget</CardTitle>
                <CardDescription>
                  Sesuaikan pengaturan widget notifikasi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Posisi Widget</Label>
                  <Select
                    value={previewConfig.position}
                    onValueChange={(value: any) => setPreviewConfig(prev => ({ ...prev, position: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top-right">Kanan Atas</SelectItem>
                      <SelectItem value="top-left">Kiri Atas</SelectItem>
                      <SelectItem value="bottom-right">Kanan Bawah</SelectItem>
                      <SelectItem value="bottom-left">Kiri Bawah</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Tema</Label>
                  <Select
                    value={previewConfig.theme}
                    onValueChange={(value: any) => setPreviewConfig(prev => ({ ...prev, theme: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Otomatis</SelectItem>
                      <SelectItem value="light">Terang</SelectItem>
                      <SelectItem value="dark">Gelap</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="limit">Batas Notifikasi</Label>
                  <Input
                    id="limit"
                    type="number"
                    value={previewConfig.limit}
                    onChange={(e) => setPreviewConfig(prev => ({ ...prev, limit: parseInt(e.target.value) || 5 }))}
                    min={1}
                    max={20}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoHide"
                    checked={previewConfig.autoHide}
                    onCheckedChange={(checked) => setPreviewConfig(prev => ({ ...prev, autoHide: checked }))}
                  />
                  <Label htmlFor="autoHide">Auto Hide Widget</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kode Embed</CardTitle>
                <CardDescription>
                  Salin kode ini ke website yang ingin menampilkan notifikasi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>HTML Script Tag</Label>
                  <Textarea
                    className="mt-2 font-mono text-sm"
                    value={embedCode}
                    readOnly
                    rows={8}
                  />
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      navigator.clipboard.writeText(embedCode);
                      toast({ title: 'Berhasil', description: 'Kode berhasil disalin' });
                    }}
                  >
                    Salin Kode
                  </Button>
                </div>

                <div>
                  <Label>JavaScript API</Label>
                  <Textarea
                    className="mt-2 font-mono text-sm"
                    value={jsApiCode}
                    readOnly
                    rows={8}
                  />
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      navigator.clipboard.writeText(jsApiCode);
                      toast({ title: 'Berhasil', description: 'Kode berhasil disalin' });
                    }}
                  >
                    Salin Kode
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Preview */}
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Preview Widget</CardTitle>
              <CardDescription>
                Lihat bagaimana widget akan tampil dengan konfigurasi saat ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative border rounded-lg p-8 min-h-[400px] bg-muted/10">
                <p className="text-center text-muted-foreground mb-4">
                  Widget notifikasi akan muncul di posisi yang dipilih
                </p>
                <NotificationWidget {...previewConfig} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Notifications */}
        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Buat Notifikasi Kustom</CardTitle>
              <CardDescription>
                Buat notifikasi manual yang tidak terkait dengan artikel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-title">Judul</Label>
                <Input
                  id="custom-title"
                  value={customNotification.title}
                  onChange={(e) => setCustomNotification(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Masukkan judul notifikasi"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-excerpt">Deskripsi</Label>
                <Textarea
                  id="custom-excerpt"
                  value={customNotification.excerpt}
                  onChange={(e) => setCustomNotification(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Masukkan deskripsi notifikasi"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-category">Kategori</Label>
                <Input
                  id="custom-category"
                  value={customNotification.category}
                  onChange={(e) => setCustomNotification(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Masukkan kategori"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-image">URL Gambar (Opsional)</Label>
                <Input
                  id="custom-image"
                  value={customNotification.image_url}
                  onChange={(e) => setCustomNotification(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <Button 
                onClick={handleCreateCustomNotification}
                disabled={!customNotification.title}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Buat Notifikasi
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};