
import { useEffect, useState } from 'react';
import { initializeUrlData, forceInitializeUrlData } from '@/integrations/supabase/initializeData';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

/**
 * Component that initializes admin-related data on mount
 * This is meant to be included in the admin layout
 */
const AdminInitializer = () => {
  const { toast } = useToast();
  const [initialized, setInitialized] = useState(false);
  const [showInitButton, setShowInitButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Check if the urls table is accessible and has data
        const { data, error } = await supabase
          .from('urls')
          .select('id')
          .limit(1);
          
        if (error || !data || data.length === 0) {
          // Show the force init button if the table is empty or inaccessible
          setShowInitButton(true);
          setShowAlert(true);
        }
        
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
        setShowInitButton(true);
        setShowAlert(true);
      }
    };

    initialize();
  }, [toast, initialized]);

  const handleForceInit = async () => {
    setLoading(true);
    try {
      const result = await forceInitializeUrlData();
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        setShowInitButton(false);
        setShowAlert(false);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error forcing initialization:", error);
      toast({
        title: "Error",
        description: "Failed to force initialization.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!showAlert && !showInitButton) {
    return null;
  }

  return (
    <>
      {showAlert && (
        <Alert variant="default" className="mb-4 border-amber-500">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              Database URLs table is empty. URL data is currently saved in your browser (localStorage).
            </span>
            {showInitButton && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleForceInit} 
                disabled={loading}
                className="ml-4"
              >
                {loading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                Initialize Database
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default AdminInitializer;
