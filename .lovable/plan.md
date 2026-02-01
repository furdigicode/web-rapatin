

# Rencana: Perbaiki Kledo Token Retry Mechanism

## Analisis Masalah

Token Kledo yang tersimpan di database (`kledo_auth_tokens`) sudah tidak valid di sisi Kledo, meskipun belum melewati waktu `expires_at` di database kami.

**Data ditemukan:**
- Token tersimpan: `expires_at: 2026-02-28` (seharusnya masih valid)
- Order `INV-260201-0001` gagal: **"Bank transaction failed: Unauthenticated."**
- Artinya Kledo menolak token meskipun secara waktu masih valid

**Root cause:**
Kledo API bisa me-revoke token sebelum waktu expired (misalnya karena perubahan password, logout dari device lain, atau kebijakan keamanan Kledo).

---

## Solusi

Implementasi **retry mechanism** ketika API Kledo mengembalikan error "Unauthenticated":

1. Deteksi response "Unauthenticated" dari Kledo API
2. Hapus token lama dari cache
3. Login ulang untuk mendapatkan token baru
4. Retry request dengan token baru (maksimal 1 kali retry)

---

## Perubahan File

**File:** `supabase/functions/kledo-sync/index.ts`

### 1. Tambahkan fungsi untuk invalidate token

```typescript
/**
 * Invalidate cached token when it's rejected by Kledo
 */
async function invalidateCachedToken(supabase: ReturnType<typeof createClient>): Promise<void> {
  console.log("Invalidating cached Kledo token...");
  const { error } = await supabase
    .from('kledo_auth_tokens')
    .delete()
    .gt('expires_at', new Date().toISOString());
  
  if (error) {
    console.error("Failed to invalidate token:", error);
  }
}
```

### 2. Modifikasi `createBankTransaction` untuk mengembalikan status auth

```typescript
async function createBankTransaction(
  token: string,
  transDate: string,
  memo: string,
  amount: number
): Promise<{ success: boolean; refNumber?: string; error?: string; isAuthError?: boolean }> {
  // ... existing code ...
  
  const result = await response.json();
  
  // Deteksi error autentikasi
  if (!response.ok) {
    const errorMessage = result.message || `HTTP ${response.status}`;
    const isAuthError = response.status === 401 || 
                        errorMessage.toLowerCase().includes('unauthenticated') ||
                        errorMessage.toLowerCase().includes('unauthorized');
    return { success: false, error: errorMessage, isAuthError };
  }
  // ... rest of code ...
}
```

### 3. Modifikasi `createExpense` dengan cara yang sama

```typescript
async function createExpense(
  token: string,
  transDate: string,
  memo: string,
  feeAmount: number,
  methodName: string
): Promise<{ success: boolean; id?: string; error?: string; isAuthError?: boolean }> {
  // ... sama seperti createBankTransaction, tambahkan isAuthError ...
}
```

### 4. Tambahkan retry logic di main handler

```typescript
// Dalam serve handler, setelah mendapatkan token:

let token = await getKledoToken(supabase);
let retryCount = 0;
const MAX_RETRIES = 1;

async function executeKledoSync(): Promise<Response> {
  // Create bank transaction
  const bankTransResult = await createBankTransaction(token, transDate, memo, amount);
  
  // Jika auth error dan belum retry, coba login ulang
  if (!bankTransResult.success && bankTransResult.isAuthError && retryCount < MAX_RETRIES) {
    console.log("Auth error detected, refreshing token and retrying...");
    retryCount++;
    
    // Invalidate old token
    await invalidateCachedToken(supabase);
    
    // Get new token (will force fresh login)
    token = await getKledoToken(supabase);
    if (!token) {
      // ... handle error ...
    }
    
    // Retry
    return executeKledoSync();
  }
  
  // ... rest of existing logic ...
}

return await executeKledoSync();
```

---

## Diagram Flow

```text
┌─────────────────────────────────────────────────────────────┐
│                    KLEDO SYNC REQUEST                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. Ambil token dari cache (kledo_auth_tokens)               │
│    - Jika ada & belum expired → gunakan                     │
│    - Jika tidak ada → login baru                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Panggil Kledo API (createBankTransaction)                │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────────┐
│ SUCCESS                 │     │ ERROR: Unauthenticated      │
│ → Lanjut ke expense     │     │ (isAuthError = true)        │
└─────────────────────────┘     └─────────────────────────────┘
                                              │
                                              ▼
                              ┌───────────────────────────────┐
                              │ 3. Retry Count < MAX_RETRIES? │
                              └───────────────────────────────┘
                                              │
                              ┌───────────────┴───────────────┐
                              ▼                               ▼
                    ┌─────────────────┐          ┌─────────────────┐
                    │ YES             │          │ NO              │
                    │ • Hapus token   │          │ • Return error  │
                    │ • Login ulang   │          │ • Update order  │
                    │ • Retry request │          │   sync_error    │
                    └─────────────────┘          └─────────────────┘
                              │
                              ▼
                    ┌─────────────────────────────────────────────┐
                    │ Kembali ke langkah 2 dengan token baru      │
                    └─────────────────────────────────────────────┘
```

---

## Ringkasan Perubahan

| Komponen | Perubahan |
|----------|-----------|
| `invalidateCachedToken()` | Fungsi baru untuk menghapus token dari cache |
| `createBankTransaction()` | Tambah return `isAuthError` |
| `createExpense()` | Tambah return `isAuthError` |
| Main handler | Tambah retry logic dengan max 1 retry |

---

## Hasil yang Diharapkan

1. **Sebelum:** Token cached yang sudah di-revoke Kledo menyebabkan error permanen
2. **Sesudah:** Sistem otomatis mendeteksi auth error, menghapus token lama, login ulang, dan retry request

