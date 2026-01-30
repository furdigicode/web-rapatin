

# Rencana: Menambahkan Kartu FAQ di Halaman Detail Order

## Ringkasan

Menambahkan kartu FAQ (Frequently Asked Questions) di halaman **Quick Order Detail** (`QuickOrderDetail.tsx`), ditempatkan **di atas** kartu Riwayat (Timeline), hanya ditampilkan untuk order yang sudah dibayar.

---

## Konten FAQ

| No | Pertanyaan | Jawaban |
|----|-----------|---------|
| 1 | Kapan saya bisa menggunakan ruang Zoom yang sudah dijadwalkan? | Pada tanggal yang Anda pilih, sejak pukul 00:01 hingga 23:59 pada tanggal tersebut. |
| 2 | Apakah saya bisa menggunakan ruang Zoom berkali-kali dalam satu tanggal? | Bisa. Anda bisa menggunakan ruang Zoom berkali-kali (pagi, siang, sore, malam) dengan link, Meeting ID, dan Passcode yang sama. Pastikan setiap kali menggunakan, Anda telah mengklaim diri sebagai Host. |
| 3 | Apakah tersedia fitur recording dan bagaimana mendapatkan hasil cloud recording? | Untuk mendapatkan hasil cloud recording, hubungi admin 1-3 jam setelah meeting selesai dan recording di-stop, untuk proses penyimpanan ke cloud. |
| 4 | Apakah bisa mengganti judul, tanggal, atau passcode? | Tidak bisa. Apa yang sudah Anda beli, itulah yang Anda dapatkan. Jika ingin menikmati fasilitas edit tanpa batas, silakan mendaftar menjadi member. [Link: app.rapatin.id/dashboard/register] |
| 5 | Jika ada kendala, saya menghubungi kepada siapa? | Hubungi admin via WhatsApp. [Link ke WhatsApp admin] |

---

## Desain UI

```text
┌─────────────────────────────────────────────┐
│  📋  Pertanyaan Umum (FAQ)                  │
├─────────────────────────────────────────────┤
│  ▼ Kapan saya bisa menggunakan ruang Zoom?  │
│    ─────────────────────────────────────    │
│  ▼ Apakah saya bisa menggunakan berkali...  │
│    ─────────────────────────────────────    │
│  ▼ Bagaimana mendapatkan hasil recording?   │
│    ─────────────────────────────────────    │
│  ▼ Apakah bisa mengganti judul/tanggal?     │
│    ─────────────────────────────────────    │
│  ▼ Jika ada kendala, hubungi siapa?         │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  📜 Riwayat                                 │
│  ...                                        │
└─────────────────────────────────────────────┘
```

---

## Implementasi Teknis

### Komponen yang Digunakan

- **Card**: Container untuk FAQ
- **Accordion**: Untuk collapsible FAQ items
- **Button**: Untuk link WhatsApp dan daftar member

### Posisi dalam Kode

```text
{/* Detail Zoom Meeting */}
{isPaid && ( <Card>...</Card> )}

{/* FAQ Card - BARU! */}
{isPaid && ( <Card>...FAQ Accordion...</Card> )}

{/* Timeline Info */}
{isPaid && order.paid_at && ( <Card>...Riwayat...</Card> )}
```

---

## Perubahan File

| File | Aksi | Deskripsi |
|------|------|-----------|
| `src/pages/QuickOrderDetail.tsx` | Ubah | Tambahkan import Accordion + kartu FAQ |

---

## Detail Kode

### Import Baru

```tsx
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react"; // Ikon untuk header FAQ
```

### FAQ Card Component

```tsx
{/* FAQ Section (only for paid orders) */}
{isPaid && (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-primary" />
        <h2 className="font-semibold text-lg">Pertanyaan Umum (FAQ)</h2>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-left">
            Kapan saya bisa menggunakan ruang Zoom yang sudah dijadwalkan?
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-muted-foreground">
              Pada tanggal yang Anda pilih, sejak pukul 00:01 hingga 23:59 
              pada tanggal tersebut.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="text-left">
            Apakah saya bisa menggunakan ruang Zoom berkali-kali dalam satu tanggal?
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-muted-foreground">
              Bisa. Anda bisa menggunakan ruang Zoom berkali-kali 
              (pagi, siang, sore, malam) dengan link, Meeting ID, dan Passcode 
              yang sama. Pastikan setiap kali menggunakan, Anda telah 
              mengklaim diri sebagai Host.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="text-left">
            Bagaimana mendapatkan hasil cloud recording?
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-muted-foreground">
              Untuk mendapatkan hasil cloud recording, hubungi admin 
              1-3 jam setelah meeting selesai dan recording di-stop, 
              untuk proses penyimpanan ke cloud.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger className="text-left">
            Apakah bisa mengganti judul, tanggal, atau passcode?
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-muted-foreground mb-3">
              Tidak bisa. Apa yang sudah Anda beli, itulah yang Anda dapatkan. 
              Jika ingin menikmati fasilitas edit tanpa batas, silakan 
              mendaftar menjadi member.
            </p>
            <Button asChild size="sm" variant="outline">
              <a 
                href="https://app.rapatin.id/dashboard/register" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Daftar Menjadi Member
                <ExternalLink className="w-3 h-3 ml-2" />
              </a>
            </Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5" className="border-b-0">
          <AccordionTrigger className="text-left">
            Jika ada kendala, saya menghubungi kepada siapa?
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-muted-foreground mb-3">
              Silakan hubungi admin kami via WhatsApp.
            </p>
            <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
              <a 
                href="https://wa.me/6287788980084" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Hubungi Admin
              </a>
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </CardContent>
  </Card>
)}
```

---

## Kondisi Tampil

FAQ hanya ditampilkan untuk order yang sudah **dibayar** (`isPaid`), sama seperti kartu Riwayat. Ini karena FAQ ini relevan untuk penggunaan Zoom setelah pembayaran berhasil.

