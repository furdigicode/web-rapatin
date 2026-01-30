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
  }).format(date) + " WIB";
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
