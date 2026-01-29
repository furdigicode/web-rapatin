
# Rencana: Perbaiki Bug Input Zoom Kehilangan Fokus

## Masalah

Ketika mengetik di input field Info Zoom (Meeting ID, Passcode, atau Link), setiap karakter yang diketik menyebabkan input kehilangan fokus. User harus klik ulang input setiap kali ingin mengetik.

## Penyebab

Komponen `ZoomInfoSection` didefinisikan sebagai fungsi di dalam komponen `OrderDetailDialog` (baris 176-354). Setiap kali state berubah (termasuk `zoomData` saat mengetik):

1. `OrderDetailDialog` di-render ulang
2. `ZoomInfoSection` dibuat ulang sebagai fungsi baru
3. React menganggap ini komponen berbeda
4. React unmount komponen lama dan mount komponen baru
5. Input field kehilangan fokus

## Solusi

Menghapus `ZoomInfoSection` sebagai nested component dan memindahkan JSX-nya langsung ke dalam return statement. Dengan cara ini, tidak ada komponen baru yang dibuat ulang setiap render.

## Perubahan Kode

### File: `src/components/admin/OrderDetailDialog.tsx`

**Sebelum:**
```tsx
// Zoom Info Section Component (Line 175-354)
const ZoomInfoSection = () => {
  if (order.payment_status !== 'paid') return null;
  // ... semua logika rendering
};

return (
  <Dialog>
    {/* ... */}
    <ZoomInfoSection />  {/* ← Ini menyebabkan masalah */}
    {/* ... */}
  </Dialog>
);
```

**Sesudah:**
```tsx
// Hapus definisi ZoomInfoSection sebagai fungsi
// Langsung render JSX di dalam return statement

return (
  <Dialog>
    {/* ... */}
    
    {/* Info Zoom Section - langsung inline */}
    {order.payment_status === 'paid' && (
      <>
        <Separator />
        <div className="space-y-3">
          {isEditing ? (
            // Edit mode JSX langsung di sini
            <div className="grid gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="meeting_id">Meeting ID</Label>
                <Input
                  id="meeting_id"
                  placeholder="Contoh: 123 456 7890"
                  value={zoomData.meeting_id}
                  onChange={(e) => setZoomData({ ...zoomData, meeting_id: e.target.value })}
                />
              </div>
              {/* ... input lainnya */}
            </div>
          ) : hasZoomData ? (
            // Read-only display
          ) : (
            // Empty state
          )}
        </div>
      </>
    )}
    
    {/* ... */}
  </Dialog>
);
```

## Detail Teknis

| Aspek | Sebelum | Sesudah |
|-------|---------|---------|
| Definisi | Nested function component | Inline JSX |
| Re-render | Komponen baru setiap render | Tetap sama |
| Fokus input | Hilang | Tetap |

## Langkah Implementasi

1. Hapus definisi fungsi `ZoomInfoSection` (baris 175-354)
2. Di baris 442 (tempat `<ZoomInfoSection />` dipanggil), ganti dengan JSX langsung yang mencakup:
   - Kondisi `order.payment_status === 'paid'`
   - Logika `isEditing` untuk mode edit
   - Logika `hasZoomData` untuk empty state vs read-only

## Dampak

- ✅ Input tidak akan kehilangan fokus saat mengetik
- ✅ Tidak ada perubahan visual/fungsional lainnya
- ✅ Performa tetap sama
