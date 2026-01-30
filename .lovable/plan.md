

# Rencana: Tombol Download Tanda Terima dengan Generate PDF

## Ringkasan

Menambahkan tombol **"Download Tanda Terima"** di halaman Quick Order Detail dengan fitur generate PDF menggunakan library **jsPDF**. PDF akan berisi informasi lengkap order sebagai bukti pembayaran resmi.

---

## Konten PDF Tanda Terima

| Section | Konten |
|---------|--------|
| Header | Logo Rapatin + "TANDA TERIMA" |
| Nomor Order | INV-260130-0001 |
| Tanggal Bayar | Kamis, 30 Januari 2026 pukul 15:30 |
| Nama Pemesan | John Doe |
| Email | john@example.com |
| WhatsApp | 087788980084 |
| Detail Meeting | Tanggal, Kapasitas Peserta |
| Detail Pembayaran | Total Bayar, Metode Pembayaran |
| Footer | Terima kasih telah menggunakan Rapatin |

---

## Desain UI Tombol

```text
┌─────────────────────────────────────────────┐
│  Detail Order                               │
├─────────────────────────────────────────────┤
│  ...                                        │
│  ─────────────────────────────────────────  │
│  💳 Total Bayar                             │
│      Rp150.000                              │
│      via QRIS                               │
│                                             │
│  [📥 Download Tanda Terima] ← TOMBOL BARU   │
└─────────────────────────────────────────────┘
```

---

## Layout PDF

```text
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  [LOGO]  RAPATIN                                        │
│          Sewa Ruang Zoom Meeting                        │
│                                                         │
│  ═══════════════════════════════════════════════════    │
│                                                         │
│              TANDA TERIMA PEMBAYARAN                    │
│                                                         │
│  ───────────────────────────────────────────────────    │
│                                                         │
│  Nomor Order     : INV-260130-0001                      │
│  Tanggal Bayar   : Kamis, 30 Januari 2026, 15:30 WIB    │
│                                                         │
│  ───────────────────────────────────────────────────    │
│                                                         │
│  DATA PEMESAN                                           │
│  Nama            : John Doe                             │
│  Email           : john@example.com                     │
│  WhatsApp        : 087788980084                         │
│                                                         │
│  ───────────────────────────────────────────────────    │
│                                                         │
│  DETAIL MEETING                                         │
│  Tanggal Meeting : Kamis, 30 Januari 2026               │
│  Kapasitas       : 100 Peserta                          │
│  Topik           : Weekly Team Sync                     │
│                                                         │
│  ───────────────────────────────────────────────────    │
│                                                         │
│  PEMBAYARAN                                             │
│  Total Bayar     : Rp150.000                            │
│  Metode          : QRIS                                 │
│  Status          : LUNAS                                │
│                                                         │
│  ═══════════════════════════════════════════════════    │
│                                                         │
│  Terima kasih telah menggunakan Rapatin.                │
│  www.rapatin.id                                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Implementasi Teknis

### 1. Install Dependency

```bash
npm install jspdf
```

### 2. File yang Diubah/Dibuat

| File | Aksi | Deskripsi |
|------|------|-----------|
| `package.json` | Ubah | Tambahkan dependency jspdf |
| `src/utils/generateReceipt.ts` | Buat | Fungsi generate PDF receipt |
| `src/pages/QuickOrderDetail.tsx` | Ubah | Tambahkan tombol + import fungsi |

---

## Kode Implementasi

### `src/utils/generateReceipt.ts`

```typescript
import { jsPDF } from "jspdf";

interface ReceiptData {
  orderNumber: string | null;
  name: string;
  email: string;
  whatsapp: string;
  meetingDate: string;
  meetingTime: string | null;
  meetingTopic: string | null;
  participantCount: number;
  price: number;
  paymentMethod: string | null;
  paidAt: string | null;
}

