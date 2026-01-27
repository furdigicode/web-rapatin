
# Rencana: Tambah Invitation Text Area pada Detail Order

## Ringkasan
Menambahkan section "Invitation" dengan text area berisi format undangan meeting yang sudah terformat, lengkap dengan tombol copy. Text area akan menggunakan nama pembeli sebagai nama yang mengundang.

## Format Undangan

Berdasarkan contoh yang diberikan:

```
[Nama Pembeli] is inviting you to a scheduled Zoom meeting.

Topic: [Meeting Topic]
Time: [Tanggal, Waktu] Jakarta

Join Zoom Meeting
[Zoom Link]

Meeting ID: [Meeting ID]
Passcode: [Passcode]
```

## Perubahan File

### File: `src/pages/QuickOrderDetail.tsx`

## Detail Perubahan

### 1. Import Textarea Component

Menambahkan import untuk Textarea component:

```typescript
import { Textarea } from "@/components/ui/textarea";
```

### 2. Fungsi Format Tanggal untuk Invitation

Menambahkan fungsi baru untuk format tanggal dalam gaya Zoom:

```typescript
const formatDateForInvitation = (dateStr: string, timeStr: string | null) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  const formattedDate = date.toLocaleDateString('en-US', options);
  const time = timeStr || '00:00';
  return `${formattedDate} ${time} Jakarta`;
};
```

### 3. Fungsi Generate Invitation Text

Menambahkan fungsi untuk generate teks undangan:

```typescript
const generateInvitationText = (order: OrderDetails): string => {
  const dateTime = formatDateForInvitation(order.meeting_date, order.meeting_time);
  const topic = order.meeting_topic || 'Zoom Meeting';
  
  return `${order.name} is inviting you to a scheduled Zoom meeting.

Topic: ${topic}
Time: ${dateTime}

Join Zoom Meeting
${order.zoom_link}

Meeting ID: ${order.meeting_id}
Passcode: ${order.zoom_passcode}`;
};
```

### 4. Tambah Section Invitation di Halaman Detail Zoom

Menambahkan section "Invitation" setelah bagian Link Meeting dan sebelum tombol "Buka Zoom Meeting":

```tsx
{/* Invitation Text */}
<Separator />
<div>
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm text-muted-foreground">Invitation</span>
    <Button
      size="sm"
      variant="outline"
      onClick={() => copyToClipboard(
        generateInvitationText(order), 
        "Invitation"
      )}
    >
      <Copy className="w-3 h-3 mr-1" />
      Copy
    </Button>
  </div>
  <Textarea
    readOnly
    value={generateInvitationText(order)}
    className="min-h-[180px] font-mono text-xs resize-none bg-muted cursor-default"
  />
</div>
```

## Lokasi Perubahan di File

| Line | Perubahan |
|------|-----------|
| ~28 | Import Textarea component |
| ~80 | Tambah fungsi `formatDateForInvitation` |
| ~90 | Tambah fungsi `generateInvitationText` |
| ~500 (setelah Link Meeting) | Tambah section Invitation dengan Textarea |

## Preview UI

```text
┌─────────────────────────────────────┐
│ Detail Zoom Meeting                 │
├─────────────────────────────────────┤
│ Meeting ID                          │
│ ┌─────────────────────────┐ [Copy]  │
│ │ 88658043464             │         │
│ └─────────────────────────┘         │
│                                     │
│ Passcode                            │
│ ┌─────────────────────────┐ [Copy]  │
│ │ 651470                  │         │
│ └─────────────────────────┘         │
│                                     │
│ Link Meeting                        │
│ ┌─────────────────────────┐ [Copy]  │
│ │ https://us06web.zoom... │         │
│ └─────────────────────────┘         │
│                                     │
│ ─────────────────────────────────── │
│                                     │
│ Invitation                  [Copy]  │
│ ┌─────────────────────────────────┐ │
│ │ FDN is inviting you to a       │ │
│ │ scheduled Zoom meeting.         │ │
│ │                                 │ │
│ │ Topic: tew                      │ │
│ │ Time: Jan 31, 2026 12:00 PM    │ │
│ │ Jakarta                         │ │
│ │                                 │ │
│ │ Join Zoom Meeting               │ │
│ │ https://us06web.zoom.us/j/...   │ │
│ │                                 │ │
│ │ Meeting ID: 88658043464         │ │
│ │ Passcode: 651470                │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [      Buka Zoom Meeting      ]     │
└─────────────────────────────────────┘
```

## Catatan Implementasi

- Text area akan `readOnly` sehingga user tidak bisa mengedit
- Background menggunakan `bg-muted` agar terlihat seperti display area, bukan input
- Font mono untuk tampilan yang rapi
- Cursor `cursor-default` karena tidak bisa diedit
- Minimum height `180px` untuk menampilkan seluruh konten
- Tombol copy kecil (`size="sm"`) di sebelah kanan label "Invitation"
