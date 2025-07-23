
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SitemapXML = () => {
  const [xmlContent, setXmlContent] = useState<string>('');
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
        
        // Set the XML content
        setXmlContent(data);
        setLoading(false);
        
        // Set the document content type to XML
        document.contentType = 'application/xml';
        
        // Replace the entire document with XML content
        setTimeout(() => {
          document.open();
          document.write(data);
          document.close();
        }, 100);
        
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
    <loc>https://rapatin.id/sewa-zoom-harian</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://rapatin.id/blog</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

        setXmlContent(fallbackSitemap);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
        
        // Replace document with fallback XML
        setTimeout(() => {
          document.open();
          document.write(fallbackSitemap);
          document.close();
        }, 100);
      }
    };

    fetchSitemap();
  }, []);

  // This component should not render anything visible since we're replacing the document
  if (loading) {
    return null;
  }

  if (error) {
    return null;
  }

  return null;
};

export default SitemapXML;
