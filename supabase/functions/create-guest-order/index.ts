import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
    } = await req.json() as OrderRequest;

    // Validation
    if (!name || !email || !whatsapp || !meeting_date || !meeting_time || !participant_count || !meeting_topic) {
      console.error("Validation failed: missing required fields", { name, email, whatsapp, meeting_date, meeting_time, participant_count, meeting_topic });
      return new Response(
        JSON.stringify({ error: 'Semua field harus diisi' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate participant count
    if (!PRICING[participant_count]) {
      console.error("Invalid participant count:", participant_count);
      return new Response(
        JSON.stringify({ error: 'Jumlah peserta tidak valid' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate meeting date is not in the past
    const meetingDateObj = new Date(meeting_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (meetingDateObj < today) {
      console.error("Meeting date is in the past:", meeting_date);
      return new Response(
        JSON.stringify({ error: 'Tanggal meeting tidak boleh di masa lalu' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Invalid email format:", email);
      return new Response(
        JSON.stringify({ error: 'Format email tidak valid' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean WhatsApp number (remove non-digits except +)
    const cleanWhatsapp = whatsapp.replace(/[^\d+]/g, '');

    // Get price (using promo price)
    const price = PRICING[participant_count].promo;

    // Create Xendit Invoice
    const xenditSecretKey = Deno.env.get('XENDIT_SECRET_KEY');
    if (!xenditSecretKey) {
      console.error("XENDIT_SECRET_KEY not configured");
      return new Response(
        JSON.stringify({ error: 'Payment gateway not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const invoiceExternalId = `RAPATIN-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const invoiceExpiry = new Date();
    invoiceExpiry.setHours(invoiceExpiry.getHours() + 24); // 24 hours expiry

    console.log("Creating Xendit invoice for:", { email, price, participant_count });

    const xenditResponse = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(xenditSecretKey + ':')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        external_id: invoiceExternalId,
        amount: price,
        payer_email: email,
        description: `Sewa Zoom Meeting - ${participant_count} Peserta - ${meeting_date}`,
        invoice_duration: 86400, // 24 hours in seconds
        customer: {
          given_names: name,
          email: email,
          mobile_number: cleanWhatsapp,
        },
        success_redirect_url: `https://rapatin.lovable.app/quick-order/success?order_id=${invoiceExternalId}`,
        failure_redirect_url: `https://rapatin.lovable.app/quick-order/pending?order_id=${invoiceExternalId}`,
        currency: 'IDR',
        items: [
          {
            name: `Sewa Zoom ${participant_count} Peserta`,
            quantity: 1,
            price: price,
          }
        ],
        payment_methods: ['QRIS', 'BANK_TRANSFER', 'EWALLET'],
      }),
    });

    if (!xenditResponse.ok) {
      const errorText = await xenditResponse.text();
      console.error("Xendit API error:", xenditResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Gagal membuat invoice pembayaran' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const xenditInvoice = await xenditResponse.json();
    console.log("Xendit invoice created:", xenditInvoice.id);

    // Save order to database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: order, error: dbError } = await supabase
      .from('guest_orders')
      .insert({
        name,
        email,
        whatsapp: cleanWhatsapp,
        meeting_date,
        meeting_time,
        participant_count,
        price,
        payment_status: 'pending',
        xendit_invoice_id: xenditInvoice.id,
        xendit_invoice_url: xenditInvoice.invoice_url,
        expired_at: invoiceExpiry.toISOString(),
        meeting_topic,
        custom_passcode: custom_passcode || null,
        is_meeting_registration: is_meeting_registration || false,
        is_meeting_qna: is_meeting_qna || false,
        is_language_interpretation: is_language_interpretation || false,
        is_mute_upon_entry: is_mute_upon_entry || false,
        is_req_unmute_permission: is_req_unmute_permission || false,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: 'Gagal menyimpan order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Order created successfully:", order.id);

    return new Response(
      JSON.stringify({
        success: true,
        order_id: order.id,
        external_id: invoiceExternalId,
        invoice_url: xenditInvoice.invoice_url,
        expired_at: invoiceExpiry.toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: 'Terjadi kesalahan server' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
