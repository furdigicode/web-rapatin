
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface URLItem {
  id: string;
  label: string;
  description: string;
  url: string;
  group_id: string;
}

interface URLGroup {
  id: string;
  title: string;
  items: URLItem[];
}

const URLManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [urlGroups, setUrlGroups] = useState<URLGroup[]>([]);
  
  // Fetch URL groups and items
  const { isLoading, error } = useQuery({
    queryKey: ['urlGroups'],
    queryFn: async () => {
      // Fetch groups
      const { data: groupsData, error: groupsError } = await supabase
        .from('url_groups')
        .select('*')
        .order('order', { ascending: true });

      if (groupsError) throw new Error(groupsError.message);
      
      // Fetch items for each group
      const groups: URLGroup[] = await Promise.all(
        (groupsData || []).map(async (group) => {
          const { data: itemsData, error: itemsError } = await supabase
            .from('url_items')
            .select('*')
            .eq('group_id', group.id)
            .order('order', { ascending: true });
          
          if (itemsError) throw new Error(itemsError.message);
          
          return {
            id: group.id,
            title: group.title,
            items: itemsData || []
          };
        })
      );
      
      setUrlGroups(groups);
      return groups;
    }
  });

  // Save URL changes mutation
  const saveURLsMutation = useMutation({
    mutationFn: async (groups: URLGroup[]) => {
      // Update each URL item
      for (const group of groups) {
        for (const item of group.items) {
          const { error } = await supabase
            .from('url_items')
            .update({ url: item.url })
            .eq('id', item.id);
          
          if (error) throw error;
        }
      }
      return groups;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urlGroups'] });
      toast({
        title: "URL berhasil disimpan",
        description: "Perubahan URL telah berhasil disimpan",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Gagal menyimpan URL",
        description: error.message || "Terjadi kesalahan saat menyimpan URL",
      });
    }
  });

  const handleUrlChange = (groupIndex: number, itemIndex: number, value: string) => {
    const newGroups = [...urlGroups];
    newGroups[groupIndex].items[itemIndex].url = value;
    setUrlGroups(newGroups);
  };

  const handleSave = () => {
    saveURLsMutation.mutate(urlGroups);
  };

  if (isLoading) {
    return (
      <AdminLayout title="Manajemen URL">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Memuat data...</span>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Manajemen URL">
        <div className="text-red-500 p-4 border border-red-300 rounded-md">
          Error: {(error as Error).message}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Manajemen URL">
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Pengaturan URL</h2>
            <p className="text-sm text-muted-foreground">Kelola URL untuk tombol-tombol di website</p>
          </div>
          <Button 
            onClick={handleSave} 
            className="gap-2"
            disabled={saveURLsMutation.isPending}
          >
            {saveURLsMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save size={16} />
                Simpan Perubahan
              </>
            )}
          </Button>
        </div>
        
        {urlGroups.map((group, groupIndex) => (
          <Card key={group.id}>
            <CardHeader>
              <CardTitle>{group.title}</CardTitle>
              <CardDescription>Atur URL untuk tombol di {group.title.toLowerCase()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {group.items.map((item, itemIndex) => (
                  <div key={item.id} className="grid gap-2">
                    <Label htmlFor={`url-${groupIndex}-${itemIndex}`}>
                      {item.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                    <Input
                      id={`url-${groupIndex}-${itemIndex}`}
                      value={item.url}
                      onChange={(e) => handleUrlChange(groupIndex, itemIndex, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
};

export default URLManagement;
