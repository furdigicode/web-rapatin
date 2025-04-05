
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
      
      // Try to insert default URL data
      for (const group of defaultUrlData) {
        const { error: insertError } = await supabase
          .from('urls')
          .upsert(group, {
            onConflict: 'id'
          });
          
        if (insertError) {
          console.error('Error inserting URL data:', insertError);
          // If we can't insert to Supabase, save to localStorage as fallback
          localStorage.setItem('urlData', JSON.stringify(defaultUrlData));
          return { 
            success: false, 
            message: 'Failed to initialize URL data in database. Using localStorage as fallback.' 
          };
        }
      }
      
      return { 
        success: true, 
        message: 'Default URL data initialized successfully in database' 
      };
    }
    
    return { success: true, message: 'URL data already exists' };
  } catch (err) {
    console.error('Error initializing URL data:', err);
    // Save to localStorage as fallback
    localStorage.setItem('urlData', JSON.stringify(defaultUrlData));
    return { 
      success: false, 
      message: 'Failed to initialize URL data in database. Using localStorage as fallback.' 
    };
  }
};

/**
 * Force initialization of URL data in Supabase from localStorage
 */
export const forceInitializeUrlData = async () => {
  try {
    // Get data from localStorage
    const savedData = localStorage.getItem('urlData');
    if (!savedData) {
      return { success: false, message: 'No URL data found in localStorage to initialize with' };
    }
    
    const parsedData = JSON.parse(savedData);
    let successCount = 0;
    
    // Insert data from localStorage to Supabase
    for (const group of parsedData) {
      const { error } = await supabase
        .from('urls')
        .upsert(group, {
          onConflict: 'id'
        });
        
      if (!error) {
        successCount++;
      }
    }
    
    if (successCount === parsedData.length) {
      return { success: true, message: 'Successfully initialized Supabase with localStorage data' };
    } else {
      return { 
        success: true, 
        message: `Partially initialized data: ${successCount}/${parsedData.length} groups` 
      };
    }
  } catch (err) {
    console.error('Error forcing URL data initialization:', err);
    return { success: false, message: 'Failed to force initialize URL data' };
  }
};
