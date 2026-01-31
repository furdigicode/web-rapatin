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

const formatShortDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatMeetingDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const terbilang = (angka: number): string => {
  const satuan = [
    "",
    "Satu",
    "Dua",
    "Tiga",
    "Empat",
    "Lima",
    "Enam",
    "Tujuh",
    "Delapan",
    "Sembilan",
    "Sepuluh",
    "Sebelas",
  ];

  if (angka < 12) return satuan[angka];
  if (angka < 20) return satuan[angka - 10] + " Belas";
  if (angka < 100) return satuan[Math.floor(angka / 10)] + " Puluh" + (angka % 10 ? " " + satuan[angka % 10] : "");
  if (angka < 200) return "Seratus" + (angka - 100 ? " " + terbilang(angka - 100) : "");
  if (angka < 1000)
    return satuan[Math.floor(angka / 100)] + " Ratus" + (angka % 100 ? " " + terbilang(angka % 100) : "");
  if (angka < 2000) return "Seribu" + (angka - 1000 ? " " + terbilang(angka - 1000) : "");
  if (angka < 1000000)
    return terbilang(Math.floor(angka / 1000)) + " Ribu" + (angka % 1000 ? " " + terbilang(angka % 1000) : "");
  if (angka < 1000000000)
    return terbilang(Math.floor(angka / 1000000)) + " Juta" + (angka % 1000000 ? " " + terbilang(angka % 1000000) : "");

  return angka.toString();
};

export const generateReceipt = (data: ReceiptData): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const rightCol = pageWidth / 2 + 10;

  let y = 20;

  // ========== HEADER SECTION ==========
  // Logo "Rapatin" di kiri
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(37, 99, 235);
  doc.text("Rapatin", margin, y + 5);

  // "Invoice" di kanan
  doc.setFontSize(28);
  doc.text("Invoice", pageWidth - margin, y + 5, { align: "right" });

  // Invoice info di kanan
  y += 15;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);

  const invoiceDate = data.paidAt ? formatShortDate(data.paidAt) : "-";

  doc.text(`Nomor: ${data.orderNumber || "-"}`, pageWidth - margin, y, {
    align: "right",
  });
  y += 5;
  doc.text(`Tanggal: ${invoiceDate}`, pageWidth - margin, y, {
    align: "right",
  });
  y += 5;
  doc.text(`Tgl. Jatuh Tempo: ${invoiceDate}`, pageWidth - margin, y, {
    align: "right",
  });

  // Separator line
  y += 10;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);

  // ========== TWO COLUMN INFO ==========
  y += 10;

  // Left Column: Informasi Perusahaan
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 58, 138);
  doc.text("Ditagih Oleh:", margin, y);

  // Right Column: Tagihan Kepada
  doc.text("Tagihan Kepada", rightCol, y);

  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  // Company info (left)
  doc.setFont("helvetica", "bold");
  doc.text("Rapatin", margin, y);
  doc.setFont("helvetica", "normal");

  // Customer name (right)
  doc.setFont("helvetica", "bold");
  doc.text(data.name, rightCol, y);
  doc.setFont("helvetica", "normal");

  y += 5;
  doc.setTextColor(80, 80, 80);
  doc.text("Griya Nuansa Bening no 14,", margin, y);
  doc.text(`Telp: ${data.whatsapp}`, rightCol, y);

  y += 5;
  doc.text("Kel. Jatisari, Kec. Mijen,", margin, y);
  doc.text(`Email: ${data.email}`, rightCol, y);

  y += 5;
  doc.text("Kota Semarang", margin, y);

  y += 5;
  doc.text("Telp: 087788980084", margin, y);

  y += 5;
  doc.text("Email: rapatinapp@gmail.com", margin, y);

  // Separator line
  y += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);

  // ========== PRODUCT TABLE ==========
  y += 5;

  const colWidths = [45, 65, 25, 35];
  const tableWidth = colWidths.reduce((a, b) => a + b, 0);
  const tableX = margin;

  // Table Header
  const headerHeight = 10;
  doc.setFillColor(219, 234, 254); // Light blue background
  doc.rect(tableX, y, tableWidth, headerHeight, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 58, 138);

  let colX = tableX + 3;
  doc.text("Produk", colX, y + 7);
  colX += colWidths[0];
  doc.text("Deskripsi", colX, y + 7);
  colX += colWidths[1];
  doc.text("Kuantitas", colX, y + 7);
  colX += colWidths[2];
  doc.text("Jumlah", colX, y + 7);

  // Draw header border
  doc.setDrawColor(200, 200, 200);
  doc.rect(tableX, y, tableWidth, headerHeight);

  // Table Row
  y += headerHeight;
  const rowHeight = 14;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  // Draw row border
  doc.rect(tableX, y, tableWidth, rowHeight);

  // Draw vertical lines for columns
  let lineX = tableX;
  for (let i = 0; i < colWidths.length - 1; i++) {
    lineX += colWidths[i];
    doc.line(lineX, y - headerHeight, lineX, y + rowHeight);
  }

  // Row content
  colX = tableX + 3;
  const productName = `Meeting ${data.participantCount}`;
  doc.text(productName, colX, y + 5);
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Participants", colX, y + 10);

  colX += colWidths[0];
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const topic = data.meetingTopic || "Meeting";
  const meetingDateStr = formatMeetingDate(data.meetingDate);
  doc.text(`${topic}`, colX, y + 5);
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`${meetingDateStr}${data.meetingTime ? " • " + data.meetingTime + " WIB" : ""}`, colX, y + 10);

  colX += colWidths[1];
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text("1", colX + 10, y + 7);

  colX += colWidths[2];
  doc.text(formatRupiah(data.price), colX, y + 7);

  // ========== SUMMARY SECTION ==========
  y += rowHeight + 10;

  const summaryX = pageWidth - margin - 80;
  const valueX = pageWidth - margin;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text("Subtotal", summaryX, y);
  doc.setTextColor(0, 0, 0);
  doc.text(formatRupiah(data.price), valueX, y, { align: "right" });

  y += 6;
  doc.setDrawColor(200, 200, 200);
  doc.line(summaryX, y, valueX, y);

  y += 6;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(80, 80, 80);
  doc.text("Total", summaryX, y);
  doc.setTextColor(37, 99, 235);
  doc.text(formatRupiah(data.price), valueX, y, { align: "right" });

  y += 8;
  doc.setTextColor(80, 80, 80);
  doc.text("Status", summaryX, y);
  doc.setTextColor(34, 197, 94); // Green
  doc.text("LUNAS", valueX, y, { align: "right" });

  // ========== TERBILANG SECTION ==========
  y += 15;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);

  y += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 58, 138);
  doc.text("Terbilang", margin, y);

  y += 6;
  doc.setFont("helvetica", "italic");
  doc.setTextColor(0, 0, 0);
  const amountInWords = terbilang(data.price) + " Rupiah";
  doc.text(amountInWords, margin, y);

  // ========== FOOTER / SIGNATURE SECTION ==========
  y += 20;

  const signatureX = pageWidth - margin - 50;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text("Dengan Hormat,", signatureX, y);

  y += 25;
  doc.setDrawColor(150, 150, 150);
  doc.line(signatureX - 10, y, signatureX + 50, y);

  y += 6;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(37, 99, 235);
  doc.text("Rapatin", signatureX + 10, y);

  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text("Admin", signatureX + 14, y);

  // Generate filename
  const filename = `Invoice-${data.orderNumber || "Order"}.pdf`;
  doc.save(filename);
};
