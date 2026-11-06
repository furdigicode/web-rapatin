# Tombol Follow Up per user churn

## Yang dibuat
- Kolom baru **Aksi** di tabel User Churn (tab Follow Up) dengan tombol **Follow Up** di tiap baris.
- Klik tombol membuka panel geser dari kanan berisi:
  - Ringkasan user: nama, nomor WA, email, segmen, jumlah jadwal, pemakaian saldo, jadwal terakhir, **sisa saldo**.
  - Pesan siap kirim yang dipersonalisasi otomatis dari data baris, isi berbeda per segmen:
    - **Loyal**: terima kasih sudah rutin pakai Rapatin, sebut jumlah jadwal bulan lalu, ingatkan sisa saldo.
    - **Bulan pertama**: tanya pengalaman pertama, tawarkan bantuan.
    - **Sekali lainnya**: ajak menjadwalkan rapat lagi.
    - Jika sisa saldo > 0: "Saldo kakak masih Rp X, bisa langsung dipakai untuk jadwal berikutnya." Jika 0: ajakan top up.
  - Kolom pesan bisa diedit sebelum dikirim.
  - Tombol **Salin Pesan** dan **Buka WhatsApp** (membuka chat WA ke nomor user dengan pesan terisi; nonaktif jika nomor kosong, nomor otomatis diubah ke format 62).

## Catatan
- Tidak mengirim otomatis dan tidak menyimpan ke database; admin mengirim manual dari WhatsApp.

## Teknis
- Hanya `src/pages/admin/StatistikChurn.tsx`: pakai komponen `Sheet` (side="right"), fungsi `buildMessage(user, bulanBasis, bulanPembanding)`, `Textarea`, `navigator.clipboard`, link `https://wa.me/62...?text=`.
- Data sudah tersedia dari `stats-churn` (name, phone, balance, segment, base_schedules, last_schedule_at) — tidak perlu ubah backend.
