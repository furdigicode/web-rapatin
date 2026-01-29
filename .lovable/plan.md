
# Rencana: Perbaiki Data Zoom Tidak Muncul Setelah Disimpan

## Masalah

Setelah admin mengisi dan menyimpan detail Zoom di order yang belum ada Zoom-nya, data tidak muncul. UI tetap menampilkan "Zoom meeting belum tersedia" meskipun data sudah tersimpan di database.

## Penyebab

Ada 2 masalah:

### Masalah 1: hasZoomData mengecek dari prop yang stale
```tsx
// Line 162 - Mengecek dari prop order yang BELUM terupdate
const hasZoomData = order.zoom_link || order.meeting_id || order.zoom_passcode;
```

Setelah save berhasil:
1. `onUpdate()` memanggil `refetch()` di parent
2. Data `orders` array di-refresh
3. **TAPI** `selectedOrder` di parent masih menyimpan data lama
4. Prop `order` di dialog tidak berubah
5. `hasZoomData` tetap `false`

### Masalah 2: Parent tidak update selectedOrder
Di `OrderManagement.tsx`:
```tsx
const handleOrderUpdate = () => {
  refetch(); // Hanya refresh orders array
  // selectedOrder TIDAK diupdate!
};
```

## Solusi

### Opsi A: Gunakan zoomData untuk menentukan hasZoomData (Dialog-side fix)

Setelah save berhasil, gunakan state `zoomData` yang sudah terisi (bukan prop `order`) untuk menentukan apakah sudah ada Zoom data:

```tsx
// Sebelum
const hasZoomData = order.zoom_link || order.meeting_id || order.zoom_passcode;

// Sesudah - cek dari zoomData state juga
const hasZoomData = 
  order.zoom_link || order.meeting_id || order.zoom_passcode ||
  zoomData.zoom_link || zoomData.meeting_id || zoomData.zoom_passcode;
```

### Opsi B: Parent update selectedOrder setelah refetch (Parent-side fix) - REKOMENDASI

Ubah handler di parent untuk mengupdate `selectedOrder` dengan data terbaru setelah refetch:

```tsx
const handleOrderUpdate = async () => {
  const { data } = await refetch();
  // Update selectedOrder dengan data terbaru
  if (selectedOrder && data) {
    const updatedOrder = data.find(o => o.id === selectedOrder.id);
    if (updatedOrder) {
      setSelectedOrder(updatedOrder);
    }
  }
};
```

### Rekomendasi: Gabungan Opsi A + B

Untuk user experience terbaik, gabungkan kedua fix:
- **Opsi A (immediate)**: Data langsung muncul setelah save tanpa menunggu refetch
- **Opsi B (sync)**: selectedOrder tetap sinkron dengan data database

---

## Perubahan Kode

### File 1: `src/components/admin/OrderDetailDialog.tsx`

**Ubah baris 162:**

Dari:
```tsx
const hasZoomData = order.zoom_link || order.meeting_id || order.zoom_passcode;
```

Ke:
```tsx
// Cek dari order prop ATAU zoomData state (untuk immediate feedback setelah save)
const hasZoomData = 
  order.zoom_link || order.meeting_id || order.zoom_passcode ||
  zoomData.zoom_link || zoomData.meeting_id || zoomData.zoom_passcode;
```

**Untuk read-only display, gunakan zoomData sebagai sumber data (bukan order):**

Pada section read-only (baris 357-417), ganti referensi dari `order.meeting_id`, `order.zoom_passcode`, `order.zoom_link` ke `zoomData.meeting_id`, `zoomData.zoom_passcode`, `zoomData.zoom_link`.

---

### File 2: `src/pages/admin/OrderManagement.tsx`

**Ubah handleOrderUpdate (baris 66-68):**

Dari:
```tsx
const handleOrderUpdate = () => {
  refetch();
};
```

Ke:
```tsx
const handleOrderUpdate = async () => {
  const { data } = await refetch();
  // Update selectedOrder dengan data terbaru dari database
  if (selectedOrder && data) {
    const updatedOrder = data.find(o => o.id === selectedOrder.id);
    if (updatedOrder) {
      setSelectedOrder(updatedOrder);
    }
  }
};
```

---

## Rangkuman File yang Diubah

| File | Perubahan |
|------|-----------|
| `src/components/admin/OrderDetailDialog.tsx` | Ubah `hasZoomData` untuk cek dari `zoomData` state juga, dan gunakan `zoomData` untuk display read-only |
| `src/pages/admin/OrderManagement.tsx` | Update `selectedOrder` setelah refetch |

---

## Hasil Akhir

Setelah admin simpan detail Zoom:
1. UI langsung menampilkan data yang baru dimasukkan (dari `zoomData` state)
2. `selectedOrder` di parent juga terupdate dengan data terbaru dari database
3. Icon status Zoom di tabel utama juga ikut terupdate (dari refetch)
