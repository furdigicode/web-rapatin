
import { supabase } from "./client";
import { Urls } from "@/types/supabase";

// Default URL data if nothing is loaded
const defaultUrlData: Urls[] = [
  {
    id: "1",
    title: "Hero Section",
    items: [
      {
        label: "Mulai Menjadwalkan",
        description: "Tombol CTA utama di hero section",
        url: "https://app.rapatin.id/register"
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
        url: "https://app.rapatin.id/register"
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
        url: "https://app.rapatin.id/login"
      },
      {
        label: "Daftar",
        description: "Tombol register di navbar",
        url: "https://app.rapatin.id/register"
      }
    ]
  }
];

/**
 * Initialize the URLs table with default data if empty
 */
export const initializeUrlData = async () => {
  try {
    // Check if data exists
    const { data, error } = await supabase
      .from('urls')
      .select('id')
      .limit(1);
    
    // If there's no data, initialize with defaults
    if ((!data || data.length === 0) || error) {
      console.log('Initializing URL data with defaults...');
      
      // Insert default URL data
      for (const group of defaultUrlData) {
        await supabase
          .from('urls')
          .upsert(group, {
            onConflict: 'id'
          });
      }
      
      return { success: true, message: 'Default URL data initialized successfully' };
    }
    
    return { success: true, message: 'URL data already exists' };
  } catch (err) {
    console.error('Error initializing URL data:', err);
    return { success: false, message: 'Failed to initialize URL data' };
  }
};
