
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Users, FileText, Clock, Eye, MousePointer } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

const Dashboard = () => {
  // Mock data for most viewed articles
  const mostViewedArticles = [
    { id: 1, title: "7 Tips Rapat Online yang Efektif", views: 1243 },
    { id: 2, title: "Cara Meningkatkan Produktivitas Tim Remote", views: 986 },
    { id: 3, title: "Memilih Platform Rapat yang Tepat", views: 854 },
    { id: 4, title: "Etika dalam Rapat Virtual", views: 732 },
    { id: 5, title: "Mengatasi Kendala Teknis Saat Rapat Online", views: 645 },
  ];

  // Mock data for most visited pages
  const mostVisitedPages = [
    { id: 1, path: "/fitur/dashboard", title: "Dashboard", visits: 2134 },
    { id: 2, path: "/", title: "Beranda", visits: 1876 },
    { id: 3, path: "/fitur/rekaman-cloud", title: "Rekaman Cloud", visits: 1245 },
    { id: 4, path: "/fitur/bayar-sesuai-pakai", title: "Bayar Sesuai Pakai", visits: 986 },
    { id: 5, path: "/tentang-kami", title: "Tentang Kami", visits: 765 },
  ];

  return <AdminLayout title="Dashboard">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pengunjung Hari Ini</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">
              +18% dari bulan lalu
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Waktu Di Situs</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1:45</div>
            <p className="text-xs text-muted-foreground">
              +24% dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Halaman per Kunjungan</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2</div>
            <p className="text-xs text-muted-foreground">
              +12% dari bulan lalu
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Artikel Blog</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +4 artikel bulan ini
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        {/* Most Viewed Articles */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Artikel Terpopuler</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </div>
            <Separator />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul Artikel</TableHead>
                  <TableHead className="text-right">Dilihat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mostViewedArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium truncate max-w-[250px]">
                      {article.title}
                    </TableCell>
                    <TableCell className="text-right">{article.views.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Most Visited Pages */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Halaman Terpopuler</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </div>
            <Separator />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Halaman</TableHead>
                  <TableHead className="text-right">Kunjungan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mostVisitedPages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium truncate max-w-[250px]">
                      {page.title}
                    </TableCell>
                    <TableCell className="text-right">{page.visits.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>;
};
export default Dashboard;
