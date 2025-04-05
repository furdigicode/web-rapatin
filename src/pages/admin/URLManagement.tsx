
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUrlGroups } from "@/hooks/url-management/useUrlGroups";
import URLGroupCard from '@/components/admin/url-management/URLGroupCard';
import LoadingState from '@/components/admin/url-management/LoadingState';
import { Save, Loader2, AlertCircle, Info, RefreshCw } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { forceInitializeUrlData } from '@/integrations/supabase/initializeData';
import { useToast } from '@/hooks/use-toast';

const URLManagement = () => {
  const { urlGroups, loading, saving, handleUrlChange, saveUrlGroups, reloadData } = useUrlGroups();
  const [dbAccessible, setDbAccessible] = useState<boolean | null>(null);
  const [checkingDb, setCheckingDb] = useState(true);
  const [syncingToDb, setSyncingToDb] = useState(false);
  const { toast } = useToast();

  // Check if the database is accessible
  useEffect(() => {
    const checkDbAccess = async () => {
      setCheckingDb(true);
      try {
        const { data, error } = await supabase
          .from('urls')
          .select('id')
          .limit(1);
        
        setDbAccessible(!error && data !== null);
      } catch {
        setDbAccessible(false);
      } finally {
        setCheckingDb(false);
      }
    };
    
    checkDbAccess();
  }, []);

  const handleSyncToDatabase = async () => {
    setSyncingToDb(true);
    try {
      const result = await forceInitializeUrlData();
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        // Reload data from the database
        await reloadData();
        // Check database accessibility again
        const { error } = await supabase
          .from('urls')
          .select('id')
          .limit(1);
          
        setDbAccessible(!error);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error syncing to database:", error);
      toast({
        title: "Error",
        description: "Failed to sync data to database.",
        variant: "destructive"
      });
    } finally {
      setSyncingToDb(false);
    }
  };

  return (
    <AdminLayout title="Manajemen URL">
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Pengaturan URL</h2>
            <p className="text-sm text-muted-foreground">Kelola URL untuk tombol-tombol di website</p>
          </div>
          <div className="flex gap-2">
            {!dbAccessible && !checkingDb && (
              <Button 
                onClick={handleSyncToDatabase} 
                variant="outline" 
                className="gap-2" 
                disabled={syncingToDb}
              >
                {syncingToDb ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <RefreshCw size={16} />
                )}
                Sync to Database
              </Button>
            )}
            <Button onClick={saveUrlGroups} className="gap-2" disabled={saving}>
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Simpan Perubahan
            </Button>
          </div>
        </div>

        {dbAccessible === false && !checkingDb && (
          <Alert variant="default" className="mb-4 border-amber-500">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center">
              Database tidak dapat diakses. Perubahan akan disimpan hanya di localStorage browser Anda.
            </AlertDescription>
          </Alert>
        )}
        
        {loading || checkingDb ? (
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
