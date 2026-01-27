

# Rencana: Halaman Quick Order untuk Guest

## Ringkasan
Membuat halaman order khusus untuk tamu (guest checkout) di website Rapatin, yang memungkinkan user memesan meeting Zoom sekali pakai tanpa perlu mendaftar ke aplikasi. Proses pembayaran menggunakan Xendit, dan setelah pembayaran sukses, sistem akan otomatis memanggil API aplikasi Rapatin untuk membuat jadwal meeting.

## Alur Proses (User Flow)

```text
+-------------------+     +------------------+     +-------------------+
|  1. Guest mengisi |---->| 2. Pilih paket & |---->| 3. Redirect ke    |
|     form order    |     |    konfirmasi    |     |    Xendit payment |
+-------------------+     +------------------+     +-------------------+
                                                            |
                                                            v
+-------------------+     +------------------+     +-------------------+
|  6. Terima email  |<----| 5. Panggil API   |<----| 4. Xendit webhook |
|     konfirmasi    |     |    Rapatin App   |     |    sukses bayar   |
+-------------------+     +------------------+     +-------------------+
```

## Langkah Implementasi

### 1. Database - Tabel Order Guest
Membuat tabel baru untuk menyimpan order dari guest:

**Tabel: `guest_orders`**
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | uuid | Primary key |
| name | text | Nama pemesan |
| email | text | Email pemesan |
| whatsapp | text | Nomor WhatsApp |
| meeting_date | date | Tanggal meeting |
| participant_count | integer | Jumlah peserta (100/300/500/1000) |
| price | integer | Harga dalam Rupiah |
| payment_method | text | QRIS/VA/E-Wallet |
| payment_status | text | pending/paid/failed/expired |
| xendit_invoice_id | text | ID Invoice dari Xendit |
| xendit_invoice_url | text | URL pembayaran Xendit |
| rapatin_order_id | text | ID order dari API Rapatin (setelah sukses) |
| zoom_link | text | Link Zoom (dari API Rapatin) |
| created_at | timestamp | Waktu order dibuat |
| paid_at | timestamp | Waktu pembayaran berhasil |
| expired_at | timestamp | Waktu kadaluarsa pembayaran |

### 2. Edge Functions

#### a. `create-guest-order` (POST)
- Menerima data form dari halaman Quick Order
- Validasi input (nama, email, WhatsApp, tanggal, jumlah peserta)
- Hitung harga berdasarkan jumlah peserta
- Buat invoice di Xendit menggunakan API
- Simpan order ke database dengan status "pending"
- Return URL pembayaran Xendit

#### b. `xendit-webhook` (POST)  
- Menerima callback dari Xendit saat pembayaran berhasil/gagal
- Verifikasi signature webhook dari Xendit
- Update status order di database
- Jika sukses: panggil API Rapatin untuk buat jadwal meeting
- Simpan hasil (zoom_link, rapatin_order_id) ke database
- Kirim notifikasi email ke guest (opsional, bisa pakai Xendit notification)

#### c. `check-order-status` (GET)
- Endpoint untuk cek status order berdasarkan order ID
- Digunakan di halaman konfirmasi untuk polling status

### 3. Halaman Frontend

#### a. `/quick-order` - Halaman Form Order
**Komponen:**
- Hero section dengan penjelasan singkat
- Form input:
  - Nama lengkap
  - Email
  - WhatsApp
  - Date picker (tanggal meeting)
  - Dropdown jumlah peserta (100/300/500/1000)
- Pricing card yang update dinamis berdasarkan pilihan
- Tombol "Bayar Sekarang"
- Metode pembayaran yang didukung (QRIS, VA, E-Wallet)

**UI/UX:**
- Desain clean dan fokus pada konversi
- Mobile-friendly
- Loading state saat proses pembayaran
- Error handling yang jelas

#### b. `/quick-order/payment` - Redirect ke Xendit
- Halaman loading singkat sebelum redirect ke Xendit
- Atau embed Xendit checkout (jika tersedia)

#### c. `/quick-order/success` - Konfirmasi Sukses
- Menampilkan detail order
- Link Zoom meeting
- Instruksi selanjutnya
- Opsi download receipt

#### d. `/quick-order/pending` - Menunggu Pembayaran
- Status pembayaran pending
- Timer countdown expired
- Tombol refresh/cek ulang

### 4. Secrets yang Diperlukan
Perlu ditambahkan ke Supabase Secrets:
- `XENDIT_SECRET_KEY` - API key Xendit
- `XENDIT_WEBHOOK_TOKEN` - Token untuk verifikasi webhook
- `RAPATIN_API_URL` - Base URL API aplikasi Rapatin
- `RAPATIN_API_KEY` - API key untuk autentikasi ke Rapatin

### 5. Struktur File

```text
src/
├── pages/
│   └── QuickOrder.tsx           # Halaman utama form order
│   └── QuickOrderSuccess.tsx    # Halaman konfirmasi sukses
│   └── QuickOrderPending.tsx    # Halaman menunggu pembayaran
├── components/
│   └── quick-order/
│       ├── QuickOrderForm.tsx   # Form input data
│       ├── PackageSelector.tsx  # Pilihan paket peserta
│       ├── PricingSummary.tsx   # Ringkasan harga
│       └── PaymentMethods.tsx   # Tampilan metode pembayaran

supabase/
├── functions/
│   ├── create-guest-order/
│   │   └── index.ts
│   ├── xendit-webhook/
│   │   └── index.ts
│   └── check-order-status/
│       └── index.ts
```

## Keamanan

1. **RLS Policies untuk guest_orders:**
   - Public dapat INSERT (membuat order baru)
   - Admin dapat SELECT/UPDATE semua order
   - Guest dapat SELECT order berdasarkan ID + email match

2. **Webhook Security:**
   - Verifikasi signature Xendit
   - Rate limiting
   - Idempotency check (mencegah double processing)

3. **Input Validation:**
   - Server-side validation menggunakan Zod
   - Sanitasi input WhatsApp dan email
   - Validasi tanggal (tidak boleh tanggal lampau)

## Estimasi Harga (Mengikuti Pricing Existing)

| Peserta | Harga Promo | Harga Normal |
|---------|-------------|--------------|
| 100 | Rp 10.000 | Rp 20.000 |
| 300 | Rp 25.000 | Rp 40.000 |
| 500 | Rp 55.000 | Rp 70.000 |
| 1000 | Rp 100.000 | Rp 130.000 |

## Detail Teknis

### Xendit Integration
- Menggunakan Xendit Invoice API untuk buat invoice
- Payment methods: QRIS, VA (BCA/BNI/BRI/Mandiri), E-Wallet (GoPay/OVO/DANA)
- Invoice expiry: 24 jam
- Webhook untuk notifikasi pembayaran

### API Rapatin Integration
- Endpoint yang dipanggil setelah payment sukses
- Mengirim: nama, email, whatsapp, tanggal, jumlah peserta
- Menerima: zoom_link, meeting_id, passcode, rapatin_order_id

### Urutan Implementasi
1. Setup Xendit API secrets
2. Buat tabel database `guest_orders`
3. Buat edge function `create-guest-order`
4. Buat edge function `xendit-webhook`
5. Buat halaman `/quick-order` dengan form
6. Buat halaman sukses dan pending
7. Testing end-to-end
8. Integrasi dengan API Rapatin (setelah API endpoint dikonfirmasi)

