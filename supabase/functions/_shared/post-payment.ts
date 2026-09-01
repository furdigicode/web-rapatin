// Shared post-payment pipeline used by both xendit-webhook and duitku-callback.
// Creates the Rapatin schedule, persists the result on the order, and triggers
// confirmation email, Kledo sync and admin WhatsApp notification in background.
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { appendRapatinLog, parseMaybeJson } from "./rapatin-log.ts";

// Map participant count to Rapatin product_id
export const PARTICIPANT_TO_PRODUCT_ID: Record<number, number> = {
  100: 1,
  300: 2,
  500: 3,
  1000: 4,
};

// Token expiry duration in days (7 days as safe default)
const RAPATIN_TOKEN_EXPIRY_DAYS = 7;

// Generate 6 digit random passcode
export function generatePasscode(): string {
  return Math.random().toString().slice(2, 8).padStart(6, '0');
}

// Order type with recurring fields
export interface GuestOrder {
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

// Login to Rapatin API and get access token
export async function loginToRapatin(
  source: string,
  supabase?: SupabaseClient,
  orderId?: string | null,
): Promise<string | null> {
  const email = Deno.env.get('RAPATIN_EMAIL');
  const password = Deno.env.get('RAPATIN_PASSWORD');

  if (!email || !password) {
    console.error("RAPATIN_EMAIL or RAPATIN_PASSWORD not configured");
    if (supabase) {
      await appendRapatinLog(supabase, orderId, {
        action: 'login',
        source,
        ok: false,
        error: 'RAPATIN_EMAIL or RAPATIN_PASSWORD not configured',
      });
    }
    return null;
  }

  console.log("Attempting to login to Rapatin API...");
  const startedAt = Date.now();

  try {
    const response = await fetch('https://api.rapatin.id/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password, device: 'webhook' }),
    });

    const rawText = await response.text();
    const parsed = parseMaybeJson(rawText);

    if (!response.ok) {
      console.error("Rapatin login failed:", response.status, rawText);
      if (supabase) {
        await appendRapatinLog(supabase, orderId, {
          action: 'login',
          source,
          ok: false,
          status: response.status,
          response: parsed,
          error: `HTTP ${response.status}`,
          duration_ms: Date.now() - startedAt,
        });
      }
      return null;
    }

    // deno-lint-ignore no-explicit-any
    const result = parsed as any;

    if (result?.response?.status === 'success' && result?.data?.token) {
      console.log("Rapatin login successful");
      if (supabase) {
        await appendRapatinLog(supabase, orderId, {
          action: 'login',
          source,
          ok: true,
          status: response.status,
          response: { response: result.response, data: { token: '[redacted]' } },
          duration_ms: Date.now() - startedAt,
        });
      }
      return result.data.token;
    }

    console.error("Rapatin login response missing token:", rawText);
    if (supabase) {
      await appendRapatinLog(supabase, orderId, {
        action: 'login',
        source,
        ok: false,
        status: response.status,
        response: parsed,
        error: 'Response missing token',
        duration_ms: Date.now() - startedAt,
      });
    }
    return null;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Rapatin login error:", msg);
    if (supabase) {
      await appendRapatinLog(supabase, orderId, {
        action: 'login',
        source,
        ok: false,
        error: msg,
        duration_ms: Date.now() - startedAt,
      });
    }
    return null;
  }
}

// Get Rapatin token with caching
export async function getRapatinToken(
  supabase: SupabaseClient,
  source: string,
  orderId?: string | null,
): Promise<string | null> {
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

  console.log("No valid cached token, logging in to Rapatin...");
  const token = await loginToRapatin(source, supabase, orderId);

  if (!token) return null;

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + RAPATIN_TOKEN_EXPIRY_DAYS);

  const { error: insertError } = await supabase
    .from('rapatin_auth_tokens')
    .insert({ access_token: token, expires_at: expiresAt.toISOString() });

  if (insertError) {
    console.error("Failed to cache Rapatin token:", insertError);
  } else {
    console.log("Rapatin token cached, expires:", expiresAt.toISOString());
  }

  supabase
    .from('rapatin_auth_tokens')
    .delete()
    .lt('expires_at', new Date().toISOString())
    .then(({ error }: { error: unknown }) => {
      if (error) {
        console.error("Failed to cleanup old Rapatin tokens:", error);
      } else {
        console.log("Old Rapatin tokens cleaned up");
      }
    });

  return token;
}

