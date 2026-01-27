import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-callback-token',
};

// Map participant count to Rapatin product_id
const PARTICIPANT_TO_PRODUCT_ID: Record<number, number> = {
  100: 1,
  300: 2,
  500: 3,
  1000: 4,
};

// Generate 6 digit random passcode
function generatePasscode(): string {
  return Math.random().toString().slice(2, 8).padStart(6, '0');
}

// Login to Rapatin API and get access token
async function loginToRapatin(): Promise<string | null> {
  const email = Deno.env.get('RAPATIN_EMAIL');
  const password = Deno.env.get('RAPATIN_PASSWORD');

  if (!email || !password) {
    console.error("RAPATIN_EMAIL or RAPATIN_PASSWORD not configured");
    return null;
  }

  console.log("Attempting to login to Rapatin API...");

  try {
    const response = await fetch('https://api.rapatin.id/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        device: 'webhook',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Rapatin login failed:", response.status, errorText);
      return null;
    }

    const result = await response.json();
    
    if (result.response?.status === 'success' && result.data?.token) {
      console.log("Rapatin login successful");
      return result.data.token;
    }

    console.error("Rapatin login response missing token:", JSON.stringify(result));
    return null;
  } catch (error) {
    console.error("Rapatin login error:", error);
    return null;
  }
}

// Create schedule in Rapatin API
interface CreateScheduleParams {
  token: string;
  productId: number;
  topic: string;
  passcode: string;
  startDate: string;
  startTime: string;
}

interface RapatinScheduleResponse {
  id?: string;
  join_url?: string;
  passcode?: string;
  meeting_id?: string;
}

async function createRapatinSchedule(params: CreateScheduleParams): Promise<RapatinScheduleResponse | null> {
  console.log("Creating Rapatin schedule:", {
    productId: params.productId,
    topic: params.topic,
    startDate: params.startDate,
    startTime: params.startTime,
  });

  try {
    const response = await fetch('https://api.rapatin.id/schedules', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${params.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        product_id: params.productId,
        topic: params.topic,
        passcode: params.passcode,
        start_date: params.startDate,
        start_time: params.startTime,
        recurring: false,
        is_meeting_registration: false,
        is_meeting_qna: false,
        is_language_interpretation: false,
        is_mute_participant_upon_entry: false,
        is_req_permission_to_unmute_participants: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Rapatin create schedule failed:", response.status, errorText);
      return null;
    }

    const result = await response.json();
    console.log("Rapatin create schedule response:", JSON.stringify(result));

    if (result.data) {
      return {
        id: result.data.id?.toString(),
        join_url: result.data.join_url,
        passcode: result.data.passcode,
        meeting_id: result.data.meeting_id?.toString(),
      };
    }

    return null;
  } catch (error) {
    console.error("Rapatin create schedule error:", error);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify webhook token
    const webhookToken = req.headers.get('x-callback-token');
    const expectedToken = Deno.env.get('XENDIT_WEBHOOK_TOKEN');

    if (!expectedToken) {
      console.error("XENDIT_WEBHOOK_TOKEN not configured");
      return new Response(
        JSON.stringify({ error: 'Webhook not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (webhookToken !== expectedToken) {
      console.error("Invalid webhook token");
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload = await req.json();
    console.log("Received Xendit webhook:", JSON.stringify(payload));

    const { id, status, paid_at } = payload;

    if (!id) {
      console.error("Missing invoice id in webhook payload");
      return new Response(
        JSON.stringify({ error: 'Invalid payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find the order by xendit_invoice_id
    const { data: order, error: findError } = await supabase
      .from('guest_orders')
      .select('*')
      .eq('xendit_invoice_id', id)
      .single();

    if (findError || !order) {
      console.error("Order not found for invoice:", id, findError);
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for idempotency - don't process already paid orders
    if (order.payment_status === 'paid') {
      console.log("Order already processed:", order.id);
      return new Response(
        JSON.stringify({ success: true, message: 'Already processed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map Xendit status to our status
    let paymentStatus = 'pending';
    if (status === 'PAID' || status === 'SETTLED') {
      paymentStatus = 'paid';
    } else if (status === 'EXPIRED') {
      paymentStatus = 'expired';
    } else if (status === 'FAILED') {
      paymentStatus = 'failed';
    }

    console.log("Updating order status:", { orderId: order.id, status: paymentStatus });

    // Prepare update data
    const updateData: Record<string, unknown> = {
      payment_status: paymentStatus,
    };

    if (paymentStatus === 'paid' && paid_at) {
      updateData.paid_at = paid_at;
    }

    // If payment is successful, call Rapatin API to create meeting
    if (paymentStatus === 'paid') {
      console.log("Payment successful, calling Rapatin API to create meeting...");
      
      // Step 1: Login to Rapatin
      const rapatinToken = await loginToRapatin();
      
      if (rapatinToken) {
        // Step 2: Map participant count to product ID
        const productId = PARTICIPANT_TO_PRODUCT_ID[order.participant_count];
        
        if (productId) {
          // Step 3: Generate passcode and create schedule
          const passcode = generatePasscode();
          const meetingTime = order.meeting_time || '09:00'; // Default to 09:00 if not set
          
          const scheduleResult = await createRapatinSchedule({
            token: rapatinToken,
            productId,
            topic: `Quick Order - ${order.name}`,
            passcode,
            startDate: order.meeting_date,
            startTime: meetingTime,
          });

          if (scheduleResult) {
            // Step 4: Save Rapatin response to database
            updateData.rapatin_order_id = scheduleResult.id;
            updateData.zoom_link = scheduleResult.join_url;
            updateData.zoom_passcode = scheduleResult.passcode || passcode;
            updateData.meeting_id = scheduleResult.meeting_id;
            
            console.log("Rapatin schedule created successfully:", {
              rapatin_order_id: scheduleResult.id,
              meeting_id: scheduleResult.meeting_id,
              has_zoom_link: !!scheduleResult.join_url,
            });
          } else {
            console.error("Failed to create Rapatin schedule - order will be marked as paid but needs manual follow-up");
          }
        } else {
          console.error("Invalid participant count, cannot map to product ID:", order.participant_count);
        }
      } else {
        console.error("Failed to login to Rapatin API - order will be marked as paid but needs manual follow-up");
      }
    }

    const { error: updateError } = await supabase
      .from('guest_orders')
      .update(updateData)
      .eq('id', order.id);

    if (updateError) {
      console.error("Failed to update order:", updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Order updated successfully:", order.id, {
      payment_status: paymentStatus,
      has_zoom_link: !!updateData.zoom_link,
      has_rapatin_order_id: !!updateData.rapatin_order_id,
    });

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
