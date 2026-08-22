import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { appendRapatinLog, parseMaybeJson } from "../_shared/rapatin-log.ts";


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PARTICIPANT_TO_PRODUCT_ID: Record<number, number> = {
  100: 1,
  300: 2,
  500: 3,
  1000: 4,
};

const RAPATIN_TOKEN_EXPIRY_DAYS = 7;
const RAPATIN_TIMEOUT_MS = 45_000;

function generatePasscode(): string {
  return Math.random().toString().slice(2, 8).padStart(6, '0');
}

async function loginToRapatin(): Promise<string | null> {
  const email = Deno.env.get('RAPATIN_EMAIL');
  const password = Deno.env.get('RAPATIN_PASSWORD');
  if (!email || !password) {
    console.error("RAPATIN_EMAIL or RAPATIN_PASSWORD not configured");
    return null;
  }
  try {
    const response = await fetch('https://api.rapatin.id/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email, password, device: 'regenerate' }),
      signal: AbortSignal.timeout(RAPATIN_TIMEOUT_MS),
    });
    if (!response.ok) {
      console.error("Rapatin login failed:", response.status, await response.text());
      return null;
    }
    const result = await response.json();
    if (result.response?.status === 'success' && result.data?.token) {
      return result.data.token;
    }
    console.error("Rapatin login response missing token:", JSON.stringify(result));
    return null;
  } catch (error) {
    console.error("Rapatin login error:", error);
    return null;
  }
}

async function getRapatinToken(supabase: SupabaseClient): Promise<string | null> {
  const { data: existingToken } = await supabase
    .from('rapatin_auth_tokens')
    .select('access_token, expires_at')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingToken?.access_token) {
    return existingToken.access_token;
  }

  const token = await loginToRapatin();
  if (!token) return null;

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + RAPATIN_TOKEN_EXPIRY_DAYS);
  await supabase.from('rapatin_auth_tokens').insert({
    access_token: token,
    expires_at: expiresAt.toISOString(),
  });
  return token;
}

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

async function createRapatinSchedule(
  params: CreateScheduleParams
): Promise<{ ok: true; data: RapatinScheduleResponse } | { ok: false; status: number | null; error: string }> {
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

  if (params.isRecurring && params.recurrenceType) {
    requestBody.recurrence = params.recurrenceType;
    requestBody.repeat_interval = params.repeatInterval || 1;
    if (params.recurrenceType === 2 && params.weeklyDays && params.weeklyDays.length > 0) {
      requestBody.weekly_days = params.weeklyDays;
    }
    if (params.recurrenceType === 3) {
      if (params.monthlyDay) requestBody.monthly_day = params.monthlyDay;
      else if (params.monthlyWeek) requestBody.monthly_week = params.monthlyWeek;
    }
    if (params.endType === 'end_date' && params.endDate) {
      requestBody.end_type = 'end_date';
      requestBody.end_date = params.endDate;
    } else if (params.endType === 'end_after_type' && params.endAfterCount) {
      requestBody.end_type = 'end_after_type';
      requestBody.end_after_type = params.endAfterCount;
    }
  }

  console.log("Rapatin regenerate request body:", JSON.stringify(requestBody));

  try {
    const response = await fetch('https://api.rapatin.id/schedules', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${params.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(RAPATIN_TIMEOUT_MS),
    });

    const rawText = await response.text();
    if (!response.ok) {
      console.error("Rapatin create schedule failed:", response.status, rawText);
      return { ok: false, status: response.status, error: rawText || `HTTP ${response.status}` };
    }

    let result: any;
    try { result = JSON.parse(rawText); } catch { result = null; }
    console.log("Rapatin response:", rawText);

    if (result?.data) {
      return {
        ok: true,
        data: {
          id: result.data.id?.toString(),
          join_url: result.data.join_url,
          passcode: result.data.passcode,
          meeting_id: result.data.meeting_id?.toString(),
        },
      };
    }
    return { ok: false, status: response.status, error: 'Response missing data field' };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Rapatin create schedule error:", msg);
    return { ok: false, status: null, error: msg };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { orderId, force } = await req.json();
    if (!orderId || typeof orderId !== 'string') {
      return new Response(
        JSON.stringify({ ok: false, error: 'orderId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: order, error: orderError } = await supabase
      .from('guest_orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (order.payment_status !== 'paid') {
      return new Response(
        JSON.stringify({ ok: false, error: 'Order belum berstatus paid' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (order.rapatin_order_id && !force) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Order sudah memiliki rapatin_order_id. Kirim force=true untuk timpa.' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const productId = PARTICIPANT_TO_PRODUCT_ID[order.participant_count];
    if (!productId) {
      return new Response(
        JSON.stringify({ ok: false, error: `Participant count ${order.participant_count} tidak dipetakan ke product_id` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = await getRapatinToken(supabase);
    if (!token) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Gagal login ke Rapatin API' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const passcode = order.custom_passcode || generatePasscode();
    const meetingTime = order.meeting_time || '09:00';
    const topic = order.meeting_topic || `Quick Order - ${order.name}`;

    const result = await createRapatinSchedule({
      token,
      productId,
      topic,
      passcode,
      startDate: order.meeting_date,
      startTime: meetingTime,
      isMeetingRegistration: order.is_meeting_registration || false,
      isMeetingQna: order.is_meeting_qna || false,
      isLanguageInterpretation: order.is_language_interpretation || false,
      isMuteUponEntry: order.is_mute_upon_entry || false,
      isReqUnmutePermission: order.is_req_unmute_permission || false,
      isRecurring: order.is_recurring || false,
      recurrenceType: order.recurrence_type,
      repeatInterval: order.repeat_interval,
      weeklyDays: order.weekly_days,
      monthlyDay: order.monthly_day,
      monthlyWeek: order.monthly_week,
      endType: order.end_type,
      endDate: order.recurrence_end_date,
      endAfterCount: order.recurrence_count,
    });

    if (!result.ok) {
      return new Response(
        JSON.stringify({ ok: false, error: result.error, rapatin_status: result.status }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { error: updateError } = await supabase
      .from('guest_orders')
      .update({
        rapatin_order_id: result.data.id,
        zoom_link: result.data.join_url,
        zoom_passcode: result.data.passcode || passcode,
        meeting_id: result.data.meeting_id,
      })
      .eq('id', orderId);

    if (updateError) {
      console.error("Failed to update order after regenerate:", updateError);
      return new Response(
        JSON.stringify({ ok: false, error: 'Rapatin sukses tapi gagal simpan ke DB: ' + updateError.message, data: result.data }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, data: result.data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("regenerate-rapatin-schedule error:", msg);
    return new Response(
      JSON.stringify({ ok: false, error: msg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
