

# Rencana: Paginasi Tabel Order & Tombol Akses Halaman Order

## Perubahan

### 1. `src/pages/admin/OrderManagement.tsx` — Tambah Paginasi

- Tambah state `currentPage` (default 1) dan konstanta `ITEMS_PER_PAGE = 10`
- Hitung `paginatedOrders` dari `filteredOrders` menggunakan slice
- Render hanya `paginatedOrders` di tabel (bukan `filteredOrders`)
- Tambah komponen paginasi di bawah tabel dengan info "Menampilkan X-Y dari Z order"
- Reset `currentPage` ke 1 ketika filter/search berubah
- Import komponen `Pagination` dari `@/components/ui/pagination`

### 2. `src/components/admin/OrderDetailDialog.tsx` — Tombol Buka Halaman Order

- Di header dialog (sebelah badge status), tambah tombol icon `ExternalLink` yang membuka `/quick-order/{access_slug}` di tab baru via `window.open`
- Hanya tampilkan jika `order.access_slug` tersedia

