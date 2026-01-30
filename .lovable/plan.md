

# Rencana: Update Label Kledo di Admin Order Detail

## Ringkasan

Mengubah label pada bagian "Sinkronisasi Kledo" di dialog detail order dari **"ID Transaksi"** menjadi **"Nomor Transaksi"**.

---

## Perubahan

| Lokasi | Sebelum | Sesudah |
|--------|---------|---------|
| Baris 627 | `ID Transaksi` | `Nomor Transaksi` |

---

## Kode

```tsx
// SEBELUM (baris 627)
<span className="text-muted-foreground">ID Transaksi</span>

// SESUDAH
<span className="text-muted-foreground">Nomor Transaksi</span>
```

---

## Tampilan di UI

**Sinkronisasi Kledo**

| Field | Value |
|-------|-------|
| Status | ✓ Tersinkronisasi |
| Nomor Transaksi | `BANK/00902` |
| Waktu Sync | Kamis, 30 Januari 2026 pukul 15:30 |

---

## File yang Diubah

| File | Aksi |
|------|------|
| `src/components/admin/OrderDetailDialog.tsx` | Ubah label dari "ID Transaksi" ke "Nomor Transaksi" |

