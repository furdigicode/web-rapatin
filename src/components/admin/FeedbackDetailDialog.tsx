import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, ExternalLink, Save, Trash2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { UserFeedback, FeedbackStatus, FeedbackPriority } from '@/types/FeedbackTypes';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

interface FeedbackDetailDialogProps {
  feedback: UserFeedback | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    complaint: 'Komplain',
    feature_request: 'Request Fitur',
    bug_report: 'Laporkan Bug',
    question: 'Pertanyaan',
    general: 'Feedback Umum',
  };
  return labels[type] || type;
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    new: 'Baru',
    in_progress: 'Dalam Progress',
    resolved: 'Terselesaikan',
    closed: 'Ditutup',
  };
  return labels[status] || status;
};

const getPriorityLabel = (priority: string) => {
  const labels: Record<string, string> = {
    low: 'Rendah',
    medium: 'Sedang',
    high: 'Tinggi',
    urgent: 'Mendesak',
  };
  return labels[priority] || priority;
};

export const FeedbackDetailDialog: React.FC<FeedbackDetailDialogProps> = ({
  feedback,
  open,
  onOpenChange,
  onUpdate,
}) => {
  const [status, setStatus] = useState<FeedbackStatus>('new');
  const [priority, setPriority] = useState<FeedbackPriority>('medium');
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (feedback) {
      setStatus(feedback.status);
      setPriority(feedback.priority);
      setAdminNotes(feedback.admin_notes || '');
    }
  }, [feedback]);

  if (!feedback) return null;

  const handleUpdate = async () => {
    setIsUpdating(true);

    try {
      const updates: any = {
        status,
        priority,
        admin_notes: adminNotes || null,
        updated_at: new Date().toISOString(),
      };

      if (status === 'resolved' && feedback.status !== 'resolved') {
        updates.resolved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('user_feedbacks')
        .update(updates)
        .eq('id', feedback.id);

      if (error) throw error;

      toast({
        title: 'Berhasil!',
        description: 'Feedback berhasil diperbarui.',
      });

      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating feedback:', error);
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat memperbarui feedback.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('user_feedbacks')
        .delete()
        .eq('id', feedback.id);

      if (error) throw error;

      toast({
        title: 'Berhasil!',
        description: 'Feedback berhasil dihapus.',
      });

      onUpdate();
      onOpenChange(false);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat menghapus feedback.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Feedback #{feedback.id.slice(0, 8)}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* User Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Informasi Pengirim</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{feedback.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a href={`mailto:${feedback.email}`} className="text-primary hover:underline">
                    {feedback.email}
                  </a>
                </div>
                {feedback.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a href={`tel:${feedback.phone}`} className="text-primary hover:underline">
                      {feedback.phone}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Feedback Content */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Detail Feedback</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline">{getTypeLabel(feedback.type)}</Badge>
                    <Badge>{getStatusLabel(feedback.status)}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Subjek</Label>
                  <p className="font-medium">{feedback.subject}</p>
                </div>
                <Separator />
                <div>
                  <Label className="text-xs text-muted-foreground">Pesan</Label>
                  <p className="whitespace-pre-wrap">{feedback.message}</p>
                </div>
                <Separator />
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>
                      Dikirim: {format(new Date(feedback.created_at), 'dd MMMM yyyy, HH:mm', { locale: localeId })}
                    </span>
                  </div>
                  {feedback.page_url && (
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-3 h-3" />
                      <span className="truncate">Dari: {feedback.page_url}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Admin Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Tindakan Admin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={status} onValueChange={(value) => setStatus(value as FeedbackStatus)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Baru</SelectItem>
                        <SelectItem value="in_progress">Dalam Progress</SelectItem>
                        <SelectItem value="resolved">Terselesaikan</SelectItem>
                        <SelectItem value="closed">Ditutup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Prioritas</Label>
                    <Select value={priority} onValueChange={(value) => setPriority(value as FeedbackPriority)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Rendah</SelectItem>
                        <SelectItem value="medium">Sedang</SelectItem>
                        <SelectItem value="high">Tinggi</SelectItem>
                        <SelectItem value="urgent">Mendesak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Catatan Admin (Internal)</Label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Tambahkan catatan internal untuk tim..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleUpdate} disabled={isUpdating}>
                    <Save className="w-4 h-4 mr-2" />
                    {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    <X className="w-4 h-4 mr-2" />
                    Batal
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                    className="ml-auto"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Feedback?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus feedback ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
