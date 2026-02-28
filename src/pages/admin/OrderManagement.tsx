import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { 
  Search, 
  Download, 
  Eye, 
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Video,
  AlertTriangle
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import OrderDetailDialog from '@/components/admin/OrderDetailDialog';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { GuestOrder, OrderStats, PaymentStatus } from '@/types/OrderTypes';
import { formatRupiah } from '@/utils/formatRupiah';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

const OrderManagement = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<GuestOrder | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch orders
  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['guest-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guest_orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as GuestOrder[];
    },
  });

  const handleOrderUpdate = async () => {
    const { data } = await refetch();
    // Update selectedOrder dengan data terbaru dari database
    if (selectedOrder && data) {
      const updatedOrder = data.find(o => o.id === selectedOrder.id);
      if (updatedOrder) {
        setSelectedOrder(updatedOrder);
      }
    }
  };

  // Calculate stats
  const stats: OrderStats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.payment_status === 'pending').length,
      paid: orders.filter(o => o.payment_status === 'paid').length,
      expired: orders.filter(o => o.payment_status === 'expired').length,
    };
  }, [orders]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Status filter
      if (statusFilter !== 'all' && order.payment_status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          order.name.toLowerCase().includes(query) ||
          order.email.toLowerCase().includes(query) ||
          order.whatsapp.includes(query) ||
          (order.meeting_topic?.toLowerCase().includes(query) ?? false) ||
          (order.order_number?.toLowerCase().includes(query) ?? false)
        );
      }

      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Paginated orders
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

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

  const getZoomStatusIcon = (order: GuestOrder) => {
    if (order.payment_status !== 'paid') {
      return null;
    }
    
    if (order.zoom_link) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Video className="h-4 w-4 text-green-500 flex-shrink-0" />
          </TooltipTrigger>
          <TooltipContent>Zoom Meeting Ready</TooltipContent>
        </Tooltip>
      );
    }
    
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0" />
        </TooltipTrigger>
        <TooltipContent>Zoom belum tersedia - perlu input manual</TooltipContent>
      </Tooltip>
    );
  };

  const handleViewOrder = (order: GuestOrder) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const exportToCSV = () => {
    const headers = [
      'Tanggal Order',
      'Nama',
      'Email',
      'WhatsApp',
      'Topik Meeting',
      'Tanggal Meeting',
      'Jam Meeting',
      'Jumlah Peserta',
      'Harga',
      'Status',
      'Metode Pembayaran',
      'Meeting ID',
      'Zoom Link',
      'Dibayar'
    ];

    const rows = filteredOrders.map(order => [
      format(new Date(order.created_at), 'yyyy-MM-dd HH:mm'),
      order.name,
      order.email,
      order.whatsapp,
      order.meeting_topic || '',
      order.meeting_date,
      order.meeting_time || '',
      order.participant_count,
      order.price,
      order.payment_status,
      order.payment_method || '',
      order.meeting_id || '',
      order.zoom_link || '',
      order.paid_at ? format(new Date(order.paid_at), 'yyyy-MM-dd HH:mm') : ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orders-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export berhasil",
      description: `${filteredOrders.length} order telah diekspor ke CSV`,
    });
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color 
  }: { 
    title: string; 
    value: number; 
    icon: React.ElementType; 
    color: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <TooltipProvider>
    <AdminLayout title="Orders">
      <AdminPageHeader
        title="Orders"
        description="Kelola pesanan dari Quick Order"
      >
        <Button onClick={exportToCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </AdminPageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Order" value={stats.total} icon={Package} color="bg-primary" />
        <StatCard title="Menunggu" value={stats.pending} icon={Clock} color="bg-yellow-500" />
        <StatCard title="Lunas" value={stats.paid} icon={CheckCircle} color="bg-green-500" />
        <StatCard title="Kadaluarsa" value={stats.expired} icon={XCircle} color="bg-red-500" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama, email, WhatsApp, atau no. order..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as PaymentStatus)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="pending">Menunggu</SelectItem>
            <SelectItem value="paid">Lunas</SelectItem>
            <SelectItem value="expired">Kadaluarsa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Tidak ada order</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Coba ubah filter pencarian Anda'
                  : 'Belum ada order yang masuk'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Order</TableHead>
                    <TableHead>Tanggal Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Meeting</TableHead>
                    <TableHead className="text-center">Peserta</TableHead>
                    <TableHead className="text-right">Harga</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="whitespace-nowrap">
                        <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                          {order.order_number || '-'}
                        </code>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="text-sm">
                          {format(new Date(order.created_at), 'd MMM yyyy', { locale: id })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(order.created_at), 'HH:mm')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{order.name}</div>
                        <div className="text-sm text-muted-foreground">{order.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium truncate max-w-[200px] flex items-center gap-1.5">
                          {getZoomStatusIcon(order)}
                          <span className="truncate">{order.meeting_topic || '-'}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(order.meeting_date), 'd MMM', { locale: id })}
                          {order.meeting_time && `, ${order.meeting_time}`}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {order.participant_count}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {formatRupiah(order.price)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(order.payment_status)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <p className="text-sm text-muted-foreground">
            Menampilkan {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)} dari {filteredOrders.length} order
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {getPageNumbers().map((page, i) => (
                <PaginationItem key={i}>
                  {page === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Order Detail Dialog */}
      <OrderDetailDialog
        order={selectedOrder}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onUpdate={handleOrderUpdate}
      />
    </AdminLayout>
    </TooltipProvider>
  );
};

export default OrderManagement;
