
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SitemapXML = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        console.log('Fetching sitemap from edge function...');
        
        // Call the edge function directly
        const { data, error } = await supabase.functions.invoke('generate-sitemap');
        
        if (error) {
          console.error('Supabase function error:', error);
          throw error;
        }
        
        console.log('Sitemap fetched successfully, redirecting to raw XML...');
        
        // Redirect to the edge function URL directly for raw XML
        window.location.href = 'https://mepznzrijuoyvjcmkspf.supabase.co/functions/v1/generate-sitemap';
        
      } catch (err) {
        console.error('Error fetching sitemap:', err);
        
        // Create and serve fallback XML directly
        const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://rapatin.id/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://rapatin.id/blog</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

        // Create a blob with XML content
        const blob = new Blob([fallbackSitemap], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        window.location.href = url;
      }
    };

    fetchAndRedirect();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Redirecting to sitemap XML...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4 text-red-600">Sitemap Error</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <a 
            href="https://mepznzrijuoyvjcmkspf.supabase.co/functions/v1/generate-sitemap"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Try Direct Link
          </a>
        </div>
      </div>
    );
  }

  return null;
};

export default SitemapXML;
