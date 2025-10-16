import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VoteRequest {
  voting_id: string;
  option_ids: string[];
  user_identifier: string;
  user_email?: string;
  user_name?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { voting_id, option_ids, user_identifier, user_email, user_name }: VoteRequest = await req.json();

    console.log('Submit vote request:', { voting_id, option_ids, user_identifier });

    // Validate input
    if (!voting_id || !option_ids || option_ids.length === 0 || !user_identifier) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

    // Check if voting is active
    if (voting.status !== 'active') {
      return new Response(
        JSON.stringify({ error: 'Voting is not active' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check date range
    const now = new Date();
    if (voting.start_date && new Date(voting.start_date) > now) {
      return new Response(
        JSON.stringify({ error: 'Voting has not started yet' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (voting.end_date && new Date(voting.end_date) < now) {
      return new Response(
        JSON.stringify({ error: 'Voting has ended' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate user data if anonymous voting is not allowed
    if (!voting.allow_anonymous) {
      if (!user_name || !user_email) {
        return new Response(
          JSON.stringify({ error: 'Nama dan email wajib diisi' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user_email)) {
        return new Response(
          JSON.stringify({ error: 'Format email tidak valid' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Check for duplicate vote
    const { data: existingVotes } = await supabase
      .from('voting_responses')
      .select('id')
      .eq('voting_id', voting_id)
      .eq('user_identifier', user_identifier);

    if (existingVotes && existingVotes.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Anda sudah pernah vote sebelumnya' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate voting type
    if (voting.voting_type === 'single' && option_ids.length !== 1) {
      return new Response(
        JSON.stringify({ error: 'Single choice voting allows only one option' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (voting.voting_type === 'multiple' && voting.max_selections && option_ids.length > voting.max_selections) {
      return new Response(
        JSON.stringify({ error: `Maximum ${voting.max_selections} selections allowed` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert votes
    const responses = option_ids.map((option_id) => ({
      voting_id,
      option_id,
      user_identifier,
      user_email: user_email || null,
      user_name: user_name || null,
      metadata: {
        user_agent: req.headers.get('user-agent'),
        timestamp: new Date().toISOString(),
      },
    }));

    const { error: insertError } = await supabase
      .from('voting_responses')
      .insert(responses);

    if (insertError) {
      console.error('Error inserting votes:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to submit vote' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Vote submitted successfully');

    return new Response(
      JSON.stringify({ success: true, message: 'Vote submitted successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in submit-vote:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
