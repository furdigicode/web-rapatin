# Teruskan callback Duitku ke Dashboard Member (sandbox)

## Tujuan
Callback Duitku yang bukan milik Quick Order diteruskan ke `https://dev.rapatin.id/webhook/duitku`, supaya tim Member bisa mulai uji coba.

## Alur baru di `duitku-callback`
```text
Callback masuk
  -> cari merchantOrderId di guest_orders
     -> ketemu  : cek signature (production), proses Quick Order seperti sekarang
     -> tidak ada: teruskan payload ASLI ke URL Member, balas ke Duitku sesuai respons Member
```

## Detail
1. URL tujuan disimpan sebagai pengaturan rahasia `MEMBER_DUITKU_WEBHOOK_URL` = `https://dev.rapatin.id/webhook/duitku`. Nanti tinggal diganti ke URL production tanpa ubah kode.
2. Payload diteruskan persis seperti yang dikirim Duitku (form-urlencoded, isi sama), sehingga Member tetap bisa memverifikasi signature sendiri.
3. Untuk order Member, signature **tidak** dicek di sisi kita. Alasannya: uji coba sandbox Member memakai merchant code/API key sandbox yang berbeda dari Quick Order (production). Member yang wajib memverifikasi.
4. Ditambahkan header `X-Rapatin-Forwarded: duitku-callback` agar Member tahu asal request.
5. Batas waktu 10 detik. Status dan isi respons Member diteruskan balik ke Duitku (gagal/timeout -> 502, sehingga Duitku akan retry).
6. Setiap callback (Quick Order maupun Member) dicatat ke tabel log: waktu, merchantOrderId, tujuan (Quick Order / Member), payload, status & isi respons Member, durasi, error.

## Halaman admin "Monitor Callback Duitku"
- Menu baru di panel admin, halaman `/admin/duitku-callbacks`.
- Tabel daftar callback terbaru: waktu, order ID, tujuan, resultCode, status (berhasil / gagal), durasi.
- Filter: tujuan (Semua / Quick Order / Member), status, pencarian order ID.
- Klik baris untuk melihat detail payload dan respons Member (JSON).
- Tombol "Kirim Ulang" untuk callback Member yang gagal, dan tombol refresh.

## Cara uji coba
- Tim Member membuat invoice di Duitku sandbox dengan `callbackUrl` = `https://mepznzrijuoyvjcmkspf.supabase.co/functions/v1/duitku-callback`.
- Bayar di simulator sandbox, lalu cek halaman monitor dan endpoint Member.
- Saya juga akan mengirim satu callback tiruan (order ID palsu) untuk memastikan penerusan sampai ke `dev.rapatin.id`.

## Catatan teknis
- Tabel baru `duitku_callback_log` (RLS: hanya admin bisa baca; tulis via service role).
- Edge function baru `duitku-callback-admin` (verifikasi sesi admin, list + resend).
- Ubah `duitku-callback/index.ts`, tambah halaman admin + route + menu di `AdminLayout`.
- Quick Order tidak terpengaruh.
