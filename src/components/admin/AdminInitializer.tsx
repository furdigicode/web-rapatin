
import { useEffect, useState } from 'react';
import { initializeUrlData } from '@/integrations/supabase/initializeData';
import { useToast } from '@/hooks/use-toast';

/**
 * Component that initializes admin-related data on mount
 * This is meant to be included in the admin layout
 */
const AdminInitializer = () => {
  const { toast } = useToast();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize URL data if needed
        const result = await initializeUrlData();
        
        if (result.success && !initialized) {
          setInitialized(true);
          if (result.message.includes('initialized')) {
            toast({
              title: "Database initialized",
              description: "Default URL data has been set up.",
            });
          }
        }
      } catch (error) {
        console.error("Error initializing admin data:", error);
      }
    };

    initialize();
  }, [toast, initialized]);

  // This component doesn't render anything
  return null;
};

export default AdminInitializer;
