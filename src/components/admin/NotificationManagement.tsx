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
import { Bell, Code, Eye, Settings, Trash2, Plus, Sparkles, X, Edit } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { NotificationWidget } from '@/components/ui/notification-widget';
import { NotificationDialog } from './NotificationDialog';
import { ArticleNotification } from '@/types/NotificationTypes';

interface NotificationManagementProps {
  onAddNotification?: () => void;
}

export const NotificationManagement: React.FC<NotificationManagementProps> = ({ onAddNotification }) => {
  const { toast } = useToast();
  const { checkSessionExpiry } = useAdminAuth();
  const { notifications, refetch } = useNotifications({ limit: 50 });
  const [previewConfig, setPreviewConfig] = useState({
    position: 'top-right' as const,
    theme: 'auto' as const,
    limit: 5,
    autoHide: false,
    realtime: true,
    blogBaseUrl: 'https://rapatin.id'
  });

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<ArticleNotification | null>(null);

  const handleOpenDialog = (notification?: ArticleNotification) => {
    setEditingNotification(notification || null);
    setDialogOpen(true);
  };

  // Effect to open dialog when triggered from parent
  React.useEffect(() => {
    if (onAddNotification) {
      const openDialog = () => handleOpenDialog();
      // Listen for custom event or use a different mechanism
      // For now, we'll just expose the function globally
      (window as any).openNotificationDialog = openDialog;
    }
  }, [onAddNotification]);

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingNotification(null);
  };

  const handleSaveNotification = () => {
    refetch();
  };

  const handleGenerateSampleNotifications = async () => {
    try {
      // Get latest published articles
      const { data: articles, error: articlesError } = await supabase
        .from('blog_posts')
        .select('id, title, excerpt, cover_image, category')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(3);

      if (articlesError) throw articlesError;

      if (articles && articles.length > 0) {
        // Create sample notifications
        const sampleNotifications = articles.map((article, index) => ({
          blog_post_id: article.id,
          title: article.title,
          excerpt: article.excerpt,
          image_url: article.cover_image,
          category: article.category,
          read: false,
          created_at: new Date(Date.now() - (index + 1) * 2 * 60 * 60 * 1000).toISOString() // Stagger by 2 hours each
        }));

        // Check if notifications already exist to avoid duplicates
        const { data: existingNotifications } = await supabase
          .from('article_notifications')
          .select('blog_post_id')
          .in('blog_post_id', articles.map(a => a.id));

        const existingIds = existingNotifications?.map(n => n.blog_post_id) || [];
        const newNotifications = sampleNotifications.filter(n => !existingIds.includes(n.blog_post_id));

        if (newNotifications.length > 0) {
          const { error: insertError } = await supabase
            .from('article_notifications')
            .insert(newNotifications);

          if (insertError) throw insertError;

          toast({
            title: "Sample Notifications Created",
            description: `Generated ${newNotifications.length} sample notifications successfully.`,
          });
        } else {
          toast({
            title: "No New Notifications",
            description: "Sample notifications for these articles already exist.",
          });
        }

        refetch();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate sample notifications.",
        variant: "destructive",
      });
    }
  };

  const handleClearAllNotifications = async () => {
    try {
      const { error } = await supabase
        .from('article_notifications')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) throw error;

      toast({
        title: "Notifications Cleared",
        description: "All notifications have been deleted successfully.",
      });

      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear notifications.",
        variant: "destructive",
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
  data-realtime="${previewConfig.realtime}"
  data-blog-base-url="${previewConfig.blogBaseUrl}"
></script>`;

  const jsApiCode = `// JavaScript API Usage
window.BlogNotificationWidget.init({
  limit: ${previewConfig.limit},
  position: '${previewConfig.position}',
  theme: '${previewConfig.theme}',
  autoHide: ${previewConfig.autoHide},
  realtime: ${previewConfig.realtime},
  blogBaseUrl: '${previewConfig.blogBaseUrl}',
  categories: 'teknologi,bisnis' // Optional category filter
});`;

  return (
    <div className="space-y-6">
      <NotificationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        notification={editingNotification}
        onSave={handleSaveNotification}
      />

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
              {notifications.length === 0 ? (
                <div className="text-center p-8">
                  <Bell className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Belum Ada Notifikasi</h3>
                  <p className="text-muted-foreground mb-4">
                    Klik tombol "Generate Sample" untuk membuat notifikasi contoh berdasarkan artikel terbaru
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4 p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Total {notifications.length} notifikasi
                      </span>
                    </div>
                    <Badge variant="secondary">
                      {notifications.filter(n => !n.read).length} belum dibaca
                    </Badge>
                  </div>
                  
                   <div className="space-y-4">
                     {notifications.map((notification) => (
                       <div key={notification.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                         <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2 mb-1">
                             <h3 className="font-medium truncate">{notification.title}</h3>
                             <Badge variant={notification.notification_type === 'custom' ? 'secondary' : 'default'}>
                               {notification.notification_type === 'custom' ? 'Kustom' : 'Artikel'}
                             </Badge>
                             {notification.category && (
                               <Badge variant="outline">{notification.category}</Badge>
                             )}
                             {!notification.read && (
                               <Badge variant="destructive" className="text-xs">Baru</Badge>
                             )}
                           </div>
                           {notification.excerpt && (
                             <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{notification.excerpt}</p>
                           )}
                           <p className="text-xs text-muted-foreground">
                             {new Date(notification.created_at).toLocaleString('id-ID')}
                           </p>
                         </div>
                         <div className="flex items-center gap-2 flex-shrink-0">
                           {notification.notification_type === 'custom' && (
                             <Button
                               variant="ghost"
                               size="sm"
                               onClick={() => handleOpenDialog(notification)}
                               className="text-muted-foreground hover:text-foreground"
                             >
                               <Edit className="w-4 h-4" />
                             </Button>
                           )}
                           <Button
                             variant="ghost"
                             size="sm"
                             onClick={() => handleDeleteNotification(notification.id)}
                             className="text-destructive hover:text-destructive"
                           >
                             <Trash2 className="w-4 h-4" />
                           </Button>
                         </div>
                       </div>
                     ))}
                   </div>
                </>
              )}
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

                <div className="space-y-2">
                  <Label htmlFor="blogBaseUrl">Blog Base URL</Label>
                  <Input
                    id="blogBaseUrl"
                    type="url"
                    value={previewConfig.blogBaseUrl}
                    onChange={(e) => setPreviewConfig(prev => ({ ...prev, blogBaseUrl: e.target.value }))}
                    placeholder="https://rapatin.id"
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

                <div className="flex items-center space-x-2">
                  <Switch
                    id="realtime"
                    checked={previewConfig.realtime}
                    onCheckedChange={(checked) => setPreviewConfig(prev => ({ ...prev, realtime: checked }))}
                  />
                  <Label htmlFor="realtime">Real-time Updates</Label>
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

      </Tabs>
    </div>
  );
};