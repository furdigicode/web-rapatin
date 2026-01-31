

# Rencana: Redesain PDF Tanda Terima (Invoice Style)

## Ringkasan

Mengubah desain PDF tanda terima agar mengikuti layout invoice profesional seperti pada gambar referensi, dengan struktur dua kolom, tabel produk, dan format invoice yang lebih formal.

---

## Perbandingan Layout

| Aspek | Desain Lama | Desain Baru (Invoice Style) |
|-------|-------------|----------------------------|
| Header | Logo tengah | Logo kiri + "Invoice" kanan |
| Info Order | Vertikal | Nomor/Tanggal di kanan atas |
| Data Pemesan | Satu kolom | Dua kolom (Perusahaan & Pelanggan) |
| Detail Produk | List sederhana | Tabel dengan header berwarna |
| Summary | Inline | Ringkasan kanan bawah |
| Footer | Sederhana | "Dengan Hormat" + tanda tangan |

---

## Layout PDF Baru

```text
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  [LOGO] Rapatin                              Invoice                │
│                                         Nomor: INV-260130-0001      │
│                                         Tanggal: 30/01/2026         │
│                                         Tgl. Jatuh Tempo: 30/01/2026│
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  Informasi Perusahaan              Tagihan Kepada                   │
│  ────────────────────              ──────────────                   │
│  Rapatin                           John Doe                         │
│  Griya Nuansa Bening no 14,        Telp: 087788980084               │
│  Kel. Jatisari, Kec. Mijen,        Email: john@example.com          │
│  Kota Semarang                                                      │
│  Telp: 087788980084                                                 │
│  Email: rapatinapp@gmail.com                                        │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  ┌──────────────┬─────────────────────────┬──────────┬─────────────┐│
│  │ Produk       │ Deskripsi               │ Kuantitas│ Jumlah      ││
│  ├──────────────┼─────────────────────────┼──────────┼─────────────┤│
│  │ Meeting 100  │ [Topik] - 30 Jan 2026   │    1     │ Rp 150.000  ││
│  │ Participants │ 20:00 WIB               │          │             ││
│  └──────────────┴─────────────────────────┴──────────┴─────────────┘│
│                                                                     │
│                                              Subtotal    Rp 150.000 │
│                                              ─────────   ────────── │
│                                              Total       Rp 150.000 │
│                                              Status      LUNAS      │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  Terbilang                                                          │
│  Seratus Lima Puluh Ribu Rupiah                                     │
│                                                                     │
│                                              Dengan Hormat,         │
│                                                                     │
│                                              ─────────────          │
│                                              Rapatin                │
│                                              Admin                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Fitur Baru

### 1. Format Tanggal Invoice Style
```typescript
// Format: DD/MM/YYYY
const formatShortDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
```

### 2. Terbilang (Number to Words)
```typescript
// Konversi angka ke kata-kata Indonesia
const terbilang = (angka: number): string => {
  // Contoh: 150000 → "Seratus Lima Puluh Ribu Rupiah"
};
```

### 3. Tabel Produk dengan Header Berwarna
- Background biru muda untuk header tabel
- Kolom: Produk, Deskripsi, Kuantitas, Jumlah

### 4. Dua Kolom Info
- Kiri: Informasi Perusahaan (Rapatin)
- Kanan: Tagihan Kepada (Customer)

---

## Detail Implementasi

### Warna yang Digunakan
| Elemen | RGB | Hex |
|--------|-----|-----|
| Logo/Heading | (37, 99, 235) | #2563EB |
| Subheading | (30, 58, 138) | #1E3A8A |
| Table Header BG | (219, 234, 254) | #DBEAFE |
| Text Muted | (100, 100, 100) | #646464 |
| Status LUNAS | (34, 197, 94) | #22C55E |

### Informasi Perusahaan (Statis)
```
Rapatin
Griya Nuansa Bening no 14, Kel. Jatisari, 
Kec. Mijen, Kota Semarang
Telp: 087788980084
Email: rapatinapp@gmail.com
```

---

## Perubahan File

| File | Aksi | Deskripsi |
|------|------|-----------|
| `src/utils/generateReceipt.ts` | Ubah | Redesain total layout PDF |

---

## Kode Baru (Struktur Utama)

```typescript
export const generateReceipt = (data: ReceiptData): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  
  let y = 20;
  
  // ========== HEADER SECTION ==========
  // Logo "Rapatin" di kiri
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(37, 99, 235);
  doc.text("Rapatin", margin, y + 5);
  
  // "Invoice" di kanan
  doc.setFontSize(28);
  doc.text("Invoice", pageWidth - margin, y, { align: "right" });
  
  // Info Nomor, Tanggal di kanan
  y += 15;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  // Nomor, Tanggal, Tgl. Jatuh Tempo
  
  // ========== TWO COLUMN INFO ==========
  // Left: Informasi Perusahaan
  // Right: Tagihan Kepada (Customer)
  
  // ========== PRODUCT TABLE ==========
  // Header dengan background biru muda
  // Row dengan data produk
  
  // ========== SUMMARY ==========
  // Subtotal, Total, Status
  
  // ========== TERBILANG ==========
  // Angka dalam kata-kata
  
  // ========== FOOTER ==========
  // "Dengan Hormat," + Rapatin / Admin
  
  doc.save(filename);
};
```

---

## Fungsi Helper Baru

### 1. Terbilang (Angka ke Kata)
```typescript
const terbilang = (angka: number): string => {
  const satuan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
  
  if (angka < 12) return satuan[angka];
  if (angka < 20) return satuan[angka - 10] + ' Belas';
  if (angka < 100) return satuan[Math.floor(angka / 10)] + ' Puluh' + (angka % 10 ? ' ' + satuan[angka % 10] : '');
  if (angka < 200) return 'Seratus' + (angka - 100 ? ' ' + terbilang(angka - 100) : '');
  if (angka < 1000) return satuan[Math.floor(angka / 100)] + ' Ratus' + (angka % 100 ? ' ' + terbilang(angka % 100) : '');
  if (angka < 2000) return 'Seribu' + (angka - 1000 ? ' ' + terbilang(angka - 1000) : '');
  if (angka < 1000000) return terbilang(Math.floor(angka / 1000)) + ' Ribu' + (angka % 1000 ? ' ' + terbilang(angka % 1000) : '');
  if (angka < 1000000000) return terbilang(Math.floor(angka / 1000000)) + ' Juta' + (angka % 1000000 ? ' ' + terbilang(angka % 1000000) : '');
  
  return angka.toString();
};
```

### 2. Draw Table Function
```typescript
const drawTableRow = (
  doc: jsPDF, 
  y: number, 
  cols: string[], 
  widths: number[], 
  isHeader: boolean
) => {
  // Draw cells with optional background
};
```

---

## Catatan

- Desain mengikuti format invoice standar seperti pada gambar referensi
- Kolom Diskon dan Pajak dari gambar tidak ditampilkan karena tidak ada data tersebut di sistem Quick Order
- Tgl. Jatuh Tempo sama dengan Tanggal karena ini adalah tanda terima (sudah lunas)
- "Sisa Tagihan" selalu Rp 0 karena status LUNAS

