import React from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, MousePointer } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  // Fetch most viewed blog posts
  const { data: mostViewedArticles = [], isLoading: isLoadingArticles } = useQuery({
    queryKey: ['most-viewed-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error('Error fetching most viewed articles:', error);
        return [];
      }
      
      // Since we don't have real view counts yet, we'll simulate them
      return data.map((post, index) => ({
        id: post.id,
        title: post.title,
        views: Math.floor(Math.random() * 1000) + 500 - (index * 100)
      }));
    },
  });

  // Mock data for most visited pages (we'll replace this with real analytics later)
  const mostVisitedPages = [{
    id: 1,
    path: "/fitur/dashboard",
    title: "Dashboard",
    visits: 2134
  }, {
    id: 2,
    path: "/",
    title: "Beranda",
    visits: 1876
  }, {
    id: 3,
    path: "/fitur/rekaman-cloud",
    title: "Rekaman Cloud",
    visits: 1245
  }, {
    id: 4,
    path: "/fitur/bayar-sesuai-pakai",
    title: "Bayar Sesuai Pakai",
    visits: 986
  }, {
    id: 5,
    path: "/tentang-kami",
    title: "Tentang Kami",
    visits: 765
  }];

  return <AdminLayout>
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
            {isLoadingArticles ? (
              <div className="py-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul Artikel</TableHead>
                    <TableHead className="text-right">Dilihat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mostViewedArticles.map(article => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium truncate max-w-[250px]">
                        {article.title}
                      </TableCell>
                      <TableCell className="text-right">{article.views.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  {mostViewedArticles.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-4 text-muted-foreground">
                        Belum ada data artikel
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
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
                {mostVisitedPages.map(page => <TableRow key={page.id}>
                    <TableCell className="font-medium truncate max-w-[250px]">
                      {page.title}
                    </TableCell>
                    <TableCell className="text-right">{page.visits.toLocaleString()}</TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>;
};

export default Dashboard;
