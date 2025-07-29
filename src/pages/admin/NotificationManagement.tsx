import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { NotificationManagement } from '@/components/admin/NotificationManagement';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const NotificationManagementPage = () => {
  const [dialogTrigger, setDialogTrigger] = useState(0);

  const handleAddNotification = () => {
    // Trigger dialog opening
    if ((window as any).openNotificationDialog) {
      (window as any).openNotificationDialog();
    }
  };

  return (
    <AdminLayout title="Manajemen Notifikasi">
      <AdminPageHeader
        title="Manajemen Notifikasi"
        description="Kelola notifikasi artikel dan konfigurasi widget embed"
      >
        <Button onClick={handleAddNotification}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Notifikasi
        </Button>
      </AdminPageHeader>
      <NotificationManagement onAddNotification={handleAddNotification} />
    </AdminLayout>
  );
};

export default NotificationManagementPage;