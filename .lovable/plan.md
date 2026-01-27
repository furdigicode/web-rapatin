
# Rencana: Tambah Field Konfigurasi Meeting di Quick Order Form

## Ringkasan
Menambahkan field Topic, Passcode custom, dan 5 opsi fitur meeting ke form Quick Order, lalu meneruskan data ini ke API Rapatin saat pembuatan jadwal.

## Perubahan yang Diperlukan

### 1. Update Database Schema

Tambahkan kolom baru di tabel `guest_orders`:

| Kolom | Tipe | Default | Deskripsi |
|-------|------|---------|-----------|
| `meeting_topic` | text | NULL | Judul meeting custom |
| `custom_passcode` | text | NULL | Passcode custom (jika diisi) |
| `is_meeting_registration` | boolean | false | Aktifkan registrasi peserta |
| `is_meeting_qna` | boolean | false | Aktifkan fitur Q&A |
| `is_language_interpretation` | boolean | false | Aktifkan interpretasi bahasa |
| `is_mute_upon_entry` | boolean | false | Mute peserta saat masuk |
| `is_req_unmute_permission` | boolean | false | Request permission untuk unmute |

### 2. Update Frontend Form

**File: `src/components/quick-order/QuickOrderForm.tsx`**

Tambahkan field baru di section "Detail Meeting":

**A. Topic Meeting**
```text
+----------------------------------+
| Topik Meeting                    |
| [Team Meeting Weekly        ]    |
+----------------------------------+
```

**B. Passcode Custom (opsional)**
```text
+----------------------------------+
| Passcode (Opsional)              |
| [123456                     ]    |
| Kosongkan untuk auto-generate    |
+----------------------------------+
```

**C. Fitur Tambahan (Collapsible/Accordion)**
```text
+----------------------------------+
| ▼ Pengaturan Meeting Lanjutan    |
+----------------------------------+
| [ ] Aktifkan registrasi peserta  |
| [ ] Aktifkan fitur Q&A           |
| [ ] Aktifkan interpretasi bahasa |
| [ ] Mute peserta saat masuk      |
| [ ] Minta izin untuk unmute      |
+----------------------------------+
```

### 3. Update Form Schema

```typescript
const formSchema = z.object({
  // ... existing fields
  meeting_topic: z.string()
    .min(3, "Topik minimal 3 karakter")
    .max(200, "Topik maksimal 200 karakter"),
  custom_passcode: z.string()
    .max(10, "Passcode maksimal 10 karakter")
    .regex(/^[a-zA-Z0-9]*$/, "Passcode hanya boleh huruf dan angka")
    .optional()
    .or(z.literal('')),
  is_meeting_registration: z.boolean().default(false),
  is_meeting_qna: z.boolean().default(false),
  is_language_interpretation: z.boolean().default(false),
  is_mute_upon_entry: z.boolean().default(false),
  is_req_unmute_permission: z.boolean().default(false),
});
```

### 4. Update PricingSummary Component

**File: `src/components/quick-order/PricingSummary.tsx`**

Tambahkan tampilan:
- Topik meeting
- Passcode (jika custom)
- Daftar fitur yang diaktifkan

### 5. Update Edge Function - create-guest-order

**File: `supabase/functions/create-guest-order/index.ts`**

Perubahan:
- Terima parameter baru dari frontend
- Simpan semua field baru ke database

### 6. Update Edge Function - xendit-webhook

**File: `supabase/functions/xendit-webhook/index.ts`**

Perubahan pada `createRapatinSchedule`:
- Gunakan `meeting_topic` dari order (atau default ke "Quick Order - {nama}")
- Gunakan `custom_passcode` jika ada, atau auto-generate
- Teruskan nilai 5 opsi fitur ke API Rapatin

```typescript
body: JSON.stringify({
  product_id: productId,
  topic: order.meeting_topic || `Quick Order - ${order.name}`,
  passcode: order.custom_passcode || generatePasscode(),
  start_date: order.meeting_date,
  start_time: order.meeting_time,
  recurring: false,
  is_meeting_registration: order.is_meeting_registration || false,
  is_meeting_qna: order.is_meeting_qna || false,
  is_language_interpretation: order.is_language_interpretation || false,
  is_mute_participant_upon_entry: order.is_mute_upon_entry || false,
  is_req_permission_to_unmute_participants: order.is_req_unmute_permission || false,
}),
```

## Detail Teknis

### Struktur File yang Diubah

```text
src/
├── components/
│   └── quick-order/
│       ├── QuickOrderForm.tsx    # Tambah field baru
│       └── PricingSummary.tsx    # Tampilkan konfigurasi

supabase/
├── functions/
│   ├── create-guest-order/
│   │   └── index.ts              # Terima & simpan field baru
│   └── xendit-webhook/
│       └── index.ts              # Gunakan konfigurasi dari DB
```

### UI/UX Considerations

1. **Topic**: Field wajib diisi, dengan placeholder contoh
2. **Passcode**: Opsional, dengan hint "Kosongkan untuk auto-generate"
3. **Fitur Tambahan**: 
   - Dalam collapsible/accordion agar form tidak terlalu panjang
   - Default semua false (off)
   - Menggunakan Switch atau Checkbox component

### Tentang Token Caching

Implementasi saat ini (login setiap request) tetap dipertahankan karena:

1. **Stateless Edge Functions**: Edge functions tidak bisa menyimpan state di memory antar request
2. **Simplicity**: Tidak perlu logic untuk token expiry dan refresh
3. **Reliability**: Token selalu fresh, tidak ada risiko expired token
4. **Low Volume**: Webhook payment tidak high-frequency, jadi overhead login minimal

Jika volume meningkat signifikan, opsi optimasi:
- Simpan token di database dengan expiry timestamp
- Check token validity sebelum create schedule
- Refresh jika expired

## Urutan Implementasi

1. Buat database migration untuk kolom baru
2. Update `QuickOrderForm.tsx` - tambah field baru
3. Update `PricingSummary.tsx` - tampilkan konfigurasi
4. Update `create-guest-order` - terima & simpan field baru
5. Update `xendit-webhook` - gunakan konfigurasi dari order
6. Testing end-to-end

## Testing Checklist

- [ ] Form dapat mengisi topic meeting
- [ ] Form dapat mengisi custom passcode (opsional)
- [ ] 5 toggle fitur berfungsi dengan benar
- [ ] Semua data tersimpan di database
- [ ] Webhook meneruskan konfigurasi ke Rapatin API
- [ ] Zoom meeting dibuat dengan konfigurasi yang benar
