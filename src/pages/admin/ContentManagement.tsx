import React from 'react';
import AuthorManagement from '../../components/admin/AuthorManagement';
import AdminLayout from '@/components/admin/AdminLayout';
import SEO from '@/components/SEO';

const ContentManagement: React.FC = () => {
  return (
    <AdminLayout title="Author Management">
      <SEO 
        title="Author Management - Admin" 
        description="Kelola data penulis artikel" 
      />
      
      <AuthorManagement />
    </AdminLayout>
  );
};

export default ContentManagement;