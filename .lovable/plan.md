

# Rencana: Integrasi BalesOtomatis.id untuk Notifikasi WhatsApp

## Ringkasan

Menambahkan fitur kirim notifikasi WhatsApp ke pembeli melalui API BalesOtomatis.id dengan tombol manual di halaman Detail Order (bukan otomatis).

---

## Kebutuhan API Key

Perlu menambahkan 2 secret baru ke Supabase:
- `BALESOTOMATIS_API_KEY` - API Key dari Member Area > Integration > Access Token
- `BALESOTOMATIS_NUMBER_ID` - ID nomor WhatsApp yang terdaftar di BalesOtomatis

---

## Komponen yang Dibuat/Diubah

### 1. Edge Function: `send-whatsapp-notification`

**File:** `supabase/functions/send-whatsapp-notification/index.ts`

Fungsi ini akan:
- Menerima `order_id` dari request
- Mengambil data order dari database
- Mengirim pesan WhatsApp ke nomor pembeli via API BalesOtomatis
- Mencatat `whatsapp_sent_at` ke database untuk rate limiting

**Endpoint API BalesOtomatis:**
```
POST https://api.balesotomatis.id/public/v1/send_personal_message
```

**Body Request:**
```json
{
  "api_key": "YOUR-API-KEY",
  "number_id": "YOUR-NUMBER-ID",
  "enable_typing": "1",
  "method_send": "async",
  "phone_no": "TARGET-PHONE-NUMBER",
  "country_code": "62",
  "message": "Pesan kredensial Zoom"
}
```

**Template Pesan WhatsApp:**
```text
Halo [Nama],

Berikut detail Zoom Meeting Anda:

📋 *Order:* [Order Number]
📅 *Tanggal:* [Tanggal Meeting]
⏰ *Waktu:* [Jam] WIB

🔐 *Kredensial Zoom:*
Meeting ID: [Meeting ID]
Passcode: [Passcode]
Host Key: 070707

🔗 Link Meeting:
[Zoom Link]

Panduan menjadi Host: https://youtu.be/8QX78u43_JE

Terima kasih telah menggunakan Rapatin! 🙏
```

---

### 2. Database: Tambah kolom untuk rate limiting

**Migration:** Tambah kolom `whatsapp_sent_at` ke tabel `guest_orders`

```sql
ALTER TABLE guest_orders 
ADD COLUMN IF NOT EXISTS whatsapp_sent_at TIMESTAMPTZ DEFAULT NULL;
```

Kolom ini untuk mencatat kapan terakhir pesan WhatsApp dikirim, sehingga bisa di-rate limit (cooldown).

---

### 3. Frontend: Tombol "Kirim ke WhatsApp"

**File:** `src/pages/QuickOrderDetail.tsx`

Tambahkan tombol di bagian Detail Zoom Meeting (setelah area Invitation):

```tsx
{/* Tombol Kirim ke WhatsApp */}
<Button
  onClick={handleSendWhatsApp}
  disabled={isSendingWhatsApp || isWhatsAppCooldown}
  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
>
  {isSendingWhatsApp ? (
    <>
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      Mengirim...
    </>
  ) : isWhatsAppCooldown ? (
    <>
      <Clock className="w-4 h-4 mr-2" />
      Tunggu {cooldownTimeLeft}
    </>
  ) : (
    <>
      <MessageCircle className="w-4 h-4 mr-2" />
      Kirim ke WhatsApp
    </>
  )}
</Button>
```

**Logic Cooldown:**
- Setelah tombol diklik dan berhasil, disable selama 1 jam
- Tampilkan sisa waktu cooldown pada tombol
- Simpan timestamp di database (`whatsapp_sent_at`)
- Cek kondisi cooldown saat load halaman

---

## Diagram Flow

