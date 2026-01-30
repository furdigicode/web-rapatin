

# Rencana: Token Caching untuk Rapatin API

## Masalah Saat Ini

Setiap kali webhook pembayaran sukses (`payment_session.completed`), fungsi `xendit-webhook` melakukan login baru ke Rapatin API untuk mendapatkan token. Ini tidak efisien karena token bisa digunakan kembali.

## Solusi

Menggunakan pendekatan yang sama dengan Kledo - menyimpan token di database dan menggunakannya kembali jika belum kadaluarsa.

---

## Database Changes

### Tabel Baru: `rapatin_auth_tokens`

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| `id` | uuid | Primary key |
| `access_token` | text | Token dari Rapatin API |
| `expires_at` | timestamptz | Waktu kadaluarsa |
| `created_at` | timestamptz | Waktu token dibuat |

**Catatan**: Perlu dicek berapa lama token Rapatin valid. Jika tidak ada informasi, akan menggunakan 7 hari sebagai default yang aman.

---

## Arsitektur Token Caching

```text
┌─────────────────────────────────────────────────────────────────┐
│                     xendit-webhook Edge Function                │
├─────────────────────────────────────────────────────────────────┤
│  1. Cek token di tabel rapatin_auth_tokens                      │
│     ↓                                                           │
│  2. Token ada & belum expired?                                  │
│     ├── YA  → Gunakan token tersebut                            │
│     └── TIDAK → Login ke Rapatin, simpan token baru             │
│     ↓                                                           │
│  3. Lanjut proses create schedule                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Logika Baru

```typescript
async function getRapatinToken(supabase): Promise<string | null> {
  // 1. Cek token yang masih valid di database
  const { data: existingToken } = await supabase
    .from('rapatin_auth_tokens')
    .select('access_token, expires_at')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (existingToken?.access_token) {
    console.log("Using cached Rapatin token");
    return existingToken.access_token;
  }

  // 2. Token tidak ada atau expired, login baru
  console.log("No valid token, logging in to Rapatin...");
  const token = await loginToRapatin();
  
  if (!token) return null;

  // 3. Simpan token baru dengan expiry (default 7 hari jika tidak diketahui)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  
  await supabase.from('rapatin_auth_tokens').insert({
    access_token: token,
    expires_at: expiresAt.toISOString()
  });

  // 4. Hapus token lama (cleanup)
  await supabase
    .from('rapatin_auth_tokens')
    .delete()
    .lt('expires_at', new Date().toISOString());

  return token;
}
```

---

## File yang Diubah

| File | Aksi | Deskripsi |
|------|------|-----------|
| `supabase/functions/xendit-webhook/index.ts` | Ubah | Tambah fungsi `getRapatinToken` dengan caching |
| Database migration | Baru | Buat tabel `rapatin_auth_tokens` |

---

## Perubahan di xendit-webhook

**Sebelum:**
```typescript
// Step 1: Login to Rapatin
const rapatinToken = await loginToRapatin();
```

**Sesudah:**
```typescript
// Step 1: Get Rapatin token (with caching)
const rapatinToken = await getRapatinToken(supabase);
```

---

## RLS Policy

Sama seperti `kledo_auth_tokens`, tabel ini hanya diakses oleh service role (edge function), jadi RLS diaktifkan tanpa policy untuk mencegah akses dari client.

---

## Flow Lengkap

```text
┌────────────────────────────────────────────────────────────────┐
│           Xendit webhook: payment_session.completed            │
└──────────────────────────┬─────────────────────────────────────┘
                           ▼
            ┌──────────────────────────────┐
            │ Query rapatin_auth_tokens    │
            │ WHERE expires_at > now()     │
            └──────────────────┬───────────┘
                               ▼
              ┌────────────────────────────────┐
              │     Token valid ditemukan?     │
              └───────────────┬────────────────┘
                    ┌─────────┴─────────┐
                   YA                  TIDAK
                    ▼                    ▼
         ┌──────────────────┐  ┌────────────────────┐
         │ Gunakan token    │  │ Login ke Rapatin   │
         │ dari database    │  │ Simpan token baru  │
         └────────┬─────────┘  └──────────┬─────────┘
                  │                       │
                  └───────────┬───────────┘
                              ▼
              ┌───────────────────────────────┐
              │ POST /schedules               │
              │ (Create Zoom meeting)         │
              └───────────────────────────────┘
```

---

## Keuntungan

1. **Efisiensi**: Tidak perlu login setiap kali ada pembayaran sukses
2. **Kecepatan**: Mengurangi 1 API call ke Rapatin
3. **Reliability**: Proses webhook lebih cepat selesai
4. **Konsistensi**: Pendekatan yang sama dengan Kledo caching

---

## Catatan

Karena tidak ada dokumentasi resmi tentang durasi token Rapatin, akan digunakan **7 hari** sebagai expiry default yang aman. Jika di kemudian hari diketahui durasi sebenarnya, bisa disesuaikan.

