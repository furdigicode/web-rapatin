# Memperbaiki `git pull` yang Gagal di Server Self-Hosted

## Apa yang terjadi

`git pull origin main` ditolak bukan karena masalah kode, tapi karena di server ada perubahan lokal pada `package-lock.json` (kemungkinan hasil `npm install` sebelumnya). Git menolak menimpa file yang berubah, jadi merge dibatalkan.

Kabar baiknya: di repo ini `RichTextField.tsx` sudah tidak ada dan tidak ada lagi referensi Tiptap, jadi setelah pull berhasil, build seharusnya lolos.

## Langkah di server (jalankan manual via Termius)

Di `/var/www/app-landing`:

```bash
# 1. Buang perubahan lokal pada lockfile (aman, versi repo yang dipakai)
git checkout -- package-lock.json

# 2. Ambil update terbaru
git pull origin main

# 3. Sinkronkan dependency sesuai lockfile
npm ci   # kalau gagal/lama, pakai: npm install

# 4. Build
npm run build
```

Jika masih ada file lain yang diprotes git, cek dulu dengan `git status`, lalu `git stash` untuk menyimpan sementara atau `git checkout -- <file>` bila memang tidak diperlukan.

## Catatan

- `npm ci` menghapus `node_modules` dan menginstal ulang persis sesuai lockfile — ini mencegah lockfile berubah lagi dan menghindari error "failed to resolve import" di masa depan.
- Tidak ada perubahan kode yang perlu saya lakukan untuk ini; ini murni langkah operasional di server. Kalau mau, saya bisa tambahkan skrip `deploy.sh` di repo yang menjalankan urutan di atas supaya tinggal `./deploy.sh` setiap kali update.
