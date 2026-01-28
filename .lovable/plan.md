

# Rencana: Tampilkan Semua Tanggal Sesi Recurring Meeting

## Ringkasan

Memperbarui halaman detail order (`QuickOrderDetail.tsx`) untuk menampilkan semua tanggal sesi meeting recurring, baik di bagian "Detail Order" maupun di teks "Invitation".

---

## Data Order yang Ditemukan

| Field | Value |
|-------|-------|
| Order ID | `070a00d5-3f4f-41a5-ac88-515db6c78e82` |
| Nama | Anif |
| is_recurring | true |
| recurrence_type | 1 (Harian) |
| repeat_interval | 7 (setiap 7 hari) |
| recurrence_count | 3 |
| total_days | 3 |
| meeting_date | 2026-02-05 |
| meeting_time | 08:00 |

**Tanggal sesi yang diharapkan:**
- 5 Februari 2026, 08:00
- 12 Februari 2026, 08:00
- 19 Februari 2026, 08:00

---

## Perubahan yang Diperlukan

### 1. Tambah Function untuk Generate Tanggal Sesi dari Order

Lokasi: Bagian atas file (helper functions)

```typescript
// Generate semua tanggal sesi untuk recurring meeting
const generateRecurringDates = (order: OrderDetails): Date[] => {
  if (!order.is_recurring || !order.total_days || order.total_days <= 1) {
    return [new Date(order.meeting_date)];
  }

  const dates: Date[] = [];
  const startDate = new Date(order.meeting_date);
  const totalDays = order.total_days;
  const recurrenceType = order.recurrence_type || 1;
  const repeatInterval = order.repeat_interval || 1;

  if (recurrenceType === 1) {
    // Daily: tambah hari sesuai interval
    for (let i = 0; i < totalDays; i++) {
      const date = addDays(startDate, i * repeatInterval);
      dates.push(date);
    }
  } else if (recurrenceType === 2) {
    // Weekly: gunakan weekly_days jika ada
    // (logika lebih kompleks, simplifikasi untuk MVP)
    for (let i = 0; i < totalDays; i++) {
      const date = addWeeks(startDate, i * repeatInterval);
      dates.push(date);
    }
  } else if (recurrenceType === 3) {
    // Monthly
    for (let i = 0; i < totalDays; i++) {
      const date = addMonths(startDate, i * repeatInterval);
      dates.push(date);
    }
  }

  return dates;
};
```

### 2. Update Bagian "Tanggal Meeting" di Detail Order

Lokasi: Line 491-502 

**Sebelum:**
```tsx
<div className="flex items-start gap-3">
  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
  <div>
    <p className="text-sm text-muted-foreground">
      {order.is_recurring ? 'Tanggal Mulai' : 'Tanggal Meeting'}
    </p>
    <p className="font-medium">
      {formatDate(order.meeting_date)}
      {order.meeting_time && ` • ${order.meeting_time} WIB`}
    </p>
  </div>
</div>
```

**Sesudah:**
```tsx
<div className="flex items-start gap-3">
  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
  <div>
    <p className="text-sm text-muted-foreground">
      {order.is_recurring && order.total_days && order.total_days > 1 
        ? 'Jadwal Meeting' 
        : 'Tanggal Meeting'}
    </p>
    {order.is_recurring && order.total_days && order.total_days > 1 ? (
      <div className="space-y-1">
        {generateRecurringDates(order).map((date, idx) => (
          <p key={idx} className="font-medium">
            {format(date, 'EEEE, d MMMM yyyy', { locale: id })}
            {order.meeting_time && ` • ${order.meeting_time} WIB`}
          </p>
        ))}
      </div>
    ) : (
      <p className="font-medium">
        {formatDate(order.meeting_date)}
        {order.meeting_time && ` • ${order.meeting_time} WIB`}
      </p>
    )}
  </div>
</div>
```

### 3. Update Function `generateInvitationText`

Lokasi: Line 122-136

**Sebelum:**
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

**Sesudah:**
```typescript
const generateInvitationText = (order: OrderDetails): string => {
  const topic = order.meeting_topic || 'Zoom Meeting';
  
  // Generate time section - multiple dates for recurring
  let timeSection: string;
  if (order.is_recurring && order.total_days && order.total_days > 1) {
    const dates = generateRecurringDates(order);
    const formattedDates = dates.map((date, idx) => {
      const formattedDate = format(date, 'MMM dd, yyyy', { locale: undefined }); // English format
      const time = order.meeting_time || '00:00';
      const timeFormatted = `${time.split(':')[0]}:${time.split(':')[1]} AM`;
      return idx === 0 
        ? `Time: ${formattedDate} ${timeFormatted} Jakarta`
        : `${formattedDate} ${timeFormatted} Jakarta`;
    });
    timeSection = formattedDates.join('\n');
  } else {
    timeSection = `Time: ${formatDateForInvitation(order.meeting_date, order.meeting_time)}`;
  }
  
  return `${order.name} is inviting you to a scheduled Zoom meeting.

Topic: ${topic}
${timeSection}

Join Zoom Meeting
${order.zoom_link}

Meeting ID: ${order.meeting_id}
Passcode: ${order.zoom_passcode}`;
};
```

### 4. Hapus Section "Recurring Info" yang Redundan

Lokasi: Line 512-528

Karena sekarang semua tanggal sudah ditampilkan di bagian "Jadwal Meeting", section "Meeting Berulang" menjadi redundan dan bisa dihapus untuk menghindari duplikasi informasi.

---

## Tampilan yang Diharapkan

### Detail Order (Recurring)
```text
Jadwal Meeting
Kamis, 5 Februari 2026 • 08:00 WIB
Kamis, 12 Februari 2026 • 08:00 WIB
Kamis, 19 Februari 2026 • 08:00 WIB
```

### Invitation Text
```text
Anif is inviting you to a scheduled Zoom meeting.

Topic: Recurring Quick Order
Time: Feb 05, 2026 08:00 AM Jakarta
Feb 12, 2026 08:00 AM Jakarta
Feb 19, 2026 08:00 AM Jakarta

Join Zoom Meeting
https://us06web.zoom.us/j/81397276352?pwd=...

Meeting ID: 81397276352
Passcode: 920649
```

---

## Import yang Diperlukan

Tambahkan import `addDays`, `addWeeks`, `addMonths`, dan `format` dari `date-fns`:

```typescript
import { format, addDays, addWeeks, addMonths } from "date-fns";
```

---

## File yang Diubah

| File | Perubahan |
|------|-----------|
| `src/pages/QuickOrderDetail.tsx` | Tambah helper `generateRecurringDates`, update tampilan tanggal, update invitation text |

