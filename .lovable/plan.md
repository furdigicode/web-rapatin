
# Rencana: Perbaiki Logika Timeline - Kadaluarsa vs Dibayar

## Masalah

Dari screenshot terlihat bahwa order yang **sudah dibayar** tetap menampilkan "Kadaluarsa" di timeline. Ini salah karena:

- "Dibayar" dan "Kadaluarsa" adalah **mutually exclusive** (saling meniadakan)
- Jika sudah dibayar → jangan tampilkan Kadaluarsa
- Jika kadaluarsa → jangan tampilkan Dibayar

## Penyebab

Kode saat ini hanya mengecek apakah field ada:

```tsx
// Kode saat ini - SALAH
{order.expired_at && (
  <div>Pembayaran Kadaluarsa: {order.expired_at}</div>
)}
```

Tapi tidak memprioritaskan status. Jika entah bagaimana database memiliki KEDUA `paid_at` dan `expired_at`, keduanya akan ditampilkan.

## Solusi

Ubah kondisi untuk "Kadaluarsa" agar **HANYA tampil jika TIDAK ada paid_at**:

```tsx
// Kode yang benar
{!order.paid_at && order.expired_at && (
  <div>Pembayaran Kadaluarsa: {order.expired_at}</div>
)}
```

## Perubahan Detail

**File:** `src/components/admin/OrderDetailDialog.tsx` (baris 776)

| Sebelum | Sesudah |
|---------|---------|
| `{order.expired_at && (` | `{!order.paid_at && order.expired_at && (` |

## Preview Timeline

### Order yang Sudah Dibayar
```text
Timeline
─────────────────────────────────────
Dibuat              Jumat, 30 Jan 2026 pukul 19:18
Dibayar             Jumat, 30 Jan 2026 pukul 19:19
Email Terkirim      Jumat, 30 Jan 2026 pukul 19:19
Sync Kledo          Jumat, 30 Jan 2026 pukul 19:19

(Kadaluarsa TIDAK tampil meskipun expired_at ada di DB)
```

### Order yang Kadaluarsa (Tidak Dibayar)
```text
Timeline
─────────────────────────────────────
Dibuat                   Jumat, 30 Jan 2026 pukul 19:18
Pembayaran Kadaluarsa    Sabtu, 31 Jan 2026 pukul 19:18

(Dibayar TIDAK tampil karena paid_at kosong)
```

### Order Pending (Belum Dibayar, Belum Kadaluarsa)
```text
Timeline
─────────────────────────────────────
Dibuat              Jumat, 30 Jan 2026 pukul 19:18

(Hanya "Dibuat" yang tampil)
```

## Ringkasan

| File | Baris | Perubahan |
|------|-------|-----------|
| `src/components/admin/OrderDetailDialog.tsx` | 776 | Tambah kondisi `!order.paid_at &&` |

Perubahan ini sangat minimal (1 baris) tapi memperbaiki logika bisnis yang penting.
