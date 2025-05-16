
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { toast } from "sonner";
import { Eye, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import AdminLayout from "@/components/admin/AdminLayout";

type ResellerApplication = Tables<"reseller_applications">;

type StatusBadgeProps = {
  status: string;
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case "approved":
      return <Badge className="bg-green-500 hover:bg-green-600">Disetujui</Badge>;
    case "rejected":
      return <Badge variant="destructive">Ditolak</Badge>;
    case "pending":
    default:
      return <Badge variant="outline" className="border-amber-500 text-amber-500">Menunggu</Badge>;
  }
};

export default function ResellerApplications() {
  const [currentApplication, setCurrentApplication] = useState<ResellerApplication | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  
  const queryClient = useQueryClient();

  // Fetch applications data
  const { data: applications, isLoading, isError } = useQuery({
    queryKey: ["resellerApplications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reseller_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ResellerApplication[];
    },
  });

  // Update application status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: string;
    }) => {
      const { error } = await supabase
        .from("reseller_applications")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resellerApplications"] });
      toast.success(
        actionType === "approve"
          ? "Aplikasi reseller berhasil disetujui!"
          : "Aplikasi reseller ditolak"
      );
      setConfirmDialogOpen(false);
      setDetailsOpen(false);
    },
    onError: (error) => {
      toast.error(`Terjadi kesalahan: ${error.message}`);
    },
  });

  const handleViewDetails = (application: ResellerApplication) => {
    setCurrentApplication(application);
    setDetailsOpen(true);
  };

  const handleStatusChange = (application: ResellerApplication, status: "approve" | "reject") => {
    setCurrentApplication(application);
    setActionType(status);
    setConfirmDialogOpen(true);
  };

  const confirmStatusChange = () => {
    if (currentApplication && actionType) {
      updateStatusMutation.mutate({
        id: currentApplication.id,
        status: actionType === "approve" ? "approved" : "rejected",
      });
    }
  };

  if (isError) {
    return (
      <AdminLayout title="Pendaftaran Reseller">
        <div className="container p-4">
          <div className="flex items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8 text-center">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-red-700">Gagal memuat data</h3>
              <p className="text-red-600">Terjadi kesalahan saat mengambil data pendaftaran reseller.</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Pendaftaran Reseller">
      <div className="container p-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Pendaftaran Reseller</h2>
          <p className="text-muted-foreground">Kelola pendaftaran reseller baru</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Pendaftar Reseller</CardTitle>
            <CardDescription>
              Pendaftaran terbaru ditampilkan terlebih dahulu
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : applications && applications.length > 0 ? (
              <div className="overflow-hidden rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Nama</TableHead>
                      <TableHead>Kontak</TableHead>
                      <TableHead>Target Bulanan</TableHead>
                      <TableHead>Tanggal Pendaftaran</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">{application.name}</TableCell>
                        <TableCell>
                          <div>
                            <p>{application.email}</p>
                            <p className="text-sm text-muted-foreground">{application.whatsapp}</p>
                          </div>
                        </TableCell>
                        <TableCell>{application.monthly_target}</TableCell>
                        <TableCell>
                          {format(new Date(application.created_at), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={application.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleViewDetails(application)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {application.status === "pending" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="border-green-500 text-green-500 hover:bg-green-50 hover:text-green-700"
                                  onClick={() => handleStatusChange(application, "approve")}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-700"
                                  onClick={() => handleStatusChange(application, "reject")}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-muted p-3">
                  <svg
                    className="h-6 w-6 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="mb-1 text-lg font-medium">Tidak ada data</h3>
                <p className="text-sm text-muted-foreground">
                  Belum ada pendaftaran reseller baru
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Application Details Sheet */}
        <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
          <SheetContent className="w-full sm:max-w-xl">
            <SheetHeader>
              <SheetTitle>Detail Pendaftaran</SheetTitle>
              <SheetDescription>
                Informasi lengkap pendaftaran reseller
              </SheetDescription>
            </SheetHeader>
            
            {currentApplication && (
              <div className="mt-6 space-y-6">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  <StatusBadge status={currentApplication.status} />
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">Nama</h4>
                  <p>{currentApplication.name}</p>
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                  <p>{currentApplication.email}</p>
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">WhatsApp</h4>
                  <p>{currentApplication.whatsapp}</p>
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">Pernah Menjual Link Zoom</h4>
                  <p>{currentApplication.has_sold_zoom ? "Ya" : "Tidak"}</p>
                </div>
                
                {currentApplication.has_sold_zoom && (
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-muted-foreground">Pengalaman Berjualan</h4>
                    <div className="rounded-md border border-border bg-muted/20 p-3">
                      <p className="whitespace-pre-wrap text-sm">
                        {currentApplication.selling_experience || "-"}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">Alasan Menjadi Reseller</h4>
                  <div className="rounded-md border border-border bg-muted/20 p-3">
                    <p className="whitespace-pre-wrap text-sm">{currentApplication.reason}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">Rencana Penjualan</h4>
                  <div className="rounded-md border border-border bg-muted/20 p-3">
                    <p className="whitespace-pre-wrap text-sm">{currentApplication.selling_plan}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">Target Bulanan</h4>
                  <p>{currentApplication.monthly_target} pembeli</p>
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">Tanggal Pendaftaran</h4>
                  <p>{format(new Date(currentApplication.created_at), "dd MMMM yyyy, HH:mm")}</p>
                </div>

                {currentApplication.status === "pending" && (
                  <div className="mt-8 flex space-x-3">
                    <Button
                      variant="outline"
                      className="border-green-500 text-green-500 hover:bg-green-50 hover:text-green-700"
                      onClick={() => handleStatusChange(currentApplication, "approve")}
                    >
                      <Check className="mr-2 h-4 w-4" /> Setujui Pendaftaran
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleStatusChange(currentApplication, "reject")}
                    >
                      <X className="mr-2 h-4 w-4" /> Tolak Pendaftaran
                    </Button>
                  </div>
                )}
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Confirmation Dialog */}
        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === "approve" ? "Setujui Pendaftaran" : "Tolak Pendaftaran"}
              </DialogTitle>
              <DialogDescription>
                {actionType === "approve"
                  ? "Apakah Anda yakin ingin menyetujui pendaftaran reseller ini?"
                  : "Apakah Anda yakin ingin menolak pendaftaran reseller ini?"}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
                Batal
              </Button>
              <Button
                variant={actionType === "approve" ? "default" : "destructive"}
                onClick={confirmStatusChange}
              >
                {actionType === "approve" ? "Ya, Setujui" : "Ya, Tolak"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
