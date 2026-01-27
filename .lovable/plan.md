

# Rencana: Integrasi API Rapatin + Tambah Input Jam Meeting

## Ringkasan
Mengimplementasikan integrasi penuh dengan API Rapatin untuk membuat jadwal Zoom meeting secara otomatis setelah pembayaran sukses. Juga menambahkan input jam meeting di form Quick Order.

## Perubahan yang Diperlukan

### 1. Tambahkan Secrets Rapatin ke Supabase

Perlu menambahkan 2 secrets baru:
- `RAPATIN_EMAIL` - Email akun internal untuk login ke API Rapatin
- `RAPATIN_PASSWORD` - Password akun internal untuk login

### 2. Update Database Schema

Tambahkan kolom baru di tabel `guest_orders`:

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| meeting_time | text | Jam meeting yang dipilih user (format HH:mm) |

### 3. Update Frontend - Form Quick Order

**File: `src/components/quick-order/QuickOrderForm.tsx`**

Perubahan:
- Tambahkan field input untuk memilih jam meeting (dropdown/select)
- Pilihan jam: 00:00 - 23:00 (increment per jam)
- Update form schema untuk include `meeting_time`
- Kirim `meeting_time` ke edge function

**Contoh UI Time Picker:**
```text
+-------------------------+
| Jam Meeting             |
| [ 09:00           ▼ ]   |
+-------------------------+
```

### 4. Update Edge Function - create-guest-order

**File: `supabase/functions/create-guest-order/index.ts`**

Perubahan:
- Terima parameter `meeting_time` dari frontend
- Simpan `meeting_time` ke database

### 5. Update Edge Function - xendit-webhook (Integrasi Rapatin)

**File: `supabase/functions/xendit-webhook/index.ts`**

Implementasi lengkap integrasi Rapatin API:

**Alur Proses:**
```text
+------------------+     +------------------+     +------------------+
| 1. Webhook       |---->| 2. Login ke API  |---->| 3. Create        |
|    Xendit        |     |    Rapatin       |     |    Schedule      |
+------------------+     +------------------+     +------------------+
                                                          |
                                                          v
+------------------+     +------------------+     +------------------+
| 6. Update order  |<----| 5. Simpan zoom   |<----| 4. Get join_url  |
|    status = paid |     |    link & passcode|    |    dari response |
+------------------+     +------------------+     +------------------+
```

**Step by Step:**

1. **Login ke Rapatin API**
   - Endpoint: `POST https://api.rapatin.id/auth/login`
   - Body: `{ email, password, device: "webhook" }`
   - Response: `data.token`

2. **Create Schedule**
   - Endpoint: `POST https://api.rapatin.id/schedules`
   - Header: `Authorization: Bearer {token}`
   - Body:
     ```json
     {
       "product_id": 1-4 (berdasarkan participant_count),
       "topic": "Quick Order - {nama pemesan}",
       "passcode": "{generated 6 digit}",
       "start_date": "{meeting_date}",
       "start_time": "{meeting_time}",
       "recurring": false,
       "is_meeting_registration": false,
       "is_meeting_qna": false,
       "is_language_interpretation": false,
       "is_mute_participant_upon_entry": false,
       "is_req_permission_to_unmute_participants": false
     }
     ```

3. **Map participant_count ke product_id:**
   - 100 peserta → product_id: 1
   - 300 peserta → product_id: 2
   - 500 peserta → product_id: 3
   - 1000 peserta → product_id: 4

4. **Simpan Response ke Database:**
   - `zoom_link` = `data.join_url`
   - `zoom_passcode` = `data.passcode`
   - `meeting_id` = `data.meeting_id`
   - `rapatin_order_id` = `data.id`

### 6. Update PricingSummary Component

**File: `src/components/quick-order/PricingSummary.tsx`**

Perubahan:
- Tampilkan jam meeting yang dipilih di ringkasan order

## Detail Teknis

### Struktur File yang Diubah

```text
src/
├── components/
│   └── quick-order/
│       ├── QuickOrderForm.tsx    # Tambah time picker
│       └── PricingSummary.tsx    # Tampilkan jam meeting

supabase/
├── functions/
│   ├── create-guest-order/
│   │   └── index.ts              # Terima meeting_time
│   └── xendit-webhook/
│       └── index.ts              # Integrasi Rapatin API
```

### Error Handling untuk Rapatin API

Webhook akan handle berbagai skenario error:
- **Login gagal**: Log error, order tetap marked as paid (perlu manual follow-up)
- **Create schedule gagal**: Log error, simpan error message ke database
- **Network timeout**: Retry mechanism dengan 3 attempts

### Passcode Generation

Generate 6 digit random passcode untuk meeting:
```typescript
const passcode = Math.random().toString().slice(2, 8);
```

## Keamanan

1. **Secrets disimpan di Supabase Edge Function Secrets**
   - RAPATIN_EMAIL
   - RAPATIN_PASSWORD
   
2. **Token Rapatin hanya digunakan sekali per request**
   - Tidak perlu caching karena flow adalah per-payment webhook

## Urutan Implementasi

1. Request secrets RAPATIN_EMAIL dan RAPATIN_PASSWORD
2. Buat database migration untuk kolom `meeting_time`
3. Update `QuickOrderForm.tsx` - tambah time picker
4. Update `PricingSummary.tsx` - tampilkan jam meeting
5. Update `create-guest-order` edge function
6. Implementasi Rapatin API di `xendit-webhook` edge function
7. Testing end-to-end

## Testing Checklist

- [ ] Form bisa memilih jam meeting
- [ ] Jam meeting tersimpan di database
- [ ] Login ke Rapatin API berhasil
- [ ] Schedule berhasil dibuat di Rapatin
- [ ] Zoom link tersimpan di database
- [ ] Halaman success menampilkan zoom link

