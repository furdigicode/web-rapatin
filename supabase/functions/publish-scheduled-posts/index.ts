import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Checking for scheduled posts to publish...');

    // Get all scheduled posts where published_at is in the past
    const now = new Date().toISOString();
    
    const { data: scheduledPosts, error: fetchError } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, cover_image, category, send_notification')
      .eq('status', 'scheduled')
      .lte('published_at', now);

    if (fetchError) {
      console.error('Error fetching scheduled posts:', fetchError);
      throw fetchError;
    }

    if (!scheduledPosts || scheduledPosts.length === 0) {
      console.log('No scheduled posts to publish');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No scheduled posts to publish',
          published: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${scheduledPosts.length} posts to publish`);

    // Update status to published for all matching posts
    const postIds = scheduledPosts.map(post => post.id);
    
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ status: 'published' })
      .in('id', postIds);

    if (updateError) {
      console.error('Error updating posts:', updateError);
      throw updateError;
    }

    // Create notifications for posts that have send_notification enabled
    // Note: The trigger handle_new_article_notification should handle this
    // But since we're updating status (not inserting), we need to manually create notifications
    const postsWithNotification = scheduledPosts.filter(post => post.send_notification);
    
    if (postsWithNotification.length > 0) {
      const notifications = postsWithNotification.map(post => ({
        blog_post_id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        image_url: post.cover_image,
        category: post.category,
        target_url: `https://rapatin.id/blog/${post.slug}`,
        notification_type: 'new_article'
      }));

      const { error: notifError } = await supabase
        .from('article_notifications')
        .insert(notifications);

      if (notifError) {
        console.error('Error creating notifications:', notifError);
        // Don't throw, just log - the posts are already published
      } else {
        console.log(`Created ${notifications.length} notifications`);
      }
    }

    const publishedTitles = scheduledPosts.map(p => p.title);
    console.log('Successfully published posts:', publishedTitles);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Published ${scheduledPosts.length} posts`,
        published: scheduledPosts.length,
        posts: publishedTitles
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in publish-scheduled-posts:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
