

# Rencana: Tambahkan Logo, Metode Pembayaran, dan Waktu Bayar di PDF Invoice

## Ringkasan

Menambahkan 3 perubahan pada PDF tanda terima:
1. **Ganti teks "Rapatin" dengan logo gambar** seperti yang digunakan di navbar
2. **Tampilkan metode pembayaran** di bagian summary
3. **Tampilkan waktu pembayaran lengkap** (tanggal + jam)

---

## Perubahan yang Akan Dilakukan

### 1. Ganti Teks "Rapatin" dengan Logo

| Sebelum | Sesudah |
|---------|---------|
| Teks "Rapatin" (font biru) | Logo gambar Rapatin (PNG) |

Logo yang akan digunakan: `/lovable-uploads/2daea350-0851-4dd8-8f79-ee07aaaad905.png`

### 2. Tambah Metode Pembayaran

Lokasi: Di bagian Summary (di bawah Status LUNAS)

```text
Subtotal       Rp 150.000
─────────────────────────
Total          Rp 150.000
Status         LUNAS
Metode Bayar   QRIS        ← BARU
```

### 3. Tampilkan Waktu Bayar Lengkap

Saat ini hanya menampilkan tanggal (30/01/2026), akan ditambahkan jam (30/01/2026 15:30 WIB)

---

## Layout PDF Setelah Update

```text
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  [LOGO RAPATIN]                              Invoice                │
│                                         Nomor: INV-260130-0001      │
│                                         Tanggal: 30/01/2026 15:30   │
│                                         Tgl. Jatuh Tempo: 30/01/2026│
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  Informasi Perusahaan              Tagihan Kepada                   │
│  ...                                ...                             │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  [TABEL PRODUK]                                                     │
│                                                                     │
│                                              Subtotal    Rp 150.000 │
│                                              ─────────   ────────── │
│                                              Total       Rp 150.000 │
│                                              Status      LUNAS      │
│                                              Metode      QRIS    ← BARU│
│                                              Dibayar     30/01/2026 15:30 WIB ← BARU│
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  Terbilang                                                          │
│  Seratus Lima Puluh Ribu Rupiah                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Detail Implementasi Teknis

### 1. Embed Logo ke PDF

jsPDF mendukung embed gambar dengan `doc.addImage()`. Perlu convert logo PNG ke base64 atau load dari URL.

Pendekatan: Buat fungsi async untuk load logo dan convert ke base64, lalu embed ke PDF.

```typescript
// Load image and convert to base64
const loadImageAsBase64 = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = url;
  });
};

// Di generateReceipt:
const logoBase64 = await loadImageAsBase64("/lovable-uploads/2daea350-0851-4dd8-8f79-ee07aaaad905.png");
doc.addImage(logoBase64, "PNG", margin, y, 40, 12); // width 40, height 12
```

### 2. Format Waktu Lengkap

```typescript
const formatDateTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};
```

### 3. Tambah Metode Bayar di Summary

```typescript
// Setelah Status LUNAS
y += 8;
doc.setTextColor(80, 80, 80);
doc.text("Metode Bayar", summaryX, y);
doc.setFont("helvetica", "normal");
doc.setTextColor(0, 0, 0);
doc.text(data.paymentMethod || "-", valueX, y, { align: "right" });

y += 8;
doc.text("Dibayar", summaryX, y);
doc.text(formatDateTime(data.paidAt) + " WIB", valueX, y, { align: "right" });
```

---

## Perubahan File

| File | Aksi | Deskripsi |
|------|------|-----------|
| `src/utils/generateReceipt.ts` | Ubah | Update fungsi jadi async, tambah logo, metode bayar, waktu bayar |
| `src/pages/QuickOrderDetail.tsx` | Ubah | Update pemanggilan ke `await generateReceipt()` |

---

## Catatan

- Fungsi `generateReceipt` perlu diubah menjadi **async** karena loading gambar bersifat asynchronous
- Logo akan di-embed langsung ke PDF sehingga tidak perlu koneksi internet saat membuka PDF
- Ukuran logo disesuaikan agar proporsional dengan layout

