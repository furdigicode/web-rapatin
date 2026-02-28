

# Rencana: Responsif Mobile untuk Seluruh Halaman Admin

## Halaman yang Perlu Diubah

### 1. `src/components/admin/AdminLayout.tsx`
- Ubah `p-6` pada `<main>` menjadi `p-4 sm:p-6` agar padding lebih kecil di mobile

### 2. `src/pages/admin/FeedbackManagement.tsx`
- Stats grid: ubah `grid-cols-1 md:grid-cols-5` → `grid-cols-2 sm:grid-cols-3 md:grid-cols-5`
- Tambah `overflow-x-auto` wrapper di sekitar Table
- Header card (judul + Export CSV button): buat responsive dengan flex-col di mobile

### 3. `src/pages/admin/VotingResults.tsx`
- Header: ubah `flex items-center justify-between` → `flex flex-col sm:flex-row gap-4`
- Search box: ubah `w-64` → `w-full sm:w-64`
- Tambah `overflow-x-auto` wrapper di sekitar Table responden
- Responden card header: buat flex-col di mobile

### 4. `src/components/admin/VotingList.tsx`
- Filter row: ubah `flex items-center gap-4` → `flex flex-col sm:flex-row gap-4`
- SelectTrigger: ubah `w-[180px]` → `w-full sm:w-[180px]`
- Tambah `overflow-x-auto` pada table wrapper
- Action buttons di tabel: wrap agar tidak overflow

### 5. `src/pages/admin/Dashboard.tsx`
- Sudah responsif, tidak perlu perubahan

### 6. `src/pages/admin/OrderManagement.tsx`
- Sudah responsif, tidak perlu perubahan

### 7. `src/components/admin/OrderDetailDialog.tsx`
- Dialog title: ubah flex agar wrap di mobile, order number di bawah pada layar kecil

### 8. `src/pages/admin/BlogManagement.tsx`
- Sudah memiliki layout mobile/desktop terpisah, tidak perlu perubahan

### 9. `src/pages/admin/Login.tsx`
- Sudah responsif, tidak perlu perubahan

## Ringkasan: 5 file diubah
| File | Perubahan |
|------|-----------|
| AdminLayout.tsx | Padding responsif |
| FeedbackManagement.tsx | Stats grid, table overflow, header layout |
| VotingResults.tsx | Header wrap, search width, table overflow |
| VotingList.tsx | Filter wrap, select width, table overflow |
| OrderDetailDialog.tsx | Dialog title wrap |

