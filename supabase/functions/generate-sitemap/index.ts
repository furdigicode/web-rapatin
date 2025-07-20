
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    });
  }

  try {
    console.log('Starting sitemap generation...');
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch published blog posts
    const { data: blogPosts, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, created_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }

    console.log(`Found ${blogPosts?.length || 0} published blog posts`);

    // Generate sitemap XML - ensure no leading whitespace
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Build sitemap string without any leading whitespace
    const sitemapContent = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      '  <!-- Home Page -->',
      '  <url>',
      '    <loc>https://rapatin.id/</loc>',
      `    <lastmod>${currentDate}</lastmod>`,
      '    <changefreq>weekly</changefreq>',
      '    <priority>1.0</priority>',
      '  </url>',
      '  ',
      '  <!-- Feature Pages -->',
      '  <url>',
      '    <loc>https://rapatin.id/fitur/bayar-sesuai-pakai</loc>',
      `    <lastmod>${currentDate}</lastmod>`,
      '    <changefreq>monthly</changefreq>',
      '    <priority>0.8</priority>',
      '  </url>',
      '  <url>',
      '    <loc>https://rapatin.id/fitur/dashboard</loc>',
      `    <lastmod>${currentDate}</lastmod>`,
      '    <changefreq>monthly</changefreq>',
      '    <priority>0.8</priority>',
      '  </url>',
      '  <url>',
      '    <loc>https://rapatin.id/fitur/rekaman-cloud</loc>',
      `    <lastmod>${currentDate}</lastmod>`,
      '    <changefreq>monthly</changefreq>',
      '    <priority>0.8</priority>',
      '  </url>',
      '  <url>',
      '    <loc>https://rapatin.id/fitur/laporan-peserta</loc>',
      `    <lastmod>${currentDate}</lastmod>`,
      '    <changefreq>monthly</changefreq>',
      '    <priority>0.8</priority>',
      '  </url>',
      '  ',
      '  <!-- Blog Pages -->',
      '  <url>',
      '    <loc>https://rapatin.id/blog</loc>',
      `    <lastmod>${currentDate}</lastmod>`,
      '    <changefreq>weekly</changefreq>',
      '    <priority>0.8</priority>',
      '  </url>'
    ];

    // Add dynamic blog posts
    if (blogPosts && blogPosts.length > 0) {
      for (const post of blogPosts) {
        const lastmod = post.updated_at || post.created_at;
        const formattedDate = new Date(lastmod).toISOString().split('T')[0];
        
        // Escape any special characters in slug
        const escapedSlug = post.slug.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        sitemapContent.push(
          '  <url>',
          `    <loc>https://rapatin.id/blog/${escapedSlug}</loc>`,
          `    <lastmod>${formattedDate}</lastmod>`,
          '    <changefreq>monthly</changefreq>',
          '    <priority>0.7</priority>',
          '  </url>'
        );
      }
    }

    // Add company pages
    sitemapContent.push(
      '  ',
      '  <!-- Company Pages -->',
      '  <url>',
      '    <loc>https://rapatin.id/tentang-kami</loc>',
      `    <lastmod>${currentDate}</lastmod>`,
      '    <changefreq>monthly</changefreq>',
      '    <priority>0.7</priority>',
      '  </url>',
      '  <url>',
      '    <loc>https://rapatin.id/kontak</loc>',
      `    <lastmod>${currentDate}</lastmod>`,
      '    <changefreq>monthly</changefreq>',
      '    <priority>0.7</priority>',
      '  </url>',
      '  <url>',
      '    <loc>https://rapatin.id/faq</loc>',
      `    <lastmod>${currentDate}</lastmod>`,
      '    <changefreq>monthly</changefreq>',
      '    <priority>0.7</priority>',
      '  </url>',
      '  <url>',
      '    <loc>https://rapatin.id/syarat-ketentuan</loc>',
      `    <lastmod>${currentDate}</lastmod>`,
      '    <changefreq>monthly</changefreq>',
      '    <priority>0.5</priority>',
      '  </url>',
      '  <url>',
      '    <loc>https://rapatin.id/kebijakan-privasi</loc>',
      `    <lastmod>${currentDate}</lastmod>`,
      '    <changefreq>monthly</changefreq>',
      '    <priority>0.5</priority>',
      '  </url>',
      '  <url>',
      '    <loc>https://rapatin.id/menjadi-reseller</loc>',
      `    <lastmod>${currentDate}</lastmod>`,
      '    <changefreq>monthly</changefreq>',
      '    <priority>0.6</priority>',
      '  </url>',
      '</urlset>'
    );

    // Join all parts with newlines
    const sitemap = sitemapContent.join('\n');
    
    console.log('Sitemap generated successfully');
    console.log('First 200 characters:', sitemap.substring(0, 200));

    // Return XML response with proper headers
    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });

  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return fallback static sitemap on error
    const fallbackSitemap = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      '  <url>',
      '    <loc>https://rapatin.id/</loc>',
      `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>`,
      '    <changefreq>weekly</changefreq>',
      '    <priority>1.0</priority>',
      '  </url>',
      '  <url>',
      '    <loc>https://rapatin.id/blog</loc>',
      `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>`,
      '    <changefreq>weekly</changefreq>',
      '    <priority>0.8</priority>',
      '  </url>',
      '</urlset>'
    ].join('\n');

    return new Response(fallbackSitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes on error
      },
    });
  }
});
