

# Rencana: Custom Slug untuk Quick Order Detail

## Ringkasan
Mengganti penggunaan UUID Order ID dengan slug custom yang di-generate sistem menggunakan kombinasi huruf besar, kecil, dan angka sepanjang 24 karakter untuk meningkatkan keamanan akses halaman detail order.

## Analisis Keamanan

| Pendekatan | Entropy | Kemungkinan Tebak |
|------------|---------|-------------------|
| UUID (hex) | ~122 bit | Sulit, tapi bisa bocor |
| Custom 24 char (62 alphabet) | ~143 bit | Sangat sulit ditebak |

Contoh slug: `A7kx9Ym2PqR5wN8vL3jB6tCs`

## Perubahan Database

### Tambah Kolom Baru: `access_slug`
```sql
ALTER TABLE guest_orders 
ADD COLUMN access_slug TEXT UNIQUE;

-- Buat index untuk lookup cepat
CREATE UNIQUE INDEX idx_guest_orders_access_slug ON guest_orders(access_slug);
```

## File yang Diubah

### 1. Database Migration
Tambah kolom `access_slug` ke tabel `guest_orders`

### 2. `supabase/functions/create-guest-order/index.ts`
- Generate slug 24 karakter saat membuat order
- Simpan ke kolom `access_slug`
- Update redirect URL Xendit ke format baru
- Return `access_slug` di response

### 3. `supabase/functions/check-order-status/index.ts`
- Ubah query untuk lookup berdasarkan `access_slug` (bukan `id`)
- Tetap support query by `id` untuk admin

### 4. `src/pages/QuickOrderDetail.tsx`
- Ubah parameter URL dari `orderId` menjadi `slug`
- Update fetch untuk menggunakan slug

### 5. `src/components/quick-order/LegacyRedirect.tsx`
- Update untuk handle format lama

### 6. `src/App.tsx`
- Update route pattern

## Detail Implementasi

### Fungsi Generate Slug (Edge Function)
```typescript
function generateAccessSlug(length: number = 24): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => chars[byte % chars.length]).join('');
}
```

### Perubahan URL

| Sebelum | Sesudah |
|---------|---------|
| `/quick-order/550e8400-e29b-41d4-a716-446655440000` | `/quick-order/A7kx9Ym2PqR5wN8vL3jB6tCs` |

### Update create-guest-order
```typescript
// Generate secure access slug
const accessSlug = generateAccessSlug(24);

// Insert ke database dengan access_slug
const { data: order, error: dbError } = await supabase
  .from("guest_orders")
  .insert({
    // ... fields lainnya
    access_slug: accessSlug,
  })
  .select()
  .single();

// Update Xendit redirect URLs
success_redirect_url: `https://rapatin.lovable.app/quick-order/${accessSlug}`,
failure_redirect_url: `https://rapatin.lovable.app/quick-order/${accessSlug}`,

// Return access_slug di response
return new Response(
  JSON.stringify({
    success: true,
    order_id: order.id,
    access_slug: accessSlug,  // Untuk redirect frontend
    invoice_url: xenditInvoice.invoice_url,
  }),
  // ...
);
```

### Update check-order-status
```typescript
// Query berdasarkan access_slug
let query = supabase
  .from('guest_orders')
  .select('...');

// Support slug (public) dan id (admin)
const slug = url.searchParams.get('slug');
const orderId = url.searchParams.get('order_id');

if (slug) {
  query = query.eq('access_slug', slug);
} else if (orderId) {
  query = query.eq('id', orderId);
}
```

### Update QuickOrderDetail.tsx
```typescript
export default function QuickOrderDetail() {
  const { slug } = useParams<{ slug: string }>();
  
  const fetchOrder = useCallback(async () => {
    const response = await fetch(
      `https://mepznzrijuoyvjcmkspf.supabase.co/functions/v1/check-order-status?slug=${slug}`,
      // ...
    );
  }, [slug]);
}
```

### Update App.tsx Route
```typescript
// Ganti orderId dengan slug
<Route path="/quick-order/:slug" element={<QuickOrderDetail />} />
```

## Alur Lengkap

```text
1. User submit Quick Order Form
   ↓
2. Edge function generate slug: "A7kx9Ym2PqR5wN8vL3jB6tCs"
   ↓
3. Simpan ke database dengan kolom access_slug
   ↓
4. Set Xendit redirect ke /quick-order/A7kx9Ym2PqR5wN8vL3jB6tCs
   ↓
5. Return slug ke frontend
   ↓
6. Frontend redirect ke /quick-order/A7kx9Ym2PqR5wN8vL3jB6tCs
   ↓
7. Halaman QuickOrderDetail fetch data via slug
```

## Keunggulan Pendekatan Ini

1. **URL Lebih Pendek**: 24 karakter vs 36 karakter UUID
2. **Entropy Tinggi**: ~143 bit, sangat sulit ditebak secara brute-force
3. **Tidak Bocorkan Struktur**: UUID bisa menunjukkan pola database
4. **Backward Compatible**: Tetap bisa lookup by ID untuk keperluan admin
5. **No Extra Auth Required**: Customer cukup punya link untuk akses

## Urutan Implementasi

1. **Database Migration** - Tambah kolom `access_slug`
2. **Update create-guest-order** - Generate dan simpan slug
3. **Update check-order-status** - Query by slug
4. **Update QuickOrderDetail.tsx** - Gunakan slug dari URL
5. **Update App.tsx** - Ganti route parameter
6. **Update LegacyRedirect** - Handle format lama

