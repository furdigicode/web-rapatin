

# Rencana: Token Caching untuk Kledo Sync

## Masalah Saat Ini

Setiap kali edge function `kledo-sync` dipanggil, selalu melakukan login ke Kledo API untuk mendapatkan token baru, padahal token tersebut valid selama **30 hari**.

## Solusi

Menyimpan token Kledo di tabel database dan menggunakannya kembali jika belum kadaluarsa.

---

## Arsitektur Token Caching

```text
┌─────────────────────────────────────────────────────────────────┐
│                     kledo-sync Edge Function                    │
├─────────────────────────────────────────────────────────────────┤
│  1. Cek token di tabel kledo_auth_tokens                        │
│     ↓                                                           │
│  2. Token ada & belum expired?                                  │
│     ├── YA  → Gunakan token tersebut                            │
│     └── TIDAK → Login ke Kledo, simpan token baru               │
│     ↓                                                           │
│  3. Lanjut proses sync (bankTrans + expense)                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Changes

### Tabel Baru: `kledo_auth_tokens`

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| `id` | uuid | Primary key |
| `access_token` | text | Token dari Kledo API |
| `expires_at` | timestamptz | Waktu kadaluarsa (created_at + 29 hari) |
| `created_at` | timestamptz | Waktu token dibuat |

**Catatan**: Menggunakan 29 hari (bukan 30) sebagai margin keamanan untuk menghindari edge case token expired saat digunakan.

---

## Logika Baru

```typescript
async function getKledoToken(supabase): Promise<string | null> {
  // 1. Cek token yang masih valid di database
  const { data: existingToken } = await supabase
    .from('kledo_auth_tokens')
    .select('access_token, expires_at')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (existingToken?.access_token) {
    console.log("Using cached Kledo token");
    return existingToken.access_token;
  }

  // 2. Token tidak ada atau expired, login baru
  console.log("No valid token, logging in to Kledo...");
  const token = await loginToKledo();
  
  if (!token) return null;

  // 3. Simpan token baru dengan expiry 29 hari
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 29);
  
  await supabase.from('kledo_auth_tokens').insert({
    access_token: token,
    expires_at: expiresAt.toISOString()
  });

  // 4. Hapus token lama (cleanup)
  await supabase
    .from('kledo_auth_tokens')
    .delete()
    .lt('expires_at', new Date().toISOString());

  return token;
}
```

---

## File yang Diubah

| File | Aksi | Deskripsi |
|------|------|-----------|
| `supabase/functions/kledo-sync/index.ts` | Ubah | Implementasi token caching |
| Database migration | Baru | Buat tabel `kledo_auth_tokens` |

---

## RLS Policy

Tabel `kledo_auth_tokens` hanya diakses oleh service role (edge function), jadi tidak perlu policy untuk public access. Cukup enable RLS tanpa policy agar tidak bisa diakses dari client.

---

## Keuntungan

1. **Efisiensi**: Tidak perlu login setiap kali sync
2. **Kecepatan**: Mengurangi 1 API call ke Kledo
3. **Reliability**: Mengurangi kemungkinan rate limiting
4. **Cost**: Mengurangi beban di Kledo API

---

## Flow Lengkap

```text
┌────────────────────────────────────────────────────────────────┐
│                       kledo-sync dipanggil                     │
└──────────────────────────┬─────────────────────────────────────┘
                           ▼
            ┌──────────────────────────────┐
            │ Query kledo_auth_tokens      │
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
         │ Gunakan token    │  │ Login ke Kledo API │
         │ dari database    │  │ Simpan token baru  │
         └────────┬─────────┘  └──────────┬─────────┘
                  │                       │
                  └───────────┬───────────┘
                              ▼
              ┌───────────────────────────────┐
              │ Proses sync (bankTrans +      │
              │ expense) dengan token         │
              └───────────────────────────────┘
```

