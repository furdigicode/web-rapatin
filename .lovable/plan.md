

# Rencana: Integrasi Email Konfirmasi Order via Mailjet

## Ringkasan

Mengirim email konfirmasi otomatis setelah pembayaran berhasil, berisi detail order dan kredensial Zoom Meeting, menggunakan Mailjet SMTP/API.

---

## Alur Kerja

```text
┌────────────────┐     ┌──────────────────┐     ┌────────────────────┐     ┌────────────────┐
│ User Bayar     │────►│ Xendit Webhook   │────►│ Buat Zoom Meeting  │────►│ Kirim Email    │
│                │     │ (xendit-webhook) │     │ (Rapatin API)      │     │ (send-email)   │
└────────────────┘     └──────────────────┘     └────────────────────┘     └────────────────┘
                                                                                    │
                                                                                    ▼
                                                                           ┌────────────────┐
                                                                           │ Email sampai   │
                                                                           │ ke pelanggan   │
                                                                           └────────────────┘
```

---

## Langkah Implementasi

### 1. Tambahkan Secret Mailjet

Akan meminta user menambahkan 2 secret:
- `MAILJET_API_KEY` - API Key publik dari Mailjet
- `MAILJET_SECRET_KEY` - Secret Key dari Mailjet

### 2. Buat Edge Function `send-order-email`

Edge function baru untuk mengirim email menggunakan Mailjet API v3 (lebih reliable daripada SMTP di serverless):

```typescript
// supabase/functions/send-order-email/index.ts

// Menggunakan Mailjet Send API v3.1
POST https://api.mailjet.com/v3.1/send
Authorization: Basic (API_KEY:SECRET_KEY base64)
Content-Type: application/json

{
  "Messages": [{
    "From": { "Email": "noreply@rapatin.id", "Name": "Rapatin" },
    "To": [{ "Email": "customer@email.com", "Name": "Customer Name" }],
    "Subject": "Konfirmasi Order #INV-XXXXXX - Detail Zoom Meeting Anda",
    "HTMLPart": "<html>...</html>"
  }]
}
```

### 3. Konten Email

Email akan berisi:
- Header dengan logo Rapatin
- Nomor Order dan status pembayaran
- Detail Meeting:
  - Topik
  - Tanggal & Waktu
  - Kapasitas peserta
  - Total pembayaran
- Kredensial Zoom:
  - Join URL (clickable button)
  - Meeting ID
  - Passcode
- Jadwal sesi (jika recurring)
- Footer dengan info kontak

### 4. Integrasi dengan Xendit Webhook

Setelah Zoom meeting berhasil dibuat, trigger edge function `send-order-email`:

```typescript
// Di xendit-webhook, setelah baris 596 (setelah Rapatin schedule created)
if (scheduleResult) {
  // ... existing code ...
  
  // Kirim email konfirmasi (non-blocking)
  fetch(`${supabaseUrl}/functions/v1/send-order-email`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${supabaseAnonKey}` },
    body: JSON.stringify({ orderId: order.id })
  });
}
```

---

## Perubahan File

| File | Aksi | Deskripsi |
|------|------|-----------|
| `supabase/functions/send-order-email/index.ts` | Baru | Edge function untuk kirim email via Mailjet |
| `supabase/functions/xendit-webhook/index.ts` | Ubah | Trigger send-order-email setelah Zoom dibuat |
| `supabase/config.toml` | Ubah | Tambah konfigurasi function send-order-email |

---

## Template Email (HTML)

```text
┌─────────────────────────────────────────────────────┐
│                    🎉 RAPATIN                       │
│                                                     │
│          Pembayaran Berhasil!                       │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Order: INV-260131-0001                             │
│  Status: ✓ Lunas                                    │
│                                                     │
├─────────────────────────────────────────────────────┤
│  DETAIL MEETING                                     │
│  ─────────────────                                  │
│  Topik: Weekly Team Sync                            │
│  Tanggal: Jumat, 31 Januari 2026                    │
│  Waktu: 09:00 WIB                                   │
│  Kapasitas: 100 Peserta                             │
│  Total Bayar: Rp 20.000                             │
│                                                     │
├─────────────────────────────────────────────────────┤
│  KREDENSIAL ZOOM                                    │
│  ─────────────────                                  │
│                                                     │
│  ┌─────────────────────────────────────┐            │
│  │      🔵 GABUNG MEETING              │            │
│  └─────────────────────────────────────┘            │
│                                                     │
│  Meeting ID: 123 4567 8901                          │
│  Passcode: abc123                                   │
│  Host Key: 070707                                   │
│                                                     │
├─────────────────────────────────────────────────────┤
│  📋 PANDUAN                                         │
│  • Buka link meeting 5 menit sebelum mulai          │
│  • Gunakan Host Key untuk mengklaim host            │
│  • Panduan lengkap: rapatin.id/panduan              │
│                                                     │
├─────────────────────────────────────────────────────┤
│  © 2026 Rapatin - Sewa Zoom Meeting Terpercaya      │
│  WhatsApp: 0877-8898-0084                           │
└─────────────────────────────────────────────────────┘
```

---

## Secrets yang Dibutuhkan

| Secret | Deskripsi | Cara Mendapatkan |
|--------|-----------|------------------|
| `MAILJET_API_KEY` | API Key publik | Dashboard Mailjet → API Keys |
| `MAILJET_SECRET_KEY` | Secret Key | Dashboard Mailjet → API Keys |

---

## Detail Teknis

### Mailjet API Request

```typescript
const response = await fetch('https://api.mailjet.com/v3.1/send', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${btoa(apiKey + ':' + secretKey)}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    Messages: [{
      From: { Email: 'noreply@rapatin.id', Name: 'Rapatin' },
      To: [{ Email: customerEmail, Name: customerName }],
      Subject: `Konfirmasi Order ${orderNumber} - Detail Zoom Meeting Anda`,
      HTMLPart: htmlContent,
      TextPart: textContent, // Fallback plain text
    }]
  })
});
```

### Error Handling

- Jika email gagal terkirim, log error tapi jangan gagalkan webhook
- Email bersifat non-blocking (fire and forget)
- Retry bisa dilakukan manual dari admin panel jika diperlukan

---

## Hasil

| Aspek | Deskripsi |
|-------|-----------|
| Trigger | Otomatis setelah pembayaran berhasil + Zoom dibuat |
| Konten | Order details + Zoom credentials + Jadwal sesi |
| Delivery | Via Mailjet API (lebih reliable dari SMTP) |
| Error handling | Non-blocking, log error untuk debug |

