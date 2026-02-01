

# Rencana: Update Template Email Konfirmasi

## Ringkasan Perubahan

1. **Pindahkan tombol "Gabung Meeting"** dari atas kredensial ke bawah (sejajar dengan tombol Panduan)
2. **Tambahkan card Invitation** yang menampilkan teks undangan meeting seperti di halaman detail

---

## Perubahan Detail

**File:** `supabase/functions/send-order-email/index.ts`

### 1. Generate Invitation Text

Tambahkan fungsi baru untuk menghasilkan teks invitation:

```typescript
function generateInvitationText(order: Record<string, unknown>): string {
  const topic = (order.meeting_topic as string) || "Zoom Meeting";
  const customerName = order.name as string;
  const zoomLink = order.zoom_link as string;
  const meetingId = formatMeetingId(order.meeting_id as string);
  const passcode = (order.zoom_passcode as string) || "-";
  const meetingDate = order.meeting_date as string;
  const meetingTime = (order.meeting_time as string) || "09:00";
  
  // Format date untuk invitation
  const date = new Date(meetingDate);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  
  return `${customerName} is inviting you to a scheduled Zoom meeting.

Topic: ${topic}
Time: ${formattedDate} ${meetingTime} Jakarta

Join Zoom Meeting
${zoomLink}

Meeting ID: ${meetingId}
Passcode: ${passcode}`;
}
```

### 2. Struktur Email Baru di Bagian Kredensial

```text
SEBELUM:
┌─────────────────────────────────────┐
│ 🔐 Kredensial Zoom                  │
├─────────────────────────────────────┤
│    [ Gabung Meeting ] ← tombol      │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Meeting ID: 123 4567 8901       │ │
│ │ Passcode: abc123                │ │
│ │ Host Key: 070707                │ │
│ └─────────────────────────────────┘ │
│                                     │
│  [📖 Panduan Cara Menjadi Host]     │
└─────────────────────────────────────┘

SESUDAH:
┌─────────────────────────────────────┐
│ 🔐 Kredensial Zoom                  │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Meeting ID: 123 4567 8901       │ │
│ │ Passcode: abc123                │ │
│ │ Host Key: 070707                │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📝 Invitation                   │ │
│ │ ─────────────────────────────── │ │
│ │ [Nama] is inviting you to a     │ │
│ │ scheduled Zoom meeting.         │ │
│ │                                 │ │
│ │ Topic: [Topik Meeting]          │ │
│ │ Time: Jan 15, 2026 09:00 Jakarta│ │
│ │                                 │ │
│ │ Join Zoom Meeting               │ │
│ │ https://zoom.us/j/123...        │ │
│ │                                 │ │
│ │ Meeting ID: 123 4567 8901       │ │
│ │ Passcode: abc123                │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [ Gabung Meeting ] [📖 Panduan]     │ ← kedua tombol sejajar
└─────────────────────────────────────┘
```

### 3. Perubahan HTML Email

**Hapus** tombol "Gabung Meeting" dari posisi atas (lines 173-182)

**Tambahkan** card Invitation setelah tabel kredensial:

```html
<!-- Invitation Card -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px; background-color: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
  <tr>
    <td style="padding: 16px;">
      <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px; font-weight: 600;">📝 Invitation</p>
      <pre style="margin: 0; white-space: pre-wrap; word-wrap: break-word; font-family: 'Courier New', monospace; font-size: 12px; color: #374151; background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e5e7eb; line-height: 1.6;">${invitationText}</pre>
    </td>
  </tr>
</table>
```

**Ubah** section tombol menjadi 2 tombol sejajar:

```html
<!-- Action Buttons - Side by side -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
  <tr>
    <td align="center">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <!-- Gabung Meeting Button -->
          <td style="padding-right: 8px;">
            <a href="${zoomLink}" target="_blank" style="display: inline-block; background-color: #179ecf; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 10px; font-size: 14px; font-weight: 600;">
              Gabung Meeting
            </a>
          </td>
          <!-- Panduan Button -->
          <td style="padding-left: 8px;">
            <a href="https://www.youtube.com/watch?v=8QX78u43_JE" target="_blank" style="display: inline-block; background: #f3f4f6; color: #374151; text-decoration: none; padding: 14px 24px; border-radius: 10px; font-size: 14px; font-weight: 500; border: 1px solid #d1d5db;">
              📖 Panduan Host
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
```

### 4. Update Plain Text Email

Tambahkan section Invitation di versi plain text:

```text
---
INVITATION (Salin untuk dibagikan)
---
[Nama] is inviting you to a scheduled Zoom meeting.

Topic: [Topik]
Time: [Tanggal] [Waktu] Jakarta

Join Zoom Meeting
[Link]

Meeting ID: [ID]
Passcode: [Passcode]
```

---

## Ringkasan File yang Diubah

| File | Aksi | Deskripsi |
|------|------|-----------|
| `supabase/functions/send-order-email/index.ts` | Ubah | Pindahkan tombol Gabung, tambahkan card Invitation, sejajarkan tombol aksi |

---

## Preview Visual Email

```text
┌─────────────────────────────────────────────────┐
│           RAPATIN                               │
│       Pembayaran Berhasil!                      │
├─────────────────────────────────────────────────┤
│ Halo [Nama],                                    │
│ Terima kasih telah melakukan pemesanan...       │
├─────────────────────────────────────────────────┤
│ ┌─ Order ──────────────────────────────────┐    │
│ │ RPT-240115-0001                   ✓ Lunas│    │
│ └──────────────────────────────────────────┘    │
├─────────────────────────────────────────────────┤
│ 📋 Detail Meeting                               │
│ Topik: Team Weekly Sync                         │
│ Tanggal: Rabu, 15 Januari 2026                 │
│ Waktu: 09:00 WIB                               │
│ Kapasitas: 100 Peserta                         │
│ Total Bayar: Rp89.000                          │
├─────────────────────────────────────────────────┤
│ 🔐 Kredensial Zoom                              │
│ ┌──────────────────────────────────────────┐    │
│ │ Meeting ID    123 4567 8901              │    │
│ │ Passcode      abc123                     │    │
│ │ Host Key      070707                     │    │
│ └──────────────────────────────────────────┘    │
│                                                 │
│ ┌──────────────────────────────────────────┐    │
│ │ 📝 Invitation                            │    │
│ │ ──────────────────────────────────────── │    │
│ │ John Doe is inviting you to a scheduled  │    │
│ │ Zoom meeting.                            │    │
│ │                                          │    │
│ │ Topic: Team Weekly Sync                  │    │
│ │ Time: Jan 15, 2026 09:00 Jakarta         │    │
│ │                                          │    │
│ │ Join Zoom Meeting                        │    │
│ │ https://us06web.zoom.us/j/12345678901    │    │
│ │                                          │    │
│ │ Meeting ID: 123 4567 8901                │    │
│ │ Passcode: abc123                         │    │
│ └──────────────────────────────────────────┘    │
│                                                 │
│   [Gabung Meeting]    [📖 Panduan Host]         │
├─────────────────────────────────────────────────┤
│ 💡 Tips Penting                                 │
│ • Buka link meeting 5 menit sebelum jadwal     │
│ • Gunakan Host Key untuk menjadi host          │
│ • Pastikan koneksi internet stabil             │
├─────────────────────────────────────────────────┤
│        [💬 Hubungi via WhatsApp]                │
│        © 2026 Rapatin                           │
└─────────────────────────────────────────────────┘
```

