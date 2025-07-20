
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SitemapXML = () => {
  const [sitemapContent, setSitemapContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        console.log('Fetching sitemap from edge function...');
        
        // Call the edge function directly
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
        
        // Fallback to static content
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
        setSitemapContent(fallbackSitemap);
      } finally {
        setLoading(false);
      }
    };

    fetchSitemap();
  }, []);

  // Set the correct content type for XML
  useEffect(() => {
    if (sitemapContent && !loading) {
      document.documentElement.style.whiteSpace = 'pre';
      document.head.innerHTML = '<meta charset="UTF-8"><title>Sitemap</title>';
      document.body.innerHTML = `<pre>${sitemapContent}</pre>`;
      
      // Note: Cannot set content type from client-side
    }
  }, [sitemapContent, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Generating sitemap...</p>
        </div>
      </div>
    );
  }

  if (error && !sitemapContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4 text-red-600">Sitemap Error</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  // Return raw XML content
  return (
    <div style={{ whiteSpace: 'pre', fontFamily: 'monospace', padding: '20px' }}>
      {sitemapContent}
    </div>
  );
};

export default SitemapXML;