const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const formatDateTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const generateReceipt = (data: ReceiptData): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  let y = 20;
  
  // Header - Company Name
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(37, 99, 235); // Blue color
  doc.text("RAPATIN", pageWidth / 2, y, { align: "center" });
  
  y += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Sewa Ruang Zoom Meeting", pageWidth / 2, y, { align: "center" });
  
  // Line separator
  y += 10;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(20, y, pageWidth - 20, y);
  
  // Title
  y += 15;
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("TANDA TERIMA PEMBAYARAN", pageWidth / 2, y, { align: "center" });
  
  // Order info
  y += 15;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  
  const labelX = 25;
  const valueX = 80;
  
  doc.setFont("helvetica", "bold");
  doc.text("Nomor Order", labelX, y);
  doc.setFont("helvetica", "normal");
  doc.text(`: ${data.orderNumber || "-"}`, valueX, y);
  
  y += 7;
  doc.setFont("helvetica", "bold");
  doc.text("Tanggal Bayar", labelX, y);
  doc.setFont("helvetica", "normal");
  doc.text(`: ${data.paidAt ? formatDateTime(data.paidAt) : "-"}`, valueX, y);
  
  // Section: Data Pemesan
  y += 15;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, y, pageWidth - 20, y);
  
  y += 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(37, 99, 235);
  doc.text("DATA PEMESAN", labelX, y);
  
  y += 10;
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("Nama", labelX, y);
  doc.setFont("helvetica", "normal");
  doc.text(`: ${data.name}`, valueX, y);
  
  y += 7;
  doc.setFont("helvetica", "bold");
  doc.text("Email", labelX, y);
  doc.setFont("helvetica", "normal");
  doc.text(`: ${data.email}`, valueX, y);
  
  y += 7;
  doc.setFont("helvetica", "bold");
  doc.text("WhatsApp", labelX, y);
  doc.setFont("helvetica", "normal");
  doc.text(`: ${data.whatsapp}`, valueX, y);
  
  // Section: Detail Meeting
  y += 15;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, y, pageWidth - 20, y);
  
  y += 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(37, 99, 235);
  doc.text("DETAIL MEETING", labelX, y);
  
  y += 10;
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("Tanggal Meeting", labelX, y);
  doc.setFont("helvetica", "normal");
  const meetingDateText = formatDate(data.meetingDate) + 
    (data.meetingTime ? ` • ${data.meetingTime} WIB` : "");
  doc.text(`: ${meetingDateText}`, valueX, y);
  
  y += 7;
  doc.setFont("helvetica", "bold");
  doc.text("Kapasitas", labelX, y);
  doc.setFont("helvetica", "normal");
  doc.text(`: ${data.participantCount} Peserta`, valueX, y);
  
  if (data.meetingTopic) {
    y += 7;
    doc.setFont("helvetica", "bold");
    doc.text("Topik", labelX, y);
    doc.setFont("helvetica", "normal");
    doc.text(`: ${data.meetingTopic}`, valueX, y);
  }
  
  // Section: Pembayaran
  y += 15;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, y, pageWidth - 20, y);
  
  y += 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(37, 99, 235);
  doc.text("PEMBAYARAN", labelX, y);
  
  y += 10;
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("Total Bayar", labelX, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(37, 99, 235);
  doc.text(`: ${formatRupiah(data.price)}`, valueX, y);
  
  y += 7;
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("Metode", labelX, y);
  doc.setFont("helvetica", "normal");
  doc.text(`: ${data.paymentMethod || "-"}`, valueX, y);
  
  y += 7;
  doc.setFont("helvetica", "bold");
  doc.text("Status", labelX, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(34, 197, 94); // Green
  doc.text(": LUNAS", valueX, y);
  
  // Footer
  y += 20;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(20, y, pageWidth - 20, y);
  
  y += 15;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Terima kasih telah menggunakan Rapatin.", pageWidth / 2, y, { 
    align: "center" 
  });
  
  y += 6;
  doc.text("www.rapatin.id", pageWidth / 2, y, { align: "center" });
  
  // Generate filename
  const filename = `Tanda-Terima-${data.orderNumber || "Order"}.pdf`;
  doc.save(filename);
};
```

### `QuickOrderDetail.tsx` - Perubahan

```tsx
// Import baru
import { Download } from "lucide-react";
import { generateReceipt } from "@/utils/generateReceipt";

// Handler function
const handleDownloadReceipt = () => {
  if (!order) return;
  
  generateReceipt({
    orderNumber: order.order_number,
    name: order.name,
    email: order.email,
    whatsapp: order.whatsapp,
    meetingDate: order.meeting_date,
    meetingTime: order.meeting_time,
    meetingTopic: order.meeting_topic,
    participantCount: order.participant_count,
    price: order.price,
    paymentMethod: order.payment_method 
      ? formatPaymentMethod(order.payment_method) 
      : null,
    paidAt: order.paid_at,
  });
  
  toast.success("Tanda terima berhasil diunduh");
};

// Tombol di bawah metode pembayaran (setelah baris 646)
{isPaid && (
  <Button 
    variant="outline" 
    className="w-full mt-4"
    onClick={handleDownloadReceipt}
  >
    <Download className="w-4 h-4 mr-2" />
    Download Tanda Terima
  </Button>
)}
```

---

## Nama File PDF

Format: `Tanda-Terima-{order_number}.pdf`

Contoh: `Tanda-Terima-INV-260130-0001.pdf`

---

## Kondisi Tampil

Tombol hanya muncul untuk order yang sudah **dibayar** (`isPaid`), karena tanda terima hanya relevan setelah pembayaran berhasil.

