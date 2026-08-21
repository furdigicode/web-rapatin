import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import SEO from '@/components/SEO';
import SurveyBuilder from '@/components/admin/SurveyBuilder';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { BarChart3, ExternalLink, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Survey } from '@/types/SurveyTypes';

const statusVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
  active: 'default',
  draft: 'secondary',
  closed: 'outline',
};

const statusLabel: Record<string, string> = {
  active: 'Aktif',
  draft: 'Draft',
  closed: 'Ditutup',
};

const SurveyManagement: React.FC = () => {
  const { toast } = useToast();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchSurveys = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Gagal memuat survei', description: error.message, variant: 'destructive' });
    } else {
      setSurveys((data ?? []) as Survey[]);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('surveys').delete().eq('id', deleteId);
    if (error) {
      toast({ title: 'Gagal menghapus survei', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Survei dihapus' });
      fetchSurveys();
    }
    setDeleteId(null);
  };

  const showForm = isCreating || editingId !== null;

  const handleBack = () => {
    setIsCreating(false);
    setEditingId(null);
    fetchSurveys();
  };

  return (
    <AdminLayout title="Kelola Survei">
      <SEO title="Kelola Survei - Admin" description="Buat dan kelola survei Rapatin" />

      {showForm ? (
        <SurveyBuilder surveyId={editingId} onSaveSuccess={handleBack} onCancel={handleBack} />
      ) : (
        <>
          <AdminPageHeader
            title="Kelola Survei"
            description="Buat survei dari markdown, lalu bagikan formulirnya ke responden"
          >
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Buat Baru
            </Button>
          </AdminPageHeader>

          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : surveys.length === 0 ? (
                <p className="py-16 text-center text-sm text-muted-foreground">
                  Belum ada survei. Klik "Buat Baru" untuk memulai.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Judul</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Respons</TableHead>
                        <TableHead>Dibuat</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {surveys.map((survey) => (
                        <TableRow key={survey.id}>
                          <TableCell>
                            <div className="font-medium">{survey.title}</div>
                            <div className="text-xs text-muted-foreground">/survei/{survey.slug}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusVariant[survey.status] ?? 'secondary'}>
                              {statusLabel[survey.status] ?? survey.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{survey.total_responses}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(survey.created_at).toLocaleDateString('id-ID')}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" asChild title="Lihat hasil">
                                <Link to={`/admin/survey/${survey.id}/results`}>
                                  <BarChart3 className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button variant="ghost" size="icon" asChild title="Buka halaman publik">
                                <a
                                  href={`/survei/${survey.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Edit"
                                onClick={() => setEditingId(survey.id)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Hapus"
                                onClick={() => setDeleteId(survey.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus survei ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Seluruh pertanyaan dan respons yang sudah masuk akan ikut terhapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default SurveyManagement;
