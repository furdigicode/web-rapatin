import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Search } from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface VotingOption {
  id: string;
  option_text: string;
  vote_count: number;
  percentage: number;
}

interface VotingResponse {
  id: string;
  user_identifier: string;
  user_name: string | null;
  user_email: string | null;
  voted_at: string;
  metadata: any;
  option_text: string;
}

const VotingResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: voting, isLoading: votingLoading } = useQuery({
    queryKey: ['voting', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('votings')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: options, isLoading: optionsLoading } = useQuery({
    queryKey: ['voting-options', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('voting_options')
        .select('*')
        .eq('voting_id', id)
        .order('option_order');
      
      if (error) throw error;
      
      const totalVotes = voting?.total_votes || 0;
      return data.map(opt => ({
        ...opt,
        percentage: totalVotes > 0 ? Math.round((opt.vote_count / totalVotes) * 100 * 100) / 100 : 0
      })) as VotingOption[];
    },
    enabled: !!voting,
  });

  const { data: responses, isLoading: responsesLoading } = useQuery({
    queryKey: ['voting-responses', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('voting_responses')
        .select(`
          id,
          user_identifier,
          user_name,
          user_email,
          voted_at,
          metadata,
          option_id
        `)
        .eq('voting_id', id)
        .order('voted_at', { ascending: false });
      
      if (error) throw error;
      
      // Join with options to get option_text
      const optionsMap = new Map(options?.map(o => [o.id, o.option_text]) || []);
      
      return data.map(r => ({
        ...r,
        option_text: optionsMap.get(r.option_id) || 'Unknown'
      })) as VotingResponse[];
    },
    enabled: !!options,
  });

  const filteredResponses = responses?.filter(r => 
    r.user_identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.option_text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const chartData = options?.map(opt => ({
    name: opt.option_text.length > 30 ? opt.option_text.substring(0, 30) + '...' : opt.option_text,
    fullName: opt.option_text,
    suara: opt.vote_count,
    persentase: opt.percentage
  })) || [];

  const exportToCSV = () => {
    if (!voting || !responses) return;

    const headers = ['No', 'User ID', 'Nama', 'Email', 'Pilihan', 'Waktu Vote', 'Browser'];
    const rows = responses.map((r, i) => [
      i + 1,
      r.user_identifier,
      r.user_name || '-',
      r.user_email || '-',
      r.option_text,
      new Date(r.voted_at).toLocaleString('id-ID'),
      r.metadata?.userAgent || '-'
    ]);

    const csvContent = [
      `Voting: ${voting.title}`,
      `Exported: ${new Date().toLocaleString('id-ID')}`,
      `Total Suara: ${voting.total_votes}`,
      '',
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `voting-${voting.slug}-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Data berhasil di-export!');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      draft: "secondary",
      active: "default",
      closed: "outline",
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  if (votingLoading) {
    return (
      <AdminLayout title="Hasil Voting">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!voting) {
    return (
      <AdminLayout title="Hasil Voting">
        <div className="text-center py-8">Voting tidak ditemukan</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Hasil Voting">
      <SEO 
        title={`Hasil Voting: ${voting.title} - Admin`}
        description="Lihat hasil dan analisis voting"
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-2xl font-bold">Hasil Voting: {voting.title}</h1>
            <p className="text-muted-foreground">Analisis dan detail responden</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate('/admin/voting')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
            <Button onClick={exportToCSV} disabled={!responses || responses.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Overview Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Suara</CardDescription>
              <CardTitle className="text-3xl">{voting.total_votes}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Status</CardDescription>
              <CardTitle className="text-xl">{getStatusBadge(voting.status)}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Kategori</CardDescription>
              <CardTitle className="text-xl">{voting.category || '-'}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Dibuat</CardDescription>
              <CardTitle className="text-xl">
                {new Date(voting.created_at).toLocaleDateString('id-ID')}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Chart Section */}
        {options && options.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Visualisasi Hasil</CardTitle>
              <CardDescription>Distribusi suara per opsi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-semibold">{payload[0].payload.fullName}</p>
                              <p className="text-sm">Suara: {payload[0].value}</p>
                              <p className="text-sm">Persentase: {payload[0].payload.persentase}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="suara" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Responses Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Detail Responden</CardTitle>
                <CardDescription>
                  {responses?.length || 0} responden
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Cari responden..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {responsesLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : filteredResponses && filteredResponses.length > 0 ? (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Pilihan</TableHead>
                      <TableHead>Waktu</TableHead>
                      <TableHead>Browser</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResponses.map((response, index) => (
                      <TableRow key={response.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {response.user_identifier.substring(0, 12)}...
                        </TableCell>
                        <TableCell>{response.user_name || '-'}</TableCell>
                        <TableCell className="font-medium">{response.option_text}</TableCell>
                        <TableCell>
                          {new Date(response.voted_at).toLocaleString('id-ID', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {response.metadata?.userAgent 
                            ? response.metadata.userAgent.split(' ')[0] 
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'Tidak ada hasil pencarian' : 'Belum ada responden'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default VotingResults;
