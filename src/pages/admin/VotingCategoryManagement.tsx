import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import VotingCategoryManagement from '@/components/admin/VotingCategoryManagement';

const VotingCategoryManagementPage = () => {
  return (
    <AdminLayout title="Kelola Kategori Voting">
      <VotingCategoryManagement />
    </AdminLayout>
  );
};

export default VotingCategoryManagementPage;
