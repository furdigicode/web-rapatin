import AdminLayout from '@/components/admin/AdminLayout';
import { NotificationManagement } from '@/components/admin/NotificationManagement';

const NotificationManagementPage = () => {
  return (
    <AdminLayout title="Manajemen Notifikasi">
      <NotificationManagement />
    </AdminLayout>
  );
};

export default NotificationManagementPage;