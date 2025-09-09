import React from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { MetaPixelSettings } from '@/components/admin/MetaPixelSettings';

const TrackingSettings = () => {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Pengaturan Tracking"
        description="Kelola pengaturan tracking dan analitik website"
      />
      
      <MetaPixelSettings />
    </div>
  );
};

export default TrackingSettings;