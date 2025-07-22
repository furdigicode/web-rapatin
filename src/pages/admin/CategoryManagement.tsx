import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import CategoryManagement from '@/components/admin/CategoryManagement';

const CategoryManagementPage = () => {
  return (
    <AdminLayout title="Kelola Kategori">
      <CategoryManagement />
    </AdminLayout>
  );
};

export default CategoryManagementPage;