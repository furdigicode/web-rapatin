import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse query parameters
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const categories = url.searchParams.get('categories');

    console.log('Fetching notifications with params:', { limit, categories });

    // Build query with left join to get blog post slug (includes custom notifications)
    let query = supabase
      .from('article_notifications')
      .select(`
        *,
        blog_posts(slug)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    // Filter by categories if provided
    if (categories) {
      const categoryList = categories.split(',').map(c => c.trim()).filter(c => c);
      if (categoryList.length > 0) {
        query = query.in('category', categoryList);
      }
    }

    const { data: notifications, error } = await query;

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Fetched notifications:', notifications?.length || 0);

    return new Response(JSON.stringify(notifications || []), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });

  } catch (error) {
    console.error('Error in get-notifications function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch notifications',
        details: error.message 
      }), 
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );
  }
});