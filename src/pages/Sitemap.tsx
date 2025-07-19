
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Sitemap = () => {
  const [sitemapContent, setSitemapContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('generate-sitemap');
        
        if (error) {
          throw error;
        }
        
        setSitemapContent(data);
      } catch (err) {
        console.error('Error fetching sitemap:', err);
        setError('Failed to generate sitemap');
      } finally {
        setLoading(false);
      }
    };

    fetchSitemap();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Generating Sitemap...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Generated Sitemap</h1>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {sitemapContent}
            </pre>
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Access the live sitemap at: 
              <a 
                href={`${window.location.origin}/functions/v1/generate-sitemap`}
                className="text-primary hover:underline ml-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                /functions/v1/generate-sitemap
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
