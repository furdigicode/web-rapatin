import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

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

// Token expiry duration in days (7 days as safe default)
const RAPATIN_TOKEN_EXPIRY_DAYS = 7;

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

// Get Rapatin token with caching
async function getRapatinToken(supabase: SupabaseClient): Promise<string | null> {
  // 1. Check for valid cached token
  const { data: existingToken, error: fetchError } = await supabase
    .from('rapatin_auth_tokens')
    .select('access_token, expires_at')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fetchError) {
    console.error("Error fetching cached Rapatin token:", fetchError);
  }

  if (existingToken?.access_token) {
    console.log("Using cached Rapatin token (expires:", existingToken.expires_at, ")");
    return existingToken.access_token;
  }

  // 2. No valid token, perform fresh login
  console.log("No valid cached token, logging in to Rapatin...");
  const token = await loginToRapatin();

  if (!token) {
    return null;
  }

  // 3. Save new token with expiry
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + RAPATIN_TOKEN_EXPIRY_DAYS);

  const { error: insertError } = await supabase
    .from('rapatin_auth_tokens')
    .insert({
      access_token: token,
      expires_at: expiresAt.toISOString()
    });

  if (insertError) {
    console.error("Failed to cache Rapatin token:", insertError);
    // Continue anyway - token is still valid for this request
  } else {
    console.log("Rapatin token cached, expires:", expiresAt.toISOString());
  }

  // 4. Cleanup old expired tokens (non-blocking)
  supabase
    .from('rapatin_auth_tokens')
    .delete()
    .lt('expires_at', new Date().toISOString())
    .then(({ error }) => {
      if (error) {
        console.error("Failed to cleanup old Rapatin tokens:", error);
      } else {
        console.log("Old Rapatin tokens cleaned up");
      }
    });

  return token;
}

// Order type with recurring fields
interface GuestOrder {
  id: string;
  participant_count: number;
  custom_passcode: string | null;
  meeting_date: string;
  meeting_time: string | null;
  meeting_topic: string | null;
  name: string;
  is_meeting_registration: boolean | null;
  is_meeting_qna: boolean | null;
  is_language_interpretation: boolean | null;
  is_mute_upon_entry: boolean | null;
  is_req_unmute_permission: boolean | null;
  // Recurring fields
  is_recurring: boolean | null;
  recurrence_type: number | null;
  repeat_interval: number | null;
  weekly_days: number[] | null;
  monthly_day: number | null;
  monthly_week: number | null;
  end_type: string | null;
  recurrence_end_date: string | null;
  recurrence_count: number | null;
  total_days: number | null;
}

