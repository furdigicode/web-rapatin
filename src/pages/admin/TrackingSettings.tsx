import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { MetaPixelSettings } from '@/components/admin/MetaPixelSettings';

const TrackingSettings = () => {
  return (
    <AdminLayout title="Pengaturan Tracking">
      <div className="space-y-6">
        <MetaPixelSettings />
      </div>
    </AdminLayout>
  );
};

export default TrackingSettings;