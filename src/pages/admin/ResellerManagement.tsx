
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Type for reseller applications
type ResellerApplication = {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  has_sold_zoom: boolean;
  selling_experience: string | null;
  reason: string;
  selling_plan: string;
  monthly_target: number;
  status: string;
  created_at: string;
  updated_at: string;
};

const ResellerManagement: React.FC = () => {
  // Fetch reseller applications
  const { data: applications, isLoading, error } = useQuery({
    queryKey: ['resellerApplications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reseller_applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(`Error fetching reseller applications: ${error.message}`);
      }
      
      return data as ResellerApplication[];
    }
  });

  // Function to open WhatsApp chat
  const openWhatsAppChat = (phone: string, name: string) => {
    const message = `Halo ${name}, terima kasih telah mendaftar sebagai reseller Rapatin. Kami ingin berbicara lebih lanjut mengenai pendaftaran Anda.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // Render badge based on status
  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <Badge variant="default" className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <AdminLayout title="Reseller Applications">
      <Card>
        <CardHeader>
          <CardTitle>Reseller Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-pulse">Loading applications...</div>
            </div>
          ) : error ? (
            <div className="text-center text-destructive p-8">
              Error loading applications. Please try again.
            </div>
          ) : applications && applications.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>Monthly Target</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">{application.name}</TableCell>
                      <TableCell>{application.email}</TableCell>
                      <TableCell>{application.whatsapp}</TableCell>
                      <TableCell>{application.monthly_target}</TableCell>
                      <TableCell>{renderStatusBadge(application.status)}</TableCell>
                      <TableCell>{format(new Date(application.created_at), 'dd MMM yyyy')}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => openWhatsAppChat(application.whatsapp, application.name)}
                        >
                          <MessageSquare className="h-4 w-4" />
                          Chat
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No applications found.
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default ResellerManagement;
