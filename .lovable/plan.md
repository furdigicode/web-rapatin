# Rencana: Integrasi BalesOtomatis.id untuk Notifikasi WhatsApp

## Status: ✅ SELESAI

---

## Ringkasan

Fitur kirim notifikasi WhatsApp ke pembeli melalui API BalesOtomatis.id dengan tombol manual di halaman Detail Order.

---

## Implementasi

### 1. Database
- ✅ Kolom `whatsapp_sent_at` ditambahkan ke tabel `guest_orders` untuk rate limiting (cooldown 1 jam)

### 2. Edge Function
- ✅ `supabase/functions/send-whatsapp-notification/index.ts`
- Mengirim pesan WhatsApp via BalesOtomatis API
- Rate limiting: 1 jam cooldown setelah pengiriman

### 3. Frontend
- ✅ Tombol "Kirim ke WhatsApp" di `QuickOrderDetail.tsx`
- Tombol berwarna biru, posisi setelah area Invitation
- Cooldown countdown ditampilkan pada tombol

### 4. Secrets
- ✅ `BALESOTOMATIS_API_KEY` - API Key dari BalesOtomatis
- ✅ `BALESOTOMATIS_NUMBER_ID` - ID nomor WhatsApp

---

## Template Pesan WhatsApp

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
