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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { popupId, interactionType } = await req.json();

    if (!popupId || !interactionType) {
      return new Response(
        JSON.stringify({ error: 'popupId and interactionType are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Tracking popup interaction:', { popupId, interactionType });

    let updateField: string;
    if (interactionType === 'view') {
      updateField = 'popup_view_count';
    } else if (interactionType === 'click') {
      updateField = 'popup_click_count';
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid interactionType. Must be "view" or "click"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Increment the counter using raw SQL for atomic update
    const { error } = await supabase.rpc('increment_popup_counter', {
      popup_id: popupId,
      counter_field: updateField
    });

    // If RPC doesn't exist, fallback to direct update
    if (error && error.message.includes('function')) {
      // Get current count and increment
      const { data: currentPopup, error: fetchError } = await supabase
        .from('article_notifications')
        .select(updateField)
        .eq('id', popupId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      const currentCount = (currentPopup as Record<string, number>)?.[updateField] || 0;
      
      const { error: updateError } = await supabase
        .from('article_notifications')
        .update({ [updateField]: currentCount + 1 })
        .eq('id', popupId);

      if (updateError) {
        throw updateError;
      }
    } else if (error) {
      throw error;
    }

    console.log(`Successfully incremented ${updateField} for popup ${popupId}`);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error tracking popup interaction:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to track interaction',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});