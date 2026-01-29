
# Rencana: Admin Edit Detail Zoom Meeting

## Ringkasan

Menambahkan antarmuka di panel admin (OrderDetailDialog) agar admin dapat secara manual menambahkan atau mengedit detail Zoom Meeting (Meeting ID, Passcode, dan Link) ketika pembuatan otomatis gagal.

---

## Analisis Kondisi Saat Ini

### Halaman QuickOrderDetail (User-Facing)
Sudah memiliki mekanisme fallback yang baik:
- Jika `payment_status = 'paid'` dan `zoom_link` kosong setelah 5 menit → Menampilkan kartu error dengan tombol "Hubungi Admin via WhatsApp"
- Dalam 5 menit pertama → Menampilkan loading state
- Tidak ada perubahan yang diperlukan di sini

### OrderDetailDialog (Admin Panel)
Saat ini hanya menampilkan info Zoom secara read-only. Perlu ditambahkan kemampuan edit untuk:
- `meeting_id`
- `zoom_passcode`
- `zoom_link`

---

## Perubahan yang Diperlukan

### File: `src/components/admin/OrderDetailDialog.tsx`

#### 1. Tambah State untuk Mode Edit

```tsx
const [isEditing, setIsEditing] = useState(false);
const [zoomData, setZoomData] = useState({
  meeting_id: order?.meeting_id || '',
  zoom_passcode: order?.zoom_passcode || '',
  zoom_link: order?.zoom_link || ''
});
const [saving, setSaving] = useState(false);
```

#### 2. Tambah Fungsi Save

```tsx
const handleSaveZoomDetails = async () => {
  setSaving(true);
  const { error } = await supabase
    .from('guest_orders')
    .update({
      meeting_id: zoomData.meeting_id || null,
      zoom_passcode: zoomData.zoom_passcode || null,
      zoom_link: zoomData.zoom_link || null
    })
    .eq('id', order.id);
  
  if (error) {
    toast({ title: "Gagal menyimpan", variant: "destructive" });
  } else {
    toast({ title: "Berhasil disimpan" });
    setIsEditing(false);
    // Trigger refresh
  }
  setSaving(false);
};
```

#### 3. Update UI Section "Info Zoom"

**Tampilan Baru:**

```
┌─────────────────────────────────────────┐
│ Info Zoom                    [✏️ Edit]  │
├─────────────────────────────────────────┤
│                                         │
│ Meeting ID                              │
│ ┌─────────────────────────────────────┐ │
│ │ [Input field or display code]    [📋]│ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Passcode                                │
│ ┌─────────────────────────────────────┐ │
│ │ [Input field or display code]    [📋]│ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Link                                    │
│ ┌─────────────────────────────────────┐ │
│ │ [Input field or display code]    [📋]│ │
│ └─────────────────────────────────────┘ │
│                                         │
│ (Mode Edit: [Batal] [💾 Simpan])        │
└─────────────────────────────────────────┘
```

---

## Logika Tampilan

| Kondisi | UI yang Ditampilkan |
|---------|---------------------|
| `payment_status != 'paid'` | Tidak tampilkan section Info Zoom |
| `paid` + data ada + tidak edit | Read-only display + tombol Edit |
| `paid` + data kosong + tidak edit | Empty state + tombol "Tambah Detail Zoom" |
| `paid` + mode edit | Form input + tombol Simpan/Batal |

---

## Tampilan Empty State (Zoom Gagal Dibuat)

```
┌─────────────────────────────────────────┐
│ Info Zoom                               │
├─────────────────────────────────────────┤
│                                         │
│    ⚠️  Zoom meeting belum tersedia      │
│                                         │
│    Klik tombol di bawah untuk           │
│    menambahkan detail secara manual     │
│                                         │
│         [➕ Tambah Detail Zoom]          │
│                                         │
└─────────────────────────────────────────┘
```

---

## Alur Kerja Admin

1. Admin menerima pesan WhatsApp dari customer yang Zoom-nya gagal dibuat
2. Admin membuka Order Management → klik View pada order tersebut
3. Di dialog detail, section "Info Zoom" menampilkan empty state
4. Admin klik "Tambah Detail Zoom" → form input muncul
5. Admin mengisi Meeting ID, Passcode, dan Link dari Zoom yang dibuat manual
6. Admin klik "Simpan"
7. Customer me-refresh halaman Quick Order Detail → data Zoom muncul

---

## Komponen yang Diperlukan

| Komponen | Sumber | Status |
|----------|--------|--------|
| Input | `@/components/ui/input` | Perlu import |
| Loader2 | `lucide-react` | Sudah ada di project |
| Pencil | `lucide-react` | Perlu import |
| Save | `lucide-react` | Perlu import |
| Plus | `lucide-react` | Perlu import |
| supabase | `@/integrations/supabase/client` | Perlu import |

---

## Keamanan

- RLS policy `is_admin_user()` sudah ada untuk UPDATE pada tabel `guest_orders`
- Admin harus login via admin panel sebelum bisa edit
- Tidak ada data sensitif yang di-expose

---

## Perubahan Props

Menambahkan prop `onUpdate` untuk trigger refresh setelah save:

```tsx
interface OrderDetailDialogProps {
  order: GuestOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void; // NEW
}
```

---

## File yang Diubah

| File | Perubahan |
|------|-----------|
| `src/components/admin/OrderDetailDialog.tsx` | Tambah mode edit untuk detail Zoom |
| `src/pages/admin/OrderManagement.tsx` | Passing `onUpdate` prop untuk refetch data |

---

## Catatan Teknis

- Menggunakan `useQueryClient().invalidateQueries(['guest-orders'])` untuk refetch setelah update
- Form edit hanya muncul jika `payment_status === 'paid'`
- Validasi minimal: zoom_link harus URL valid jika diisi
