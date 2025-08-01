
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Sitemap = () => {
  const [sitemapContent, setSitemapContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        console.log('Fetching sitemap from edge function...');
        const { data, error } = await supabase.functions.invoke('generate-sitemap');
        
        if (error) {
          console.error('Supabase function error:', error);
          throw error;
        }
        
        console.log('Sitemap fetched successfully');
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
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const directSupabaseUrl = `https://mepznzrijuoyvjcmkspf.supabase.co/functions/v1/generate-sitemap`;
  const websiteUrl = `https://rapatin.id/sitemap.xml`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Dynamic Sitemap Generator</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Sitemap Information</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Automatically includes all published blog posts</p>
              <p>• Updates in real-time when new articles are published</p>
              <p>• Includes proper lastmod dates for SEO optimization</p>
              <p>• Cached for 1 hour for better performance</p>
              <p>• Accessible via both direct Supabase URL and website URL</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Generated Sitemap XML</h2>
            <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded overflow-auto max-h-96 font-mono">
              {sitemapContent}
            </pre>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Access Links</h2>
            <div className="space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website Sitemap URL (Recommended for Google Search Console):
                </label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="text" 
                    value={websiteUrl}
                    readOnly 
                    className="flex-1 p-2 border border-gray-300 rounded text-sm font-mono"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(websiteUrl)}
                    className="bg-primary text-white px-3 py-2 rounded text-sm hover:bg-primary/90"
                  >
                    Copy
                  </button>
                  <a 
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
                  >
                    Open
                  </a>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Direct Supabase URL (For testing):
                </label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="text" 
                    value={directSupabaseUrl}
                    readOnly 
                    className="flex-1 p-2 border border-gray-300 rounded text-sm font-mono"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(directSupabaseUrl)}
                    className="bg-primary text-white px-3 py-2 rounded text-sm hover:bg-primary/90"
                  >
                    Copy
                  </button>
                  <a 
                    href={directSupabaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                  >
                    Test Direct
                  </a>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded">
                <p className="mb-2"><strong>Untuk Google Search Console:</strong></p>
                <p className="mb-2">Gunakan URL website (<code>https://rapatin.id/sitemap.xml</code>) untuk submit ke Google Search Console.</p>
                <p><strong>Untuk Testing:</strong> Gunakan URL Supabase langsung untuk memastikan edge function berjalan dengan baik.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
