import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const voting_id = url.searchParams.get('voting_id');
    const user_identifier = url.searchParams.get('user_identifier');

    if (!voting_id) {
      return new Response(
        JSON.stringify({ error: 'voting_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    console.log('Fetching voting results for:', voting_id);

    // Get voting details
    const { data: voting, error: votingError } = await supabase
      .from('votings')
      .select('*')
      .eq('id', voting_id)
      .single();

    if (votingError || !voting) {
      console.error('Voting not found:', votingError);
      return new Response(
        JSON.stringify({ error: 'Voting not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get options with vote counts
    const { data: options, error: optionsError } = await supabase
      .from('voting_options')
      .select('*')
      .eq('voting_id', voting_id)
      .order('option_order');

    if (optionsError) {
      console.error('Error fetching options:', optionsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch options' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate percentages
    const total_votes = voting.total_votes || 0;
    const optionsWithStats = options.map((option) => {
      const percentage = total_votes > 0 ? ((option.vote_count / total_votes) * 100).toFixed(2) : '0';
      return {
        ...option,
        percentage: parseFloat(percentage),
      };
    });

    // Check if user has voted
    let user_voted = false;
    let user_choices: string[] = [];

    if (user_identifier) {
      const { data: userVotes } = await supabase
        .from('voting_responses')
        .select('option_id')
        .eq('voting_id', voting_id)
        .eq('user_identifier', user_identifier);

      if (userVotes && userVotes.length > 0) {
        user_voted = true;
        user_choices = userVotes.map((v) => v.option_id);
      }
    }

    const results = {
      voting,
      options: optionsWithStats,
      total_votes,
      user_voted,
      user_choices,
    };

    console.log('Results fetched successfully');

    return new Response(
      JSON.stringify(results),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in get-voting-results:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
