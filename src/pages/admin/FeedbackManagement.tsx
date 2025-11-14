import React, { useState, useEffect } from 'react';
import { MessageSquare, AlertCircle, Clock, CheckCircle, Search, Eye, Download, Paperclip } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FeedbackDetailDialog } from '@/components/admin/FeedbackDetailDialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { UserFeedback, FeedbackStats } from '@/types/FeedbackTypes';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState<UserFeedback[]>([]);
  const [stats, setStats] = useState<FeedbackStats>({
    total: 0,
    new: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0,
  });
  const [selectedFeedback, setSelectedFeedback] = useState<UserFeedback | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const { toast } = useToast();

  const fetchFeedbacks = async () => {
    try {
      // @ts-ignore - user_feedbacks table types not yet generated
      let query = supabase
        // @ts-ignore
        .from('user_feedbacks')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (typeFilter !== 'all') {
        // @ts-ignore
        query = query.eq('type', typeFilter);
      }
      if (statusFilter !== 'all') {
        // @ts-ignore
        query = query.eq('status', statusFilter);
      }
      if (priorityFilter !== 'all') {
        // @ts-ignore
        query = query.eq('priority', priorityFilter);
      }

      const { data, error} = await query;

      if (error) throw error;

      // Apply search filter client-side
      // @ts-ignore - user_feedbacks table types not yet generated
      let filtered = (data || []) as UserFeedback[];
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (f) =>
            f.name.toLowerCase().includes(query) ||
            f.email.toLowerCase().includes(query) ||
            f.subject.toLowerCase().includes(query) ||
            f.message.toLowerCase().includes(query)
        );
      }

      setFeedbacks(filtered);

      // Calculate stats
      const newStats: FeedbackStats = {
        total: filtered.length,
        new: filtered.filter((f) => f.status === 'new').length,
        in_progress: filtered.filter((f) => f.status === 'in_progress').length,
        resolved: filtered.filter((f) => f.status === 'resolved').length,
        closed: filtered.filter((f) => f.status === 'closed').length,
      };
      setStats(newStats);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat feedback',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [typeFilter, statusFilter, priorityFilter, searchQuery]);

  const getTypeBadgeVariant = (type: string) => {
    const variants: Record<string, any> = {
      complaint: 'destructive',
      feature_request: 'default',
      bug_report: 'secondary',
      question: 'outline',
      general: 'outline',
    };
    return variants[type] || 'outline';
  };

  const getStatusBadgeVariant = (status: string) => {
    const variants: Record<string, any> = {
      new: 'destructive',
      in_progress: 'secondary',
      resolved: 'default',
      closed: 'outline',
    };
    return variants[status] || 'outline';
  };

  const getPriorityBadgeVariant = (priority: string) => {
    const variants: Record<string, any> = {
      urgent: 'destructive',
      high: 'secondary',
      medium: 'outline',
      low: 'outline',
    };
    return variants[priority] || 'outline';
  };

  const exportToCSV = () => {
    const headers = ['Tanggal', 'Nama', 'Email', 'Tipe', 'Subjek', 'Status', 'Priority', 'Pesan'];
    const rows = feedbacks.map((f) => [
      format(new Date(f.created_at), 'dd/MM/yyyy HH:mm'),
      f.name,
      f.email,
      f.type,
      f.subject,
      f.status,
      f.priority,
      f.message.replace(/"/g, '""'), // Escape quotes
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `feedback-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();

    toast({
      title: 'Berhasil!',
      description: 'Data feedback berhasil diekspor.',
    });
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      complaint: 'Komplain',
      feature_request: 'Request Fitur',
      bug_report: 'Bug Report',
      question: 'Pertanyaan',
      general: 'Umum',
    };
    return labels[type] || type;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      new: 'Baru',
      in_progress: 'Progress',
      resolved: 'Selesai',
      closed: 'Ditutup',
    };
    return labels[status] || status;
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      urgent: 'Mendesak',
      high: 'Tinggi',
      medium: 'Sedang',
      low: 'Rendah',
    };
    return labels[priority] || priority;
  };

  return (
    <AdminLayout title="Manajemen Feedback">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Baru</CardTitle>
                <AlertCircle className="w-4 h-4 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.new}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Progress</CardTitle>
                <Clock className="w-4 h-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.in_progress}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Selesai</CardTitle>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resolved}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Ditutup</CardTitle>
                <CheckCircle className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.closed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Daftar Feedback</CardTitle>
                <CardDescription>Kelola semua feedback dari pengguna</CardDescription>
              </div>
              <Button onClick={exportToCSV} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Cari berdasarkan nama, email, atau subjek..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="complaint">Komplain</SelectItem>
                  <SelectItem value="feature_request">Request Fitur</SelectItem>
                  <SelectItem value="bug_report">Bug Report</SelectItem>
                  <SelectItem value="question">Pertanyaan</SelectItem>
                  <SelectItem value="general">Umum</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="new">Baru</SelectItem>
                  <SelectItem value="in_progress">Progress</SelectItem>
                  <SelectItem value="resolved">Selesai</SelectItem>
                  <SelectItem value="closed">Ditutup</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Priority</SelectItem>
                  <SelectItem value="urgent">Mendesak</SelectItem>
                  <SelectItem value="high">Tinggi</SelectItem>
                  <SelectItem value="medium">Sedang</SelectItem>
                  <SelectItem value="low">Rendah</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : feedbacks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Tidak ada feedback yang ditemukan
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Tipe</TableHead>
                      <TableHead>Subjek</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedbacks.map((feedback) => (
                      <TableRow key={feedback.id}>
                        <TableCell className="text-sm">
                          {format(new Date(feedback.created_at), 'dd MMM yyyy', { locale: localeId })}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{feedback.name}</span>
                            <span className="text-sm text-muted-foreground">{feedback.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getTypeBadgeVariant(feedback.type)}>
                            {getTypeLabel(feedback.type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="max-w-[200px] truncate">{feedback.subject}</span>
                            {feedback.metadata?.attachments && feedback.metadata.attachments.length > 0 && (
                              <Badge variant="secondary">
                                <Paperclip className="w-3 h-3 mr-1" />
                                {feedback.metadata.attachments.length}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(feedback.status)}>
                            {getStatusLabel(feedback.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPriorityBadgeVariant(feedback.priority)}>
                            {getPriorityLabel(feedback.priority)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedFeedback(feedback);
                              setDialogOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <FeedbackDetailDialog
        feedback={selectedFeedback}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onUpdate={fetchFeedbacks}
      />
    </AdminLayout>
  );
};

export default FeedbackManagement;
