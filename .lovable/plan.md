

# Rencana: Reorder Field Detail Meeting di Quick Order Form

## Ringkasan
Mengubah urutan field di section "Detail Meeting" dan membuat Tanggal & Jam dalam satu baris horizontal, serta menetapkan default jumlah peserta ke 100.

## Perubahan yang Diperlukan

### Urutan Field Baru

```text
Detail Meeting
├── 1. Jumlah Peserta (default: 100)
├── 2. Topik Meeting
├── 3. Tanggal & Jam ─────────────────┐
│      [Tanggal Meeting] [Jam Meeting]│  ← Satu baris horizontal
│                                      ┘
├── 4. Passcode (Opsional)
└── 5. Pengaturan Meeting Lanjutan (Collapsible)
```

### File yang Diubah

**1. `src/components/quick-order/QuickOrderForm.tsx`**

Perubahan:
- Set default `selectedPackage` ke `100` (bukan `null`)
- Set default `participant_count` di form ke `100`
- Pindahkan PackageSelector ke posisi pertama di section "Detail Meeting"
- Pindahkan field Topik Meeting dari `MeetingSettingsSection` ke `QuickOrderForm`
- Buat wrapper `div` dengan `grid grid-cols-2 gap-4` untuk Tanggal & Jam
- Pindahkan field Passcode dari `MeetingSettingsSection` ke `QuickOrderForm`
- Sisakan hanya Collapsible pengaturan lanjutan di `MeetingSettingsSection`

**Layout Baru:**
```text
<div className="space-y-4">
  <h3>Detail Meeting</h3>
  
  {/* 1. Jumlah Peserta */}
  <PackageSelector ... />
  
  {/* 2. Topik Meeting */}
  <Input meeting_topic ... />
  
  {/* 3. Tanggal & Jam (horizontal) */}
  <div className="grid grid-cols-2 gap-4">
    <DatePicker meeting_date ... />
    <TimePicker meeting_time ... />
  </div>
  
  {/* 4. Passcode */}
  <Input custom_passcode ... />
  
  {/* 5. Pengaturan Lanjutan */}
  <MeetingSettingsSection ... />  <!-- Hanya berisi Collapsible -->
</div>
```

**2. `src/components/quick-order/MeetingSettingsSection.tsx`**

Perubahan:
- Hapus field `meeting_topic` dan `custom_passcode` (dipindah ke parent)
- Sisakan hanya Collapsible dengan 5 toggle pengaturan lanjutan

### Detail Implementasi

**Default 100 Peserta:**
```typescript
// Di QuickOrderForm.tsx
const [selectedPackage, setSelectedPackage] = useState<number>(100);

// Di form defaultValues
const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    participant_count: 100, // Default ke 100
    // ... other defaults
  },
});
```

**Layout Horizontal Tanggal & Jam:**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {/* Tanggal Meeting */}
  <FormField
    name="meeting_date"
    ...
  />
  
  {/* Jam Meeting */}
  <FormField
    name="meeting_time"
    ...
  />
</div>
```

### Hasil Akhir UI

```text
┌─────────────────────────────────────────────────┐
│ Detail Meeting                                   │
├─────────────────────────────────────────────────┤
│ Jumlah Peserta                                   │
│ ┌────┐ ┌────┐ ┌────┐ ┌─────┐                    │
│ │100 │ │300 │ │500 │ │1000 │                    │
│ │ ✓  │ │    │ │    │ │     │  ← Default 100     │
│ └────┘ └────┘ └────┘ └─────┘                    │
├─────────────────────────────────────────────────┤
│ Topik Meeting                                    │
│ [Team Meeting Weekly                        ]    │
├─────────────────────────────────────────────────┤
│ ┌──────────────────┐ ┌──────────────────┐       │
│ │ Tanggal Meeting  │ │ Jam Meeting      │       │
│ │ [Senin, 27 Jan ] │ │ [09:00      ▼]   │       │
│ └──────────────────┘ └──────────────────┘       │
├─────────────────────────────────────────────────┤
│ Passcode (Opsional)                              │
│ [123456                                     ]    │
│ Kosongkan untuk auto-generate                    │
├─────────────────────────────────────────────────┤
│ ▼ Pengaturan Meeting Lanjutan                    │
│   ┌─────────────────────────────────────────┐   │
│   │ [ ] Registrasi Peserta                  │   │
│   │ [ ] Fitur Q&A                           │   │
│   │ [ ] Interpretasi Bahasa                 │   │
│   │ [ ] Mute Saat Masuk                     │   │
│   │ [ ] Minta Izin Unmute                   │   │
│   └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

## Urutan Implementasi

1. Update `MeetingSettingsSection.tsx` - Hapus field topic & passcode
2. Update `QuickOrderForm.tsx`:
   - Set default selectedPackage ke 100
   - Reorder fields sesuai urutan baru
   - Tambah field topic & passcode langsung di form
   - Buat layout horizontal untuk tanggal & jam

