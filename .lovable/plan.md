

# Fix: Sidebar Mobile & Order Page Responsiveness

## Masalah yang Teridentifikasi

1. **Sidebar mobile**: Pada viewport sempit, konten halaman tidak dibatasi lebarnya sehingga halaman bisa scroll horizontal (terlihat scrollbar di bawah pada screenshot)
2. **Stats cards**: Grid menampilkan 1 kolom pada mobile — seharusnya minimal 2 kolom
3. **Tabel overflow**: Table overflow keluar dari container Card, menyebabkan seluruh halaman ikut scroll horizontal

## Perubahan

### 1. `src/components/admin/AdminLayout.tsx`
- Tambah `overflow-hidden` pada wrapper `SidebarInset` agar konten tidak meluap keluar viewport
- Ubah `<main>` menjadi `overflow-x-hidden` untuk mencegah scroll horizontal halaman

### 2. `src/pages/admin/OrderManagement.tsx`
- Stats grid: ubah `grid-cols-1 sm:grid-cols-2` → `grid-cols-2 lg:grid-cols-4` agar selalu 2 kolom minimum
- Card tabel: tambah `overflow-hidden` pada Card agar tabel hanya scroll di dalam container-nya
- StatCard: kurangi padding di mobile (`p-4 sm:p-6`) dan font size (`text-2xl sm:text-3xl`)

| File | Perubahan |
|------|-----------|
| `AdminLayout.tsx` | Tambah overflow constraint pada SidebarInset/main |
| `OrderManagement.tsx` | Stats grid 2 kolom, Card overflow-hidden, StatCard padding responsif |

