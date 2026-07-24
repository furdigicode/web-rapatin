## Tujuan

1. **Pertahankan** alur input manual Zoom di dialog Detail Order (tidak diubah).
2. **Tambah** tombol "Regenerate Jadwal Rapatin" sebagai opsi pemulihan otomatis ketika API Rapatin gagal / timeout saat webhook `paid`.
3. **Dialog Detail Order** memakai tinggi statis (konsisten di semua kondisi konten) dengan scroll internal yang berfungsi.

## Konteks

- `supabase/functions/xendit-webhook/index.ts` memanggil `createRapatinSchedule` (POST `https://api.rapatin.id/schedules`) saat pembayaran `paid`. Kalau gagal / timeout, order tetap `paid` tapi `rapatin_order_id`, `zoom_link`, `meeting_id`, `zoom_passcode` kosong.
- Sekarang admin cuma bisa isi manual di dialog (form yang sudah ada). Setelah perubahan ini, admin punya dua opsi berdampingan: **regenerate via API** atau **isi manual** seperti biasa.
- `DialogContent` sekarang pakai `max-w-2xl max-h-[90vh] overflow-y-auto` sehingga tinggi mengikuti isi (kecil untuk order simpel, hampir 90vh untuk order recurring), dan header ikut tergulir.

## Rencana

### 1. Edge function baru: `regenerate-rapatin-schedule`

File: `supabase/functions/regenerate-rapatin-schedule/index.ts`.

- Input: `{ orderId: string }`, POST, CORS via `npm:@supabase/supabase-js@2/cors`.
- Auth: batasi ke admin — panggil `is_admin_user()` RPC dengan client yang membawa JWT caller (pola yang sama dipakai fungsi admin lain; verifikasi saat implementasi dan fallback ke pengecekan `admin_users.email` bila diperlukan). Reject 401/403 kalau bukan admin.
- Alur:
  1. Load `guest_orders` by id (pakai service role).
  2. Validasi `payment_status = 'paid'`. Tolak kalau bukan.
  3. Guard: kalau `rapatin_order_id` sudah terisi → tolak (kecuali `force: true` dilempar dari UI setelah konfirmasi eksplisit).
  4. Panggil `createRapatinSchedule` dengan parameter sesuai kolom order (topic, tanggal, jam, passcode custom/generate, semua flag meeting, semua field recurring — 1:1 dengan yang dikirim webhook). Set `AbortSignal.timeout(45_000)` agar fungsi tidak menggantung menunggu Rapatin.
  5. Sukses → update `rapatin_order_id`, `zoom_link`, `zoom_passcode`, `meeting_id`. Return `{ ok: true, data }`.
  6. Gagal → return `{ ok: false, error, rapatin_status }`. Jangan sentuh kolom Zoom.
- Refactor: pindahkan `getRapatinToken`, `createRapatinSchedule`, `PARTICIPANT_TO_PRODUCT_ID`, `generatePasscode` dari `xendit-webhook` ke `supabase/functions/_shared/rapatin.ts` supaya dipakai dua fungsi tanpa duplikasi. Perilaku webhook tidak berubah.

### 2. UI: tombol "Regenerate Jadwal Rapatin" — mendampingi input manual

File: `src/components/admin/OrderDetailDialog.tsx`.

- **Input manual TIDAK dihapus** — tetap seperti sekarang (form Meeting ID / Passcode / Link Zoom + tombol "Isi manual" / Simpan / Batal).
- Tambah tombol baru di section Zoom (di atas atau bersebelahan dengan tombol "Isi manual"): label "Regenerate Jadwal Rapatin", icon `RefreshCw`, variant `outline`.
- Kondisi tampil: `payment_status === 'paid'` **dan** `!rapatin_order_id`. Boleh tampil meskipun admin sudah isi zoom manual — dalam kasus itu tombol pakai variant `secondary` dan konfirmasi memperingatkan bahwa data manual akan ditimpa hasil dari Rapatin.
- Handler: `AlertDialog` konfirmasi (menampilkan topik + tanggal + waktu + peserta) → `supabase.functions.invoke('regenerate-rapatin-schedule', { body: { orderId } })` → toast sukses/gagal → `onUpdate()` untuk refresh order.
- Loading state pakai `Loader2`; disable tombol input manual selama regenerate berjalan.

### 3. Dialog tinggi statis + scroll internal

File yang sama.

Ubah `DialogContent` jadi kolom tinggi tetap dengan body scrollable:

```tsx
<DialogContent className="max-w-2xl h-[85vh] p-0 flex flex-col overflow-hidden">
  <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0"> … </DialogHeader>
  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
    {/* seluruh section konten */}
  </div>
</DialogContent>
```

- Hapus `max-h-[90vh] overflow-y-auto` di root.
- Tinggi `h-[85vh]` konsisten untuk order simpel maupun recurring panjang; verifikasi scroll dengan order recurring 20+ sesi.
- Header (nomor order + status + tombol buka halaman publik) tetap terlihat tanpa ikut scroll.

## Cakupan yang TIDAK diubah

- Alur pembayaran, Kledo sync, email, WhatsApp, notifikasi admin.
- Skema DB, RLS, GRANT.
- Form input manual Zoom (perilaku persis sekarang).
- Halaman lain (SEO landing, blog, KirimChat, dsb).

## Klarifikasi

Tinggi dialog `h-[85vh]` cocok untuk laptop 13"+. Kalau Anda mau angka spesifik lain (mis. `h-[80vh]` atau cap `min(720px, 85vh)`), sebutkan — kalau tidak, saya pakai `85vh`.