// Create schedule in Rapatin API
interface CreateScheduleParams {
  token: string;
  productId: number;
  topic: string;
  passcode: string;
  startDate: string;
  startTime: string;
  isMeetingRegistration: boolean;
  isMeetingQna: boolean;
  isLanguageInterpretation: boolean;
  isMuteUponEntry: boolean;
  isReqUnmutePermission: boolean;
  // Recurring params
  isRecurring: boolean;
  recurrenceType?: number | null;
  repeatInterval?: number | null;
  weeklyDays?: number[] | null;
  monthlyDay?: number | null;
  monthlyWeek?: number | null;
  endType?: string | null;
  endDate?: string | null;
  endAfterCount?: number | null;
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
    isRecurring: params.isRecurring,
    recurrenceType: params.recurrenceType,
    repeatInterval: params.repeatInterval,
  });

  try {
    // Build request body
    const requestBody: Record<string, unknown> = {
      product_id: params.productId,
      topic: params.topic,
      passcode: params.passcode,
      start_date: params.startDate,
      start_time: params.startTime,
      recurring: params.isRecurring,
      is_meeting_registration: params.isMeetingRegistration,
      is_meeting_qna: params.isMeetingQna,
      is_language_interpretation: params.isLanguageInterpretation,
      is_mute_participant_upon_entry: params.isMuteUponEntry,
      is_req_permission_to_unmute_participants: params.isReqUnmutePermission,
    };

    // Add recurring parameters if enabled
    if (params.isRecurring && params.recurrenceType) {
      requestBody.recurrence = params.recurrenceType;
      requestBody.repeat_interval = params.repeatInterval || 1;

      // Weekly days
      if (params.recurrenceType === 2 && params.weeklyDays && params.weeklyDays.length > 0) {
        requestBody.weekly_days = params.weeklyDays;
      }

      // Monthly options
      if (params.recurrenceType === 3) {
        if (params.monthlyDay) {
          requestBody.monthly_day = params.monthlyDay;
        } else if (params.monthlyWeek) {
          requestBody.monthly_week = params.monthlyWeek;
        }
      }

      // End type
      if (params.endType === 'end_date' && params.endDate) {
        requestBody.end_type = 'end_date';
        requestBody.end_date = params.endDate;
      } else if (params.endType === 'end_after_type' && params.endAfterCount) {
        requestBody.end_type = 'end_after_type';
        requestBody.end_after_type = params.endAfterCount;
      }
    }

    console.log("Rapatin API request body:", JSON.stringify(requestBody));

    const response = await fetch('https://api.rapatin.id/schedules', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${params.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
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

    // Detect if this is Sessions API v3 (has 'event' and 'data' fields) or Invoice API v2
    const isSessionsApi = payload.event && payload.data;
    
    let sessionId: string;
    let status: string;
    let paidAt: string | null = null;

    if (isSessionsApi) {
      // Sessions API v3 format
      const { event, data } = payload;
      console.log("Detected Sessions API v3 format, event:", event);
      
    // Handle payment.capture event for payment method info
    if (event === 'payment.capture') {
      console.log("Processing payment.capture event for payment method");
      
      const referenceId = data.reference_id;
      if (!referenceId) {
        console.log("No reference_id in payment.capture, skipping");
        return new Response(
          JSON.stringify({ success: true, message: 'Skipped - no reference_id' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Build payment method string
      let paymentMethod = data.channel_code || 'Unknown';
      if (data.payment_details?.issuer_name) {
        paymentMethod = `${data.channel_code} (${data.payment_details.issuer_name})`;
      }
      
      console.log("Updating payment method:", { referenceId, paymentMethod });
      
      // Initialize Supabase client
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Find and update order by xendit_reference_id
      const { error: updateError, data: updateResult } = await supabase
        .from('guest_orders')
        .update({ payment_method: paymentMethod })
        .eq('xendit_reference_id', referenceId)
        .select('id');
      
      if (updateError) {
        console.error("Failed to update payment method:", updateError);
      } else if (updateResult && updateResult.length > 0) {
        console.log("Payment method updated for order:", updateResult[0].id);
      } else {
        console.log("No order found for reference_id:", referenceId);
      }
      
      return new Response(
        JSON.stringify({ success: true, message: 'Payment method processed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Handle payment_request.expiry event (Session expiry via reference_id)
    if (event === 'payment_request.expiry') {
      console.log("Processing payment_request.expiry event");
      
      const referenceId = data.reference_id;
      if (!referenceId) {
        console.error("No reference_id in payment_request.expiry");
        return new Response(
          JSON.stringify({ error: 'Missing reference_id' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Initialize Supabase client
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Find order by xendit_reference_id
      const { data: order, error: findError } = await supabase
        .from('guest_orders')
        .select('id, payment_status')
        .eq('xendit_reference_id', referenceId)
        .maybeSingle();
      
      if (findError) {
        console.error("Error finding order:", findError);
        return new Response(
          JSON.stringify({ error: 'Database error' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (!order) {
        console.log("Order not found for reference_id:", referenceId);
        return new Response(
          JSON.stringify({ success: true, message: 'Order not found - might be test' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Don't update if already paid (idempotency)
      if (order.payment_status === 'paid') {
        console.log("Order already paid, skipping expiry update:", order.id);
        return new Response(
          JSON.stringify({ success: true, message: 'Already paid' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Update to expired
      const { error: updateError } = await supabase
        .from('guest_orders')
        .update({ 
          payment_status: 'expired',
          expired_at: data.updated || new Date().toISOString()
        })
        .eq('id', order.id);
      
      if (updateError) {
        console.error("Failed to update order to expired:", updateError);
        return new Response(
          JSON.stringify({ error: 'Update failed' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log("Order marked as expired:", order.id);
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
      
      sessionId = data.payment_session_id;
      status = data.status;
      paidAt = data.updated;
      
      // Log event type for debugging
      if (event === 'payment_session.completed') {
        console.log("Processing payment_session.completed event");
      } else if (event === 'payment_session.expired') {
        console.log("Processing payment_session.expired event");
        status = 'EXPIRED';
      } else if (event === 'payment_session.failed') {
        console.log("Processing payment_session.failed event");
        status = 'FAILED';
      } else {
        console.log("Unknown session event:", event);
      }
    } else {
      // Legacy Invoice API v2 format (backward compatibility)
      console.log("Detected Invoice API v2 format (legacy)");
      sessionId = payload.id;
      status = payload.status;
      paidAt = payload.paid_at;
    }

    if (!sessionId) {
      console.error("Missing session/invoice id in webhook payload");
      return new Response(
        JSON.stringify({ error: 'Invalid payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Extracted webhook data:", { sessionId, status, paidAt });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find the order by xendit_invoice_id (stores payment_session_id for v3)
    const { data: order, error: findError } = await supabase
      .from('guest_orders')
      .select('*')
      .eq('xendit_invoice_id', sessionId)
      .single();

    if (findError || !order) {
      console.error("Order not found for session/invoice:", sessionId, findError);
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
    // Sessions API v3: COMPLETED, EXPIRED, FAILED
    // Invoice API v2: PAID, SETTLED, EXPIRED, FAILED
    let paymentStatus = 'pending';
    if (status === 'COMPLETED' || status === 'PAID' || status === 'SETTLED') {
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

    if (paymentStatus === 'paid' && paidAt) {
      updateData.paid_at = paidAt;
    } else if (paymentStatus === 'paid') {
      updateData.paid_at = new Date().toISOString();
    }

    // If payment is successful, call Rapatin API to create meeting
    if (paymentStatus === 'paid') {
      console.log("Payment successful, calling Rapatin API to create meeting...", {
        is_recurring: order.is_recurring,
        total_days: order.total_days,
      });
      
      // Cast order to our type
      const typedOrder = order as GuestOrder;
      
      // Step 1: Get Rapatin token (with caching)
      const rapatinToken = await getRapatinToken(supabase);
      
      if (rapatinToken) {
        // Step 2: Map participant count to product ID
        const productId = PARTICIPANT_TO_PRODUCT_ID[typedOrder.participant_count];
        
        if (productId) {
          // Step 3: Use custom passcode or generate one
          const passcode = typedOrder.custom_passcode || generatePasscode();
          const meetingTime = typedOrder.meeting_time || '09:00'; // Default to 09:00 if not set
          const topic = typedOrder.meeting_topic || `Quick Order - ${typedOrder.name}`;
          
          const scheduleResult = await createRapatinSchedule({
            token: rapatinToken,
            productId,
            topic,
            passcode,
            startDate: typedOrder.meeting_date,
            startTime: meetingTime,
            isMeetingRegistration: typedOrder.is_meeting_registration || false,
            isMeetingQna: typedOrder.is_meeting_qna || false,
            isLanguageInterpretation: typedOrder.is_language_interpretation || false,
            isMuteUponEntry: typedOrder.is_mute_upon_entry || false,
            isReqUnmutePermission: typedOrder.is_req_unmute_permission || false,
            // Recurring params
            isRecurring: typedOrder.is_recurring || false,
            recurrenceType: typedOrder.recurrence_type,
            repeatInterval: typedOrder.repeat_interval,
            weeklyDays: typedOrder.weekly_days,
            monthlyDay: typedOrder.monthly_day,
            monthlyWeek: typedOrder.monthly_week,
            endType: typedOrder.end_type,
            endDate: typedOrder.recurrence_end_date,
            endAfterCount: typedOrder.recurrence_count,
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
              is_recurring: typedOrder.is_recurring,
            });
          } else {
            console.error("Failed to create Rapatin schedule - order will be marked as paid but needs manual follow-up");
          }
        } else {
          console.error("Invalid participant count, cannot map to product ID:", typedOrder.participant_count);
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

    // Trigger Kledo sync for paid orders (non-blocking)
    if (paymentStatus === 'paid') {
      console.log("Triggering Kledo sync for order:", order.id);
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
        
        // Fire and forget - don't await
        fetch(`${supabaseUrl}/functions/v1/kledo-sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({ orderId: order.id }),
        }).then(res => {
          console.log("Kledo sync triggered, response status:", res.status);
        }).catch(err => {
          console.error("Failed to trigger Kledo sync:", err);
        });
      } catch (kledoError) {
        console.error("Error triggering Kledo sync:", kledoError);
        // Don't fail the webhook - Kledo sync can be retried manually
      }
    }

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
