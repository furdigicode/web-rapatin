
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Urls, UrlItem } from '@/types/supabase';

const URLManagement = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [urlGroups, setUrlGroups] = useState<Urls[]>([]);

  // Load URL data from localStorage or use default data
  useEffect(() => {
    const loadUrlData = async () => {
      setLoading(true);
      try {
        // First try to fetch from Supabase
        const { data, error } = await supabase
          .from('urls')
          .select('*');
        
        if (error) {
          console.error('Error fetching URLs from Supabase:', error);
          // Fall back to localStorage if Supabase fails
          const savedData = localStorage.getItem('urlData');
          if (savedData) {
            setUrlGroups(JSON.parse(savedData));
          } else {
            // Use default data if nothing is saved
            setUrlGroups([
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
              }
            ]);
          }
        } else if (data && data.length > 0) {
          // Transform Supabase data to our format if needed
          setUrlGroups(data);
        } else {
          // Use default data if no data in Supabase
          setUrlGroups([
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
            }
          ]);
        }
      } catch (err) {
        console.error('Error loading URL data:', err);
        toast({
          title: "Error loading data",
          description: "Could not load URL data. Using default values.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadUrlData();
  }, [toast]);

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
      
      // Then save to Supabase if available
      for (const group of urlGroups) {
        const { error } = await supabase
          .from('urls')
          .upsert({ 
            id: group.id, 
            title: group.title, 
            items: group.items 
          }, { 
            onConflict: 'id' 
          });
          
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

  return (
    <AdminLayout title="Manajemen URL">
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Pengaturan URL</h2>
            <p className="text-sm text-muted-foreground">Kelola URL untuk tombol-tombol di website</p>
          </div>
          <Button onClick={handleSave} className="gap-2" disabled={saving}>
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Simpan Perubahan
          </Button>
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