```text
┌─────────────────────────────────────────────────────────────┐
│           HALAMAN DETAIL ORDER (QuickOrderDetail)           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Detail Zoom Meeting                                         │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Meeting ID: 123 4567 8901                    [Copy]     │ │
│ │ Passcode: abc123                             [Copy]     │ │
│ │ Link Meeting: https://zoom.us/j/...  [Open] [Copy]      │ │
│ │ Host Key: ••••••                     [Eye]  [Copy]      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ Invitation                                    [Copy]  │   │
│ │ ...                                                   │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ 💬  Kirim ke WhatsApp                                 │ ← BARU
│ └───────────────────────────────────────────────────────┘   │
│                                                             │
│ [Panduan Menjadi Host]    [Panduan Lainnya]                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ (Klik tombol)
┌─────────────────────────────────────────────────────────────┐
│ Edge Function: send-whatsapp-notification                   │
│ 1. Validasi order_id                                        │
│ 2. Ambil data order dari database                           │
│ 3. Cek apakah masih dalam cooldown period                   │
│ 4. Format pesan WhatsApp                                    │
│ 5. Kirim ke API BalesOtomatis.id                            │
│ 6. Update whatsapp_sent_at di database                      │
│ 7. Return success/error                                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ BalesOtomatis.id API                                        │
│ POST /public/v1/send_personal_message                       │
│ → Kirim pesan ke nomor WhatsApp pembeli                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Posisi Tombol (Visual)

```text
SEBELUM:
┌────────────────────────────────┐
│ Invitation           [Copy]   │
│ ...                           │
├────────────────────────────────┤
│ [Panduan Host] [Panduan Lain] │
└────────────────────────────────┘

SESUDAH:
┌────────────────────────────────┐
│ Invitation           [Copy]   │
│ ...                           │
├────────────────────────────────┤
│ [💬 Kirim ke WhatsApp]        │ ← Tombol biru, lebar penuh
├────────────────────────────────┤
│ [Panduan Host] [Panduan Lain] │
└────────────────────────────────┘
```

---

## State dan Logic Cooldown

```tsx
// State
const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
const [whatsAppCooldownEnd, setWhatsAppCooldownEnd] = useState<Date | null>(null);
const [cooldownTimeLeft, setCooldownTimeLeft] = useState("");

// Cek cooldown saat order di-load
useEffect(() => {
  if (order?.whatsapp_sent_at) {
    const sentAt = new Date(order.whatsapp_sent_at);
    const cooldownEnd = new Date(sentAt.getTime() + 60 * 60 * 1000); // +1 jam
    if (cooldownEnd > new Date()) {
      setWhatsAppCooldownEnd(cooldownEnd);
    }
  }
}, [order?.whatsapp_sent_at]);

// Countdown timer untuk cooldown
useEffect(() => {
  if (!whatsAppCooldownEnd) return;
  
  const interval = setInterval(() => {
    const now = new Date();
    const diff = whatsAppCooldownEnd.getTime() - now.getTime();
    
    if (diff <= 0) {
      setWhatsAppCooldownEnd(null);
      setCooldownTimeLeft("");
      return;
    }
    
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    setCooldownTimeLeft(`${minutes}m ${seconds}s`);
  }, 1000);
  
  return () => clearInterval(interval);
}, [whatsAppCooldownEnd]);

const isWhatsAppCooldown = whatsAppCooldownEnd !== null;
```

---

## Ringkasan File yang Diubah

| File | Aksi | Deskripsi |
|------|------|-----------|
| `supabase/functions/send-whatsapp-notification/index.ts` | Baru | Edge function untuk kirim WhatsApp via BalesOtomatis API |
| `supabase/config.toml` | Ubah | Tambah konfigurasi function baru |
| Migration SQL | Baru | Tambah kolom `whatsapp_sent_at` ke `guest_orders` |
| `src/pages/QuickOrderDetail.tsx` | Ubah | Tambah tombol "Kirim ke WhatsApp" dengan cooldown logic |
| `src/integrations/supabase/types.ts` | Ubah | Tambah field `whatsapp_sent_at` ke tipe GuestOrder |
| `src/types/OrderTypes.ts` | Ubah | Tambah field `whatsapp_sent_at` |

---

## Catatan Keamanan

- API Key BalesOtomatis disimpan sebagai secret di Supabase (tidak exposed ke frontend)
- Rate limiting 1 jam mencegah spam
- Edge function memvalidasi order sebelum kirim

---

## Langkah Implementasi

1. User perlu menambahkan secrets: `BALESOTOMATIS_API_KEY` dan `BALESOTOMATIS_NUMBER_ID`
2. Jalankan migration untuk tambah kolom `whatsapp_sent_at`
3. Buat edge function `send-whatsapp-notification`
4. Update `QuickOrderDetail.tsx` dengan tombol dan logic cooldown
5. Update types di frontend

