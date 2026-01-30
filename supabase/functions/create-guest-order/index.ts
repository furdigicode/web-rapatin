import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Generate secure access slug (24 chars alphanumeric)
function generateAccessSlug(length: number = 24): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => chars[byte % chars.length]).join('');
}

// Pricing configuration (in Rupiah)
const PRICING: Record<number, { promo: number; normal: number }> = {
  100: { promo: 10000, normal: 20000 },
  300: { promo: 25000, normal: 40000 },
  500: { promo: 55000, normal: 70000 },
  1000: { promo: 100000, normal: 130000 },
};

interface OrderRequest {
  name: string;
  email: string;
  whatsapp: string;
  meeting_date: string;
  meeting_time: string;
  participant_count: number;
  meeting_topic: string;
  custom_passcode?: string | null;
  is_meeting_registration?: boolean;
  is_meeting_qna?: boolean;
  is_language_interpretation?: boolean;
  is_mute_upon_entry?: boolean;
  is_req_unmute_permission?: boolean;
  // Recurring fields
  is_recurring?: boolean;
  recurrence_type?: number | null; // 1=daily, 2=weekly, 3=monthly
  repeat_interval?: number | null;
  weekly_days?: number[] | null;
  monthly_day?: number | null;
  monthly_week?: number | null;
  end_type?: 'end_date' | 'end_after_type' | null;
  recurrence_end_date?: string | null;
  recurrence_count?: number | null;
  total_days?: number;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = (await req.json()) as OrderRequest;
    const {
      name,
      email,
      whatsapp,
      meeting_date,
      meeting_time,
      participant_count,
      meeting_topic,
      custom_passcode,
      is_meeting_registration,
      is_meeting_qna,
      is_language_interpretation,
      is_mute_upon_entry,
      is_req_unmute_permission,
      // Recurring fields
      is_recurring,
      recurrence_type,
      repeat_interval,
      weekly_days,
      monthly_day,
      monthly_week,
      end_type,
      recurrence_end_date,
      recurrence_count,
      total_days,
    } = requestData;