export interface CreateScheduleParams {
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

export interface RapatinScheduleResponse {
  id?: string;
  join_url?: string;
  passcode?: string;
  meeting_id?: string;
}

export async function createRapatinSchedule(
  params: CreateScheduleParams,
  source: string,
  supabase?: SupabaseClient,
  orderId?: string | null,
): Promise<RapatinScheduleResponse | null> {
  console.log("Creating Rapatin schedule:", {
    productId: params.productId,
    topic: params.topic,
    startDate: params.startDate,
    startTime: params.startTime,
    isRecurring: params.isRecurring,
    recurrenceType: params.recurrenceType,
    repeatInterval: params.repeatInterval,
  });

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
      if (params.monthlyDay) {
        requestBody.monthly_day = params.monthlyDay;
      } else if (params.monthlyWeek) {
        requestBody.monthly_week = params.monthlyWeek;
      }
    }

    if (params.endType === 'end_date' && params.endDate) {
      requestBody.end_type = 'end_date';
      requestBody.end_date = params.endDate;
    } else if (params.endType === 'end_after_type' && params.endAfterCount) {
      requestBody.end_type = 'end_after_type';
      requestBody.end_after_type = params.endAfterCount;
    }
  }

  console.log("Rapatin API request body:", JSON.stringify(requestBody));

  try {
    const startedAt = Date.now();

    const response = await fetch('https://api.rapatin.id/schedules', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${params.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const rawText = await response.text();
    const parsed = parseMaybeJson(rawText);

    if (!response.ok) {
      console.error("Rapatin create schedule failed:", response.status, rawText);
      if (supabase) {
        await appendRapatinLog(supabase, orderId, {
          action: 'create_schedule',
          source,
          ok: false,
          status: response.status,
          request: requestBody,
          response: parsed,
          error: `HTTP ${response.status}`,
          duration_ms: Date.now() - startedAt,
        });
      }
      return null;
    }

    // deno-lint-ignore no-explicit-any
    const result = parsed as any;
    console.log("Rapatin create schedule response:", rawText);

    if (result?.data) {
      if (supabase) {
        await appendRapatinLog(supabase, orderId, {
          action: 'create_schedule',
          source,
          ok: true,
          status: response.status,
          request: requestBody,
          response: parsed,
          duration_ms: Date.now() - startedAt,
        });
      }
      return {
        id: result.data.id?.toString(),
        join_url: result.data.join_url,
        passcode: result.data.passcode,
        meeting_id: result.data.meeting_id?.toString(),
      };
    }

    if (supabase) {
      await appendRapatinLog(supabase, orderId, {
        action: 'create_schedule',
        source,
        ok: false,
        status: response.status,
        request: requestBody,
        response: parsed,
        error: 'Response missing data field',
        duration_ms: Date.now() - startedAt,
      });
    }
    return null;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Rapatin create schedule error:", msg);
    if (supabase) {
      await appendRapatinLog(supabase, orderId, {
        action: 'create_schedule',
        source,
        ok: false,
        request: requestBody,
        error: msg,
      });
    }
    return null;
  }
}

function runBackground(task: Promise<unknown>) {
  try {
    // deno-lint-ignore no-explicit-any
    const rt = (globalThis as any).EdgeRuntime;
    if (rt?.waitUntil) rt.waitUntil(task);
  } catch (_e) {
    // ignore - task still runs best-effort
  }
}

/**
 * Full post-payment pipeline shared by all payment gateways.
 * - Creates the Rapatin schedule (when possible)
 * - Persists payment status + meeting data on the order
 * - Triggers confirmation email, Kledo sync and admin WhatsApp notification
 */
export async function processPaidOrder(
  supabase: SupabaseClient,
  // deno-lint-ignore no-explicit-any
  order: any,
  options: {
    source: string;
    paidAt?: string | null;
    extraUpdate?: Record<string, unknown>;
  },
): Promise<{ ok: boolean; error?: string; hasZoomLink: boolean }> {
  const { source, paidAt, extraUpdate } = options;

  const updateData: Record<string, unknown> = {
    payment_status: 'paid',
    paid_at: paidAt || new Date().toISOString(),
    ...(extraUpdate || {}),
  };

  console.log("Payment successful, calling Rapatin API to create meeting...", {
    source,
    is_recurring: order.is_recurring,
    total_days: order.total_days,
  });

  const typedOrder = order as GuestOrder;

  const rapatinToken = await getRapatinToken(supabase, source, order.id);

  if (rapatinToken) {
    const productId = PARTICIPANT_TO_PRODUCT_ID[typedOrder.participant_count];

    if (productId) {
      const passcode = typedOrder.custom_passcode || generatePasscode();
      const meetingTime = typedOrder.meeting_time || '09:00';
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
        isRecurring: typedOrder.is_recurring || false,
        recurrenceType: typedOrder.recurrence_type,
        repeatInterval: typedOrder.repeat_interval,
        weeklyDays: typedOrder.weekly_days,
        monthlyDay: typedOrder.monthly_day,
        monthlyWeek: typedOrder.monthly_week,
        endType: typedOrder.end_type,
        endDate: typedOrder.recurrence_end_date,
        endAfterCount: typedOrder.recurrence_count,
      }, source, supabase, typedOrder.id);

      if (scheduleResult) {
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

  const { error: updateError } = await supabase
    .from('guest_orders')
    .update(updateData)
    .eq('id', order.id);

  if (updateError) {
    console.error("Failed to update order:", updateError);
    return { ok: false, error: 'Failed to update order', hasZoomLink: false };
  }

  console.log("Order updated successfully:", order.id, {
    payment_status: 'paid',
    has_zoom_link: !!updateData.zoom_link,
    has_rapatin_order_id: !!updateData.rapatin_order_id,
  });

  const fnUrl = Deno.env.get('SUPABASE_URL')!;
  const fnKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const fnHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${fnKey}`,
  };

  // Order confirmation email (with retry) — only when the meeting exists
  if (updateData.zoom_link) {
    runBackground((async () => {
      const delays = [0, 3000, 8000];
      for (let attempt = 0; attempt < delays.length; attempt++) {
        if (delays[attempt] > 0) {
          await new Promise((r) => setTimeout(r, delays[attempt]));
        }
        try {
          const res = await fetch(`${fnUrl}/functions/v1/send-order-email`, {
            method: 'POST',
            headers: fnHeaders,
            body: JSON.stringify({ orderId: order.id }),
          });
          const body = await res.text();
          console.log(`Email trigger attempt ${attempt + 1} status:`, res.status);
          if (res.ok) return;
          console.error(`Email trigger attempt ${attempt + 1} failed:`, body);
        } catch (err) {
          console.error(`Email trigger attempt ${attempt + 1} error:`, err);
        }
      }
      console.error("All email trigger attempts failed for order:", order.id);
    })());
  } else {
    console.error("Skipping confirmation email - no zoom_link for order:", order.id);
  }

  // Kledo sync
  console.log("Triggering Kledo sync for order:", order.id);
  runBackground(
    fetch(`${fnUrl}/functions/v1/kledo-sync`, {
      method: 'POST',
      headers: fnHeaders,
      body: JSON.stringify({ orderId: order.id }),
    }).then(async (res) => {
      await res.text();
      console.log("Kledo sync triggered, response status:", res.status);
    }).catch((err) => {
      console.error("Failed to trigger Kledo sync:", err);
    }),
  );

  // Admin WhatsApp notification
  console.log("Triggering admin notification (payment_success) for order:", order.id);
  runBackground(
    fetch(`${fnUrl}/functions/v1/notify-admin-order`, {
      method: 'POST',
      headers: fnHeaders,
      body: JSON.stringify({ order_id: order.id, event_type: 'payment_success' }),
    }).then(async (res) => {
      await res.text();
      console.log("Admin notification (payment_success) trigger status:", res.status);
    }).catch((err) => {
      console.error("Failed to trigger admin notification:", err);
    }),
  );

  return { ok: true, hasZoomLink: !!updateData.zoom_link };
}
