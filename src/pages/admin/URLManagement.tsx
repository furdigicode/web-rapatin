
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUrlGroups } from "@/hooks/url-management/useUrlGroups";
import URLGroupCard from '@/components/admin/url-management/URLGroupCard';
import LoadingState from '@/components/admin/url-management/LoadingState';
import { Save, Loader2, AlertCircle, Info } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

const URLManagement = () => {
  const { urlGroups, loading, saving, handleUrlChange, saveUrlGroups } = useUrlGroups();
  const [dbAccessible, setDbAccessible] = useState<boolean | null>(null);

  // Check if the database is accessible
  useEffect(() => {
    const checkDbAccess = async () => {
      try {
        const { error } = await supabase
          .from('urls')
          .select('id')
          .limit(1);
        
        setDbAccessible(!error);
      } catch {
        setDbAccessible(false);
      }
    };
    
    checkDbAccess();
  }, []);

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

        {dbAccessible === false && (
          <Alert variant="warning" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Database tidak dapat diakses karena masalah akses. Perubahan akan disimpan hanya di localStorage.
            </AlertDescription>
          </Alert>
        )}
        
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

        <Alert variant="default" className="bg-muted/50 mt-4">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Perubahan URL akan diterapkan pada website setelah disimpan. Data akan selalu dicadangkan di localStorage browser sebagai cadangan.
          </AlertDescription>
        </Alert>
      </div>
    </AdminLayout>
  );
};

export default URLManagement;