    // Validation
    if (!name || !email || !whatsapp || !meeting_date || !meeting_time || !participant_count || !meeting_topic) {
      console.error("Validation failed: missing required fields", {
        name,
        email,
        whatsapp,
        meeting_date,
        meeting_time,
        participant_count,
        meeting_topic,
      });
      return new Response(JSON.stringify({ error: "Semua field harus diisi" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate participant count
    if (!PRICING[participant_count]) {
      console.error("Invalid participant count:", participant_count);
      return new Response(JSON.stringify({ error: "Jumlah peserta tidak valid" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate meeting date is not in the past
    const meetingDateObj = new Date(meeting_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (meetingDateObj < today) {
      console.error("Meeting date is in the past:", meeting_date);
      return new Response(JSON.stringify({ error: "Tanggal meeting tidak boleh di masa lalu" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Invalid email format:", email);
      return new Response(JSON.stringify({ error: "Format email tidak valid" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate recurring parameters if recurring is enabled
    const effectiveTotalDays = is_recurring && total_days && total_days > 1 ? total_days : 1;
    
    if (is_recurring && effectiveTotalDays > 1) {
      if (!recurrence_type || ![1, 2, 3].includes(recurrence_type)) {
        return new Response(JSON.stringify({ error: "Tipe pengulangan tidak valid" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      if (!end_type || !['end_date', 'end_after_type'].includes(end_type)) {
        return new Response(JSON.stringify({ error: "Tipe akhir pengulangan tidak valid" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (effectiveTotalDays < 2 || effectiveTotalDays > 365) {
        return new Response(JSON.stringify({ error: "Jumlah sesi harus antara 2-365" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Clean WhatsApp number (remove non-digits except +)
    const cleanWhatsapp = whatsapp.replace(/[^\d+]/g, "");

    // Calculate price: base price × total days
    const basePrice = PRICING[participant_count].promo;
    const totalPrice = basePrice * effectiveTotalDays;

    // Create Xendit Invoice
    const xenditSecretKey = Deno.env.get("XENDIT_SECRET_KEY");
    if (!xenditSecretKey) {
      console.error("XENDIT_SECRET_KEY not configured");
      return new Response(JSON.stringify({ error: "Payment gateway not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate secure access slug for the order
    const accessSlug = generateAccessSlug(24);

    // Generate reference ID that will be used to match payment.capture webhook
    const sessionReferenceId = `RAPATIN-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const customerReferenceId = `cust_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    // Build description with recurring info if applicable
    let description = `Sewa Zoom Meeting - ${participant_count} Peserta - ${meeting_date}`;
    if (is_recurring && effectiveTotalDays > 1) {
      description = `Sewa Zoom Meeting Berulang - ${participant_count} Peserta - ${effectiveTotalDays} sesi`;
    }

    console.log("Creating Xendit session for:", { 
      email, 
      totalPrice, 
      participant_count, 
      accessSlug, 
      sessionReferenceId,
      is_recurring,
      effectiveTotalDays,
    });

    const xenditResponse = await fetch("https://api.xendit.co/sessions", {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(xenditSecretKey + ":")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reference_id: sessionReferenceId,
        session_type: "PAY",
        mode: "PAYMENT_LINK",
        amount: totalPrice,
        currency: "IDR",
        country: "ID",
        customer: {
          reference_id: customerReferenceId,
          type: "INDIVIDUAL",
          email: email,
          mobile_number: cleanWhatsapp,
          individual_detail: {
            given_names: name,
          },
        },
        items: [
          {
            reference_id: `item_zoom_${participant_count}_${Date.now()}`,
            name: is_recurring && effectiveTotalDays > 1 
              ? `Sewa Zoom ${participant_count} Peserta (${effectiveTotalDays} sesi)` 
              : `Sewa Zoom ${participant_count} Peserta`,
            description: `Meeting: ${meeting_topic} - ${meeting_date}`,
            type: "DIGITAL_PRODUCT",
            category: "SERVICE",
            net_unit_amount: totalPrice,
            quantity: 1,
            currency: "IDR",
            url: "https://rapatin.id/sewa-zoom-harian",
          },
        ],
        capture_method: "AUTOMATIC",
        locale: "id",
        description: description,
        success_return_url: `https://rapatin.lovable.app/quick-order/${accessSlug}`,
        cancel_return_url: `https://rapatin.lovable.app/quick-order/${accessSlug}`,
      }),
    });

    if (!xenditResponse.ok) {
      const errorText = await xenditResponse.text();
      console.error("Xendit Sessions API error:", xenditResponse.status, errorText);
      return new Response(JSON.stringify({ error: "Gagal membuat payment session" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const xenditSession = await xenditResponse.json();
    console.log("Xendit full response:", JSON.stringify(xenditSession));

    // Xendit Sessions API returns payment_session_id, not id
    const sessionId = xenditSession.payment_session_id;

    if (!sessionId) {
      console.error("No payment_session_id in Xendit response:", xenditSession);
      return new Response(JSON.stringify({ error: "Invalid payment session response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Xendit session created:", sessionId, "URL:", xenditSession.payment_link_url);

    // Save order to database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate order number with format INV-YYMMDD-XXXX
    let orderNumber: string;
    const { data: orderNumberData, error: seqError } = await supabase.rpc('generate_order_number');
    
    if (seqError || !orderNumberData) {
      console.error("Failed to generate order number:", seqError);
      // Fallback: use timestamp-based
      const now = new Date();
      const datePart = now.toISOString().slice(2, 10).replace(/-/g, '');
      orderNumber = `INV-${datePart}-${Date.now().toString().slice(-4)}`;
    } else {
      orderNumber = orderNumberData;
    }

    console.log("Generated order number:", orderNumber);

    const orderData: Record<string, unknown> = {
      order_number: orderNumber,
      name,
      email,
      whatsapp: cleanWhatsapp,
      meeting_date,
      meeting_time,
      participant_count,
      price: totalPrice,
      payment_status: "pending",
      xendit_invoice_id: sessionId,
      xendit_invoice_url: xenditSession.payment_link_url,
      expired_at: xenditSession.expires_at || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      meeting_topic,
      custom_passcode: custom_passcode || null,
      is_meeting_registration: is_meeting_registration || false,
      is_meeting_qna: is_meeting_qna || false,
      is_language_interpretation: is_language_interpretation || false,
      is_mute_upon_entry: is_mute_upon_entry || false,
      is_req_unmute_permission: is_req_unmute_permission || false,
      access_slug: accessSlug,
      xendit_reference_id: sessionReferenceId,
      // Recurring fields
      is_recurring: is_recurring || false,
      recurrence_type: is_recurring ? recurrence_type : null,
      repeat_interval: is_recurring ? repeat_interval : null,
      weekly_days: is_recurring && recurrence_type === 2 ? weekly_days : null,
      monthly_day: is_recurring && recurrence_type === 3 ? monthly_day : null,
      monthly_week: is_recurring && recurrence_type === 3 ? monthly_week : null,
      end_type: is_recurring ? end_type : null,
      recurrence_end_date: is_recurring && end_type === 'end_date' ? recurrence_end_date : null,
      recurrence_count: is_recurring && end_type === 'end_after_type' ? recurrence_count : null,
      total_days: effectiveTotalDays,
    };

    const { data: order, error: dbError } = await supabase
      .from("guest_orders")
      .insert(orderData)
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(JSON.stringify({ error: "Gagal menyimpan order" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Order created successfully:", order.id, {
      is_recurring: order.is_recurring,
      total_days: order.total_days,
      price: order.price,
    });

    return new Response(
      JSON.stringify({
        success: true,
        order_id: order.id,
        access_slug: accessSlug,
        session_id: sessionId,
        invoice_url: xenditSession.payment_link_url,
        expired_at: xenditSession.expires_at || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Terjadi kesalahan server" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
