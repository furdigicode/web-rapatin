
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Urls, UrlItem } from '@/types/supabase';
import { useToast } from "@/hooks/use-toast";

// Default URL data if nothing is loaded
const defaultUrlData: Urls[] = [
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
];

export const useUrlGroups = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [urlGroups, setUrlGroups] = useState<Urls[]>([]);

  // Load URL data
  useEffect(() => {
    loadUrlData();
  }, []);

  const loadUrlData = async () => {
    setLoading(true);
    try {
      // First try fetching from Supabase
      const { data, error } = await supabase
        .from('urls')
        .select('*');
      
      if (error) {
        console.error('Error fetching URLs from Supabase:', error);
        // Fall back to localStorage
        const savedData = localStorage.getItem('urlData');
        if (savedData) {
          setUrlGroups(JSON.parse(savedData));
          toast({
            title: "Loaded from local storage",
            description: "URL data loaded from local storage as database access is restricted.",
          });
        } else {
          // Use default data if nothing is saved
          setUrlGroups(defaultUrlData);
          // Save default data to localStorage
          localStorage.setItem('urlData', JSON.stringify(defaultUrlData));
          toast({
            title: "Using default URLs",
            description: "Default URL settings loaded. Changes will be saved locally.",
          });
        }
      } else if (data && data.length > 0) {
        setUrlGroups(data as Urls[]);
        // Also update localStorage with latest data
        localStorage.setItem('urlData', JSON.stringify(data));
      } else {
        // If no data in Supabase, initialize with default data
        setUrlGroups(defaultUrlData);
        localStorage.setItem('urlData', JSON.stringify(defaultUrlData));
        
        // Try to initialize Supabase with default data (may fail due to RLS)
        try {
          for (const group of defaultUrlData) {
            await supabase
              .from('urls')
              .upsert(group);
          }
        } catch (initError) {
          console.error('Error initializing default URL data:', initError);
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
      localStorage.setItem('urlData', JSON.stringify(defaultUrlData));
    } finally {
      setLoading(false);
    }
  };

  const handleUrlChange = (groupIndex: number, itemIndex: number, value: string) => {
    const newGroups = [...urlGroups];
    newGroups[groupIndex].items[itemIndex].url = value;
    setUrlGroups(newGroups);
  };

  const saveUrlGroups = async () => {
    setSaving(true);
    
    try {
      // First save to localStorage as a reliable backup
      localStorage.setItem('urlData', JSON.stringify(urlGroups));
      
      // Then try to save to Supabase
      let hasSupabaseError = false;
      
      for (const group of urlGroups) {
        const { error } = await supabase
          .from('urls')
          .upsert(group);
          
        if (error) {
          console.error('Error saving to Supabase:', error);
          hasSupabaseError = true;
        }
      }
      
      if (hasSupabaseError) {
        toast({
          title: "Data tersimpan di localStorage",
          description: "Terjadi kesalahan saat menyimpan ke database. Data disimpan di localStorage saja.",
          variant: "default" // Changed from "warning" to "default"
        });
      } else {
        toast({
          title: "URL berhasil disimpan",
          description: "Perubahan URL telah berhasil disimpan ke database",
        });
      }
    } catch (err) {
      console.error('Error saving URLs:', err);
      toast({
        title: "Data tersimpan di localStorage",
        description: "Terjadi kesalahan saat menyimpan URL. Data disimpan di localStorage saja.",
        variant: "default" // Changed from "warning" to "default"
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    urlGroups,
    loading,
    saving,
    handleUrlChange,
    saveUrlGroups
  };
};
