

# Rencana: Set Default Tanggal dan Jam Meeting

## Ringkasan
Menambahkan nilai default untuk field tanggal (hari ini) dan jam (jam berikutnya dari waktu saat ini) di form Quick Order.

## Perubahan yang Diperlukan

### File yang Diubah

**`src/components/quick-order/QuickOrderForm.tsx`**

### Detail Implementasi

**1. Helper Function untuk Menghitung Jam Berikutnya:**

```typescript
// Fungsi untuk mendapatkan jam berikutnya
const getNextHour = (): string => {
  const now = new Date();
  let nextHour = now.getHours() + 1;
  
  // Jika sudah jam 23, kembali ke 00
  if (nextHour >= 24) {
    nextHour = 0;
  }
  
  return `${nextHour.toString().padStart(2, '0')}:00`;
};
```

**2. Update Default Values di Form:**

```typescript
const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    name: "",
    email: "",
    whatsapp: "",
    participant_count: 100,
    meeting_date: new Date(), // Default: hari ini
    meeting_time: getNextHour(), // Default: jam berikutnya
    meeting_topic: "",
    custom_passcode: "",
    is_meeting_registration: false,
    is_meeting_qna: false,
    is_language_interpretation: false,
    is_mute_upon_entry: false,
    is_req_unmute_permission: false,
  },
});
```

**3. Update Select Component untuk Time:**

```typescript
<Select 
  onValueChange={field.onChange} 
  value={field.value}  // Gunakan value bukan defaultValue
>
```

### Contoh Behavior

| Waktu Saat Ini | Default Jam |
|----------------|-------------|
| 11:19 | 12:00 |
| 09:45 | 10:00 |
| 23:30 | 00:00 |
| 00:15 | 01:00 |

### Hasil Akhir

```text
┌─────────────────────────────────────────────────┐
│ Tanggal & Jam                                    │
├─────────────────────────────────────────────────┤
│ ┌──────────────────┐ ┌──────────────────┐       │
│ │ Tanggal Meeting  │ │ Jam Meeting      │       │
│ │ [Senin, 27 Jan ] │ │ [12:00      ▼]   │       │
│ │   ← Hari ini     │ │   ← Jam berikut  │       │
│ └──────────────────┘ └──────────────────┘       │
└─────────────────────────────────────────────────┘
```

### Urutan Implementasi

1. Tambahkan helper function `getNextHour()` di atas komponen
2. Update `defaultValues` di `useForm` untuk include `meeting_date` dan `meeting_time`
3. Ubah `defaultValue` menjadi `value` pada Select component agar controlled

