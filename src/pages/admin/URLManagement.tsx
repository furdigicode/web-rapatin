
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { useUrlGroups } from "@/hooks/url-management/useUrlGroups";
import URLGroupCard from '@/components/admin/url-management/URLGroupCard';
import LoadingState from '@/components/admin/url-management/LoadingState';
import { Save, Loader2 } from 'lucide-react';

const URLManagement = () => {
  const { urlGroups, loading, saving, handleUrlChange, saveUrlGroups } = useUrlGroups();

  return (
    <AdminLayout title="Manajemen URL">
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Pengaturan URL</h2>
            <p className="text-sm text-muted-foreground">Kelola URL untuk tombol-tombol di website</p>
          </div>
          <Button onClick={saveUrlGroups} className="gap-2" disabled={saving}>
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Simpan Perubahan
          </Button>
        </div>
        
        {loading ? (
          <LoadingState />
        ) : (
          urlGroups.map((group, groupIndex) => (
            <URLGroupCard
              key={group.id}
              title={group.title}
              items={group.items}
              onUrlChange={(itemIndex, value) => handleUrlChange(groupIndex, itemIndex, value)}
            />
          ))
        )}
      </div>
    </AdminLayout>
  );
};

export default URLManagement;
