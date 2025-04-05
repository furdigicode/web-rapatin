
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Urls, UrlItem } from '@/types/supabase';

const URLManagement = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [urlGroups, setUrlGroups] = useState<Urls[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Default URL data - comprehensive list of all buttons in the app
  const defaultUrlData = [
    {
      id: "1",
      title: "Hero Section",
      items: [
        {
          label: "Mulai Menjadwalkan",
          description: "Tombol CTA utama di hero section",
          url: "https://rapatin.id/register"
        },
        {
          label: "Lihat Harga",
          description: "Tombol ke bagian pricing",
          url: "#pricing"
        }
      ]
    },
    {
      id: "2",
      title: "Call to Action",
      items: [
        {
          label: "Daftar & Mulai Menjadwalkan",
          description: "Tombol CTA di bagian akhir halaman",
          url: "https://rapatin.id/register"
        }
      ]
    },
    {
      id: "3",
      title: "Navbar",
      items: [
        {
          label: "Masuk",
          description: "Tombol login di navbar",
          url: "https://rapatin.id/login"
        },
        {
          label: "Daftar",
          description: "Tombol register di navbar",
          url: "https://rapatin.id/register"
        }
      ]
    },
    {
      id: "4",
      title: "Pricing Section",
      items: [
        {
          label: "Jadwalkan Rapat Sekarang",
          description: "Tombol CTA di bagian pricing",
          url: "https://app.rapatin.id/register"
        }
      ]
    },
    {
      id: "5",
      title: "Dashboard Preview",
      items: [
        {
          label: "Daftar Sekarang",
          description: "Tombol CTA di bagian dashboard preview",
          url: "https://app.rapatin.id/register"
        }
      ]
    }
  ];

  // Load URL data
  useEffect(() => {
    loadUrlData();
  }, []);

  const loadUrlData = async () => {
    setLoading(true);
    try {
      // Fetch from Supabase
      const { data, error } = await supabase
        .from('urls')
        .select('*') as { data: Urls[] | null; error: Error | null };
      
      if (error) {
        console.error('Error fetching URLs from Supabase:', error);
        toast({
          title: "Error loading data",
          description: "Could not load URL data from database. Using default values.",
          variant: "destructive"
        });
        setUrlGroups(defaultUrlData);
      } else if (data && data.length > 0) {
        // Check if we have data for all sections
        const missingGroups = [];
        const defaultIds = defaultUrlData.map(group => group.id);
        
        for (const defaultGroup of defaultUrlData) {
          if (!data.some(group => group.id === defaultGroup.id)) {
            missingGroups.push(defaultGroup);
          }
        }
        
        // If any sections are missing, add them
        if (missingGroups.length > 0) {
          const updatedData = [...data, ...missingGroups];
          setUrlGroups(updatedData);
          
          // Also save missing groups to Supabase
          for (const group of missingGroups) {
            const { error: insertError } = await supabase
              .from('urls')
              .upsert(group);
              
            if (insertError) {
              console.error('Error saving missing group to Supabase:', insertError);
            }
          }
        } else {
          setUrlGroups(data);
        }
      } else {
        // If no data in Supabase, initialize with default data
        setUrlGroups(defaultUrlData);
        // Save the default data to Supabase
        for (const group of defaultUrlData) {
          const { error: insertError } = await supabase
            .from('urls')
            .upsert(group);
            
          if (insertError) {
            console.error('Error saving default data to Supabase:', insertError);
          }
        }
      }
    } catch (err) {
      console.error('Error loading URL data:', err);
      toast({
        title: "Error loading data",
        description: "Could not load URL data. Using default values.",
        variant: "destructive"
      });
      setUrlGroups(defaultUrlData);
    } finally {
      setLoading(false);
    }
  };

  const handleUrlChange = (groupIndex: number, itemIndex: number, value: string) => {
    const newGroups = [...urlGroups];
    newGroups[groupIndex].items[itemIndex].url = value;
    setUrlGroups(newGroups);
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // First save to localStorage as a backup
      localStorage.setItem('urlData', JSON.stringify(urlGroups));
      
      // Then save to Supabase
      for (const group of urlGroups) {
        const { error } = await supabase
          .from('urls')
          .upsert(group);
          
        if (error) {
          console.error('Error saving to Supabase:', error);
          throw error;
        }
      }
      
      toast({
        title: "URL berhasil disimpan",
        description: "Perubahan URL telah berhasil disimpan",
      });
    } catch (err) {
      console.error('Error saving URLs:', err);
      toast({
        title: "Error menyimpan data",
        description: "Terjadi kesalahan saat menyimpan URL. Data disimpan di localStorage saja.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Reset to default values
      setUrlGroups(defaultUrlData);
      
      // Save default values to Supabase
      for (const group of defaultUrlData) {
        const { error } = await supabase
          .from('urls')
          .upsert(group);
          
        if (error) {
          console.error('Error saving default values to Supabase:', error);
          throw error;
        }
      }
      
      toast({
        title: "URL direset ke default",
        description: "Semua URL telah direset ke nilai default",
      });
    } catch (err) {
      console.error('Error resetting URLs:', err);
      toast({
        title: "Error mereset data",
        description: "Terjadi kesalahan saat mereset URL.",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
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
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              className="gap-2" 
              disabled={refreshing || saving || loading}
            >
              {refreshing ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <RefreshCw size={16} />
              )}
              Reset ke Default
            </Button>
            <Button 
              onClick={handleSave} 
              className="gap-2" 
              disabled={saving || loading}
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Simpan Perubahan
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          urlGroups.map((group, groupIndex) => (
            <Card key={groupIndex}>
              <CardHeader>
                <CardTitle>{group.title}</CardTitle>
                <CardDescription>Atur URL untuk tombol di {group.title.toLowerCase()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {group.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="grid gap-2">
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
          ))
        )}
      </div>
    </AdminLayout>
  );
};

export default URLManagement;
