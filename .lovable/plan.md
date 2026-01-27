

# Rencana: Simulasi Gagal Membuat Zoom Meeting

## Tujuan

Menghapus data Zoom dari order ID `95cb2a0a-71de-4b45-b16a-f5289cc0c09d` untuk mensimulasikan kondisi dimana pembuatan Zoom meeting gagal, sehingga bisa menguji fallback UI yang baru dibuat.

## Data Order Saat Ini

| Field | Value |
|-------|-------|
| Order ID | 95cb2a0a-71de-4b45-b16a-f5289cc0c09d |
| Nama | Anif |
| Email | anifbagas.ads@gmail.com |
| Status | paid |
| Paid At | 27 Jan 2026, 13:13:34 |
| Zoom Link | https://us06web.zoom.us/j/83845357130?pwd=... |
| Meeting ID | 83845357130 |
| Passcode | 745887 |

## Query SQL yang Akan Dijalankan

```sql
UPDATE guest_orders 
SET 
  zoom_link = NULL,
  zoom_passcode = NULL,
  meeting_id = NULL
WHERE id = '95cb2a0a-71de-4b45-b16a-f5289cc0c09d';
```

## Hasil yang Diharapkan

Setelah update:
1. Order tetap berstatus `paid` dengan `paid_at` yang ada
2. Data Zoom (`zoom_link`, `zoom_passcode`, `meeting_id`) menjadi NULL
3. Ketika membuka halaman `/quick-order/{access_slug}`:
   - Karena `paid_at` sudah lebih dari 5 menit yang lalu, sistem akan mendeteksi sebagai "gagal"
   - Akan menampilkan fallback UI dengan tombol "Hubungi Admin via WhatsApp"
   - Timeline akan menunjukkan status "Gagal membuat meeting" dengan dot berwarna orange

## Cara Test

Setelah data di-update, buka halaman detail order untuk melihat fallback UI.

