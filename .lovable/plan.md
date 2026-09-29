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
6. Log: merchantOrderId, URL tujuan, status respons, durasi.

## Cara uji coba
- Tim Member membuat invoice di Duitku sandbox dengan `callbackUrl` = `https://mepznzrijuoyvjcmkspf.supabase.co/functions/v1/duitku-callback`.
- Bayar di simulator sandbox, lalu cek log Edge Function `duitku-callback` dan endpoint Member.
- Saya juga akan mengirim satu callback tiruan (order ID palsu) untuk memastikan penerusan sampai ke `dev.rapatin.id`.

## Catatan teknis
- Hanya `supabase/functions/duitku-callback/index.ts` yang diubah, plus satu secret baru.
- Quick Order tidak terpengaruh.
