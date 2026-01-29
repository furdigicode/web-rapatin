import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  Users, 
  Key, 
  Video, 
  Copy, 
  ExternalLink,
  CheckCircle2,
  XCircle,
  CreditCard,
  Pencil,
  Save,
  Plus,
  Loader2,
  AlertTriangle,
  X
} from 'lucide-react';
import { GuestOrder } from '@/types/OrderTypes';
import { formatRupiah } from '@/utils/formatRupiah';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Format payment method dari SNAKE_CASE ke Title Case
const formatPaymentMethod = (method: string): string => {
  return method
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

interface OrderDetailDialogProps {
  order: GuestOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}

const OrderDetailDialog: React.FC<OrderDetailDialogProps> = ({ 
  order, 
  open, 
  onOpenChange,
  onUpdate
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [zoomData, setZoomData] = useState({
    meeting_id: '',
    zoom_passcode: '',
    zoom_link: ''
  });

  // Reset state when order changes or dialog opens
  useEffect(() => {
    if (order) {
      setZoomData({
        meeting_id: order.meeting_id || '',
        zoom_passcode: order.zoom_passcode || '',
        zoom_link: order.zoom_link || ''
      });
      setIsEditing(false);
    }
  }, [order, open]);

  if (!order) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500 hover:bg-green-600">Lunas</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Menunggu</Badge>;
      case 'expired':
        return <Badge variant="destructive">Kadaluarsa</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Tersalin!",
      description: `${label} berhasil disalin ke clipboard`,
    });
  };

  const formatDateTime = (dateStr: string) => {
    return format(new Date(dateStr), "EEEE, d MMMM yyyy 'pukul' HH:mm", { locale: id });
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "EEEE, d MMMM yyyy", { locale: id });
  };

  const handleSaveZoomDetails = async () => {
    // Basic URL validation if zoom_link is provided
    if (zoomData.zoom_link && !zoomData.zoom_link.startsWith('http')) {
      toast({
        title: "Link tidak valid",
        description: "Link Zoom harus dimulai dengan http:// atau https://",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from('guest_orders')
      .update({
        meeting_id: zoomData.meeting_id || null,
        zoom_passcode: zoomData.zoom_passcode || null,
        zoom_link: zoomData.zoom_link || null
      })
      .eq('id', order.id);

    if (error) {
      toast({
        title: "Gagal menyimpan",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Berhasil disimpan",
        description: "Detail Zoom meeting telah diperbarui"
      });
      setIsEditing(false);
      onUpdate?.();
    }
    setSaving(false);
  };

  const handleCancelEdit = () => {
    setZoomData({
      meeting_id: order.meeting_id || '',
      zoom_passcode: order.zoom_passcode || '',
      zoom_link: order.zoom_link || ''
    });
    setIsEditing(false);
  };

  // Cek dari order prop ATAU zoomData state (untuk immediate feedback setelah save)
  const hasZoomData = 
    order.zoom_link || order.meeting_id || order.zoom_passcode ||
    zoomData.zoom_link || zoomData.meeting_id || zoomData.zoom_passcode;

  const MeetingToggle = ({ enabled, label }: { enabled: boolean | null; label: string }) => (
    <div className="flex items-center gap-2">
      {enabled ? (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      ) : (
        <XCircle className="h-4 w-4 text-muted-foreground" />
      )}
      <span className={enabled ? "text-foreground" : "text-muted-foreground"}>{label}</span>
    </div>
  );


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detail Order</span>
            {getStatusBadge(order.payment_status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informasi Pelanggan */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Informasi Pelanggan
            </h3>
            <div className="grid gap-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{order.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{order.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{order.whatsapp}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Detail Meeting */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Detail Meeting
            </h3>
            <div className="grid gap-3">
              {order.meeting_topic && (
                <div className="flex items-start gap-3">
                  <Video className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="font-medium">{order.meeting_topic}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(order.meeting_date)}</span>
              </div>
              {order.meeting_time && (
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{order.meeting_time} WIB</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{order.participant_count} peserta</span>
              </div>
              {order.custom_passcode && (
                <div className="flex items-center gap-3">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <span>Passcode: {order.custom_passcode}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Pengaturan Meeting */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Pengaturan Meeting
            </h3>
            <div className="grid gap-2">
              <MeetingToggle enabled={order.is_meeting_registration} label="Registrasi Peserta" />
              <MeetingToggle enabled={order.is_meeting_qna} label="Fitur Q&A" />
              <MeetingToggle enabled={order.is_language_interpretation} label="Interpretasi Bahasa" />
              <MeetingToggle enabled={order.is_mute_upon_entry} label="Mute Saat Masuk" />
              <MeetingToggle enabled={order.is_req_unmute_permission} label="Minta Izin Unmute" />
            </div>
          </div>

          {/* Info Zoom Section - inline to prevent focus loss */}
          {order.payment_status === 'paid' && (
            <>
              <Separator />
              <div className="space-y-3">
                {isEditing ? (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        Info Zoom
                      </h3>
                    </div>
                    <div className="grid gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="meeting_id">Meeting ID</Label>
                        <Input
                          id="meeting_id"
                          placeholder="Contoh: 123 456 7890"
                          value={zoomData.meeting_id}
                          onChange={(e) => setZoomData({ ...zoomData, meeting_id: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zoom_passcode">Passcode</Label>
                        <Input
                          id="zoom_passcode"
                          placeholder="Contoh: abc123"
                          value={zoomData.zoom_passcode}
                          onChange={(e) => setZoomData({ ...zoomData, zoom_passcode: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zoom_link">Link Zoom</Label>
                        <Input
                          id="zoom_link"
                          placeholder="https://zoom.us/j/..."
                          value={zoomData.zoom_link}
                          onChange={(e) => setZoomData({ ...zoomData, zoom_link: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-2 justify-end pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelEdit}
                          disabled={saving}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Batal
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSaveZoomDetails}
                          disabled={saving}
                        >
                          {saving ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                          Simpan
                        </Button>
                      </div>
                    </div>
                  </>
                ) : !hasZoomData ? (
                  <>
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Info Zoom
                    </h3>
                    <div className="flex flex-col items-center justify-center gap-3 p-6 bg-muted/50 rounded-lg text-center">
                      <AlertTriangle className="h-8 w-8 text-orange-500" />
                      <div>
                        <p className="font-medium">Zoom meeting belum tersedia</p>
                        <p className="text-sm text-muted-foreground">
                          Klik tombol di bawah untuk menambahkan detail secara manual
                        </p>
                      </div>
                      <Button onClick={() => setIsEditing(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Detail Zoom
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        Info Zoom
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                    <div className="grid gap-3 p-4 bg-muted/50 rounded-lg">
                      {zoomData.meeting_id && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Meeting ID</span>
                          <div className="flex items-center gap-2">
                            <code className="bg-background px-2 py-1 rounded text-sm">
                              {zoomData.meeting_id}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => copyToClipboard(zoomData.meeting_id, 'Meeting ID')}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                      {zoomData.zoom_passcode && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Passcode</span>
                          <div className="flex items-center gap-2">
                            <code className="bg-background px-2 py-1 rounded text-sm">
                              {zoomData.zoom_passcode}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => copyToClipboard(zoomData.zoom_passcode, 'Passcode')}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                      {zoomData.zoom_link && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Link</span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(zoomData.zoom_link, 'Link Zoom')}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Salin Link
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <a href={zoomData.zoom_link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Buka
                              </a>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          <Separator />

          {/* Pembayaran */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Pembayaran
            </h3>
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Harga</span>
                <span className="font-semibold text-lg">{formatRupiah(order.price)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                {getStatusBadge(order.payment_status)}
              </div>
              {order.payment_method && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Metode</span>
                  <span>{formatPaymentMethod(order.payment_method)}</span>
                </div>
              )}
              {order.paid_at && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Dibayar</span>
                  <span>{formatDateTime(order.paid_at)}</span>
                </div>
              )}
              {order.xendit_invoice_url && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Invoice</span>
                  <Button variant="outline" size="sm" asChild>
                    <a href={order.xendit_invoice_url} target="_blank" rel="noopener noreferrer">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Lihat Invoice
                    </a>
                  </Button>
                </div>
              )}
              
              {/* Integrasi Xendit */}
              {(order.xendit_reference_id || order.xendit_invoice_id) && (
                <>
                  <Separator className="my-2" />
                  <div className="text-xs text-muted-foreground mt-2 mb-1">Integrasi Xendit</div>
                  
                  {order.xendit_reference_id && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Reference ID</span>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {order.xendit_reference_id}
                        </code>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(order.xendit_reference_id!, 'Reference ID')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {order.xendit_invoice_id && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Session ID</span>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded truncate max-w-[150px]" title={order.xendit_invoice_id}>
                          {order.xendit_invoice_id}
                        </code>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(order.xendit_invoice_id!, 'Session ID')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* Timeline */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Timeline
            </h3>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dibuat</span>
                <span>{formatDateTime(order.created_at)}</span>
              </div>
              {order.paid_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dibayar</span>
                  <span>{formatDateTime(order.paid_at)}</span>
                </div>
              )}
              {order.expired_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kadaluarsa</span>
                  <span>{formatDateTime(order.expired_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
