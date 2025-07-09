import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, User } from 'lucide-react';
import BlogManagement from './BlogManagement';
import AuthorManagement from '../../components/admin/AuthorManagement';
import AdminLayout from '@/components/admin/AdminLayout';
import SEO from '@/components/SEO';

const ContentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('blog');

  return (
    <AdminLayout title="Content Management">
      <SEO 
        title="Content Management - Admin" 
        description="Kelola konten blog dan penulis artikel" 
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Content Management</h1>
          <p className="text-muted-foreground">
            Kelola artikel blog dan data penulis dalam satu dashboard terintegrasi
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <FileText size={16} />
              Blog Management
            </TabsTrigger>
            <TabsTrigger value="authors" className="flex items-center gap-2">
              <User size={16} />
              Author Management
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="blog" className="space-y-6">
            <BlogManagement />
          </TabsContent>
          
          <TabsContent value="authors" className="space-y-6">
            <AuthorManagement />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ContentManagement;