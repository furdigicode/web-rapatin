import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Format date to Indonesian format
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${dayName}, ${day} ${month} ${year}`;
}

// Format price to Rupiah
function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format Meeting ID with spaces (123 4567 8901)
function formatMeetingId(meetingId: string | null): string {
  if (!meetingId) return '-';
  const cleaned = meetingId.replace(/\D/g, '');
  return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3');
}

// Generate HTML email template
function generateEmailHTML(order: Record<string, unknown>): string {
  const orderNumber = order.order_number as string || '-';
  const meetingTopic = order.meeting_topic as string || 'Zoom Meeting';
  const meetingDate = formatDate(order.meeting_date as string);
  const meetingTime = order.meeting_time as string || '09:00';
  const participantCount = order.participant_count as number;
  const price = formatRupiah(order.price as number);
  const zoomLink = order.zoom_link as string || '';
  const meetingId = formatMeetingId(order.meeting_id as string);
  const passcode = order.zoom_passcode as string || '-';
  const hostKey = '070707';
  const customerName = order.name as string;
  const isRecurring = order.is_recurring as boolean;
  const totalDays = order.total_days as number;

  // Recurring info section
  let recurringInfo = '';
  if (isRecurring && totalDays && totalDays > 1) {
    recurringInfo = `
      <tr>
        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Total Sesi</td>
        <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right; font-weight: 600;">${totalDays} Sesi</td>
      </tr>
    `;
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Konfirmasi Order - Rapatin</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Rapatin</h1>
              <p style="margin: 8px 0 0 0; color: #bfdbfe; font-size: 16px;">Pembayaran Berhasil!</p>
            </td>
          </tr>
          
          <!-- Greeting -->
          <tr>
            <td style="padding: 32px 32px 16px 32px;">
              <p style="margin: 0; color: #374151; font-size: 16px;">Halo <strong>${customerName}</strong>,</p>
              <p style="margin: 12px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Terima kasih telah melakukan pemesanan di Rapatin. Berikut adalah detail order dan kredensial Zoom Meeting Anda.
              </p>
            </td>
          </tr>
          
          <!-- Order Info -->
          <tr>
            <td style="padding: 0 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border-radius: 12px; padding: 20px; border: 1px solid #bbf7d0;">
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color: #166534; font-size: 14px; font-weight: 600;">Order</td>
                        <td style="color: #166534; font-size: 14px; font-weight: 700; text-align: right;">${orderNumber}</td>
                      </tr>
                      <tr>
                        <td style="color: #166534; font-size: 14px; padding-top: 8px;">Status</td>
                        <td style="color: #166534; font-size: 14px; padding-top: 8px; text-align: right;">✓ Lunas</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Meeting Details -->
          <tr>
            <td style="padding: 24px 32px 0 32px;">
              <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                📋 Detail Meeting
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Topik</td>
                  <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right; font-weight: 600;">${meetingTopic}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Tanggal</td>
                  <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right;">${meetingDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Waktu</td>
                  <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right;">${meetingTime} WIB</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Kapasitas</td>
                  <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right;">${participantCount} Peserta</td>
                </tr>
                ${recurringInfo}
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Total Bayar</td>
                  <td style="padding: 8px 0; color: #2563eb; font-size: 16px; text-align: right; font-weight: 700;">${price}</td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Zoom Credentials -->
          <tr>
            <td style="padding: 24px 32px 0 32px;">
              <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                🔐 Kredensial Zoom
              </h2>
              
              <!-- Join Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td align="center">
                    <a href="${zoomLink}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 12px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);">
                      🔵 Gabung Meeting
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Credentials Table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 12px; padding: 16px; border: 1px solid #e5e7eb;">
                <tr>
                  <td style="padding: 8px 12px; color: #6b7280; font-size: 14px;">Meeting ID</td>
                  <td style="padding: 8px 12px; color: #111827; font-size: 14px; text-align: right; font-family: 'Courier New', monospace; font-weight: 600;">${meetingId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; color: #6b7280; font-size: 14px;">Passcode</td>
                  <td style="padding: 8px 12px; color: #111827; font-size: 14px; text-align: right; font-family: 'Courier New', monospace; font-weight: 600;">${passcode}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; color: #6b7280; font-size: 14px;">Host Key</td>
                  <td style="padding: 8px 12px; color: #111827; font-size: 14px; text-align: right; font-family: 'Courier New', monospace; font-weight: 600;">${hostKey}</td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Tips -->
          <tr>
            <td style="padding: 24px 32px 0 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fffbeb; border-radius: 12px; padding: 16px; border: 1px solid #fde68a;">
                <tr>
                  <td>
                    <p style="margin: 0 0 8px 0; color: #92400e; font-size: 14px; font-weight: 600;">💡 Tips Penting</p>
                    <ul style="margin: 0; padding-left: 20px; color: #92400e; font-size: 13px; line-height: 1.8;">
                      <li>Buka link meeting 5 menit sebelum jadwal dimulai</li>
                      <li>Gunakan Host Key untuk mengklaim hak akses sebagai host</li>
                      <li>Pastikan koneksi internet stabil untuk pengalaman terbaik</li>
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px; text-align: center; border-top: 1px solid #e5e7eb; margin-top: 24px;">
              <p style="margin: 0; color: #6b7280; font-size: 13px;">
                Ada pertanyaan? Hubungi kami via WhatsApp
              </p>
              <a href="https://wa.me/6287788980084" style="display: inline-block; margin-top: 12px; color: #2563eb; text-decoration: none; font-size: 14px; font-weight: 600;">
                📱 0877-8898-0084
              </a>
              <p style="margin: 24px 0 0 0; color: #9ca3af; font-size: 12px;">
                © 2026 Rapatin - Sewa Zoom Meeting Terpercaya
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Generate plain text fallback
function generateEmailText(order: Record<string, unknown>): string {
  const orderNumber = order.order_number as string || '-';
  const meetingTopic = order.meeting_topic as string || 'Zoom Meeting';
  const meetingDate = formatDate(order.meeting_date as string);
  const meetingTime = order.meeting_time as string || '09:00';
  const participantCount = order.participant_count as number;
  const price = formatRupiah(order.price as number);
  const zoomLink = order.zoom_link as string || '';
  const meetingId = formatMeetingId(order.meeting_id as string);
  const passcode = order.zoom_passcode as string || '-';
  const hostKey = '070707';
  const customerName = order.name as string;

  return `
RAPATIN - Pembayaran Berhasil!

Halo ${customerName},

Terima kasih telah melakukan pemesanan di Rapatin. Berikut adalah detail order dan kredensial Zoom Meeting Anda.

---
ORDER INFO
---
Order: ${orderNumber}
Status: ✓ Lunas

---
DETAIL MEETING
---
Topik: ${meetingTopic}
Tanggal: ${meetingDate}
Waktu: ${meetingTime} WIB
Kapasitas: ${participantCount} Peserta
Total Bayar: ${price}

---
KREDENSIAL ZOOM
---
Link Meeting: ${zoomLink}
Meeting ID: ${meetingId}
Passcode: ${passcode}
Host Key: ${hostKey}

---
TIPS PENTING
---
• Buka link meeting 5 menit sebelum jadwal dimulai
• Gunakan Host Key untuk mengklaim hak akses sebagai host
• Pastikan koneksi internet stabil untuk pengalaman terbaik

---
Ada pertanyaan? Hubungi kami via WhatsApp: 0877-8898-0084

© 2026 Rapatin - Sewa Zoom Meeting Terpercaya
  `.trim();
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId } = await req.json();

    if (!orderId) {
      console.error("Missing orderId in request");
      return new Response(
        JSON.stringify({ error: 'Missing orderId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Processing email for order:", orderId);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch order details
    const { data: order, error: fetchError } = await supabase
      .from('guest_orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (fetchError || !order) {
      console.error("Order not found:", orderId, fetchError);
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if order has zoom_link (meeting was created)
    if (!order.zoom_link) {
      console.error("Order does not have zoom_link yet:", orderId);
      return new Response(
        JSON.stringify({ error: 'Meeting not created yet' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Mailjet credentials
    const mailjetApiKey = Deno.env.get('MAILJET_API_KEY');
    const mailjetSecretKey = Deno.env.get('MAILJET_SECRET_KEY');

    if (!mailjetApiKey || !mailjetSecretKey) {
      console.error("Mailjet credentials not configured");
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate email content
    const htmlContent = generateEmailHTML(order);
    const textContent = generateEmailText(order);

    // Send email via Mailjet API v3.1
    const authHeader = btoa(`${mailjetApiKey}:${mailjetSecretKey}`);
    
    const emailPayload = {
      Messages: [{
        From: {
          Email: "admin@rapatin.id",
          Name: "Rapatin"
        },
        To: [{
          Email: order.email,
          Name: order.name
        }],
        Subject: `Konfirmasi Order ${order.order_number} - Detail Zoom Meeting Anda`,
        HTMLPart: htmlContent,
        TextPart: textContent,
      }]
    };

    console.log("Sending email to:", order.email);

    const mailjetResponse = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    const mailjetResult = await mailjetResponse.json();

    if (!mailjetResponse.ok) {
      console.error("Mailjet API error:", mailjetResponse.status, JSON.stringify(mailjetResult));
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: mailjetResult }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Email sent successfully:", JSON.stringify(mailjetResult));

    return new Response(
      JSON.stringify({ success: true, result: mailjetResult }),
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
