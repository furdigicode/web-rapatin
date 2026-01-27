
# Rencana: Fitur Recurring Meeting (Meeting Berulang)

## Ringkasan

Menambahkan opsi meeting berulang di Quick Order form, memungkinkan pengguna untuk memesan Zoom meeting yang berulang secara harian, mingguan, atau bulanan dengan kalkulasi harga otomatis berdasarkan jumlah hari.

---

## Pemahaman Requirement

### Tipe Recurrence (dari API Rapatin)
| Nilai | Tipe | Keterangan |
|-------|------|------------|
| 1 | Harian | Setiap hari |
| 2 | Mingguan | Pilih hari-hari tertentu |
| 3 | Bulanan | Tanggal tertentu atau minggu tertentu |

### Parameter Recurring Meeting
- `recurring: boolean` - Wajib `true` untuk recurring
- `recurrence: 1|2|3` - Tipe pengulangan
- `repeat_interval: integer` - Interval (setiap 1 hari, setiap 2 minggu, dll)
- `weekly_days: integer[]` - Untuk mingguan: 1=Minggu, 2=Senin, ..., 7=Sabtu
- `monthly_day: integer` - Untuk bulanan: tanggal berapa (1-31)
- `monthly_week: 1-5` - Untuk bulanan: minggu ke berapa
- `end_type: 'end_date' | 'end_after_type'` - Cara penentuan akhir
- `end_date: string` - Tanggal selesai (jika end_type = end_date)
- `end_after_type: integer` - Jumlah pengulangan (jika end_type = end_after_type)

### Kalkulasi Harga
**Total = Harga per hari × Jumlah hari meeting**

Contoh:
- Paket 100 peserta = Rp10.000/hari
- Meeting berulang 5 hari = 5 × Rp10.000 = **Rp50.000**

---

## Perubahan Database

### Tabel `guest_orders` - Kolom Baru

```sql
ALTER TABLE guest_orders ADD COLUMN IF NOT EXISTS is_recurring boolean DEFAULT false;
ALTER TABLE guest_orders ADD COLUMN IF NOT EXISTS recurrence_type integer; -- 1=daily, 2=weekly, 3=monthly
ALTER TABLE guest_orders ADD COLUMN IF NOT EXISTS repeat_interval integer DEFAULT 1;
ALTER TABLE guest_orders ADD COLUMN IF NOT EXISTS weekly_days integer[]; -- untuk weekly
ALTER TABLE guest_orders ADD COLUMN IF NOT EXISTS monthly_day integer; -- untuk monthly
ALTER TABLE guest_orders ADD COLUMN IF NOT EXISTS monthly_week integer; -- untuk monthly (minggu ke-n)
ALTER TABLE guest_orders ADD COLUMN IF NOT EXISTS end_type text; -- 'end_date' atau 'end_after_type'
ALTER TABLE guest_orders ADD COLUMN IF NOT EXISTS recurrence_end_date date; -- tanggal berakhir
ALTER TABLE guest_orders ADD COLUMN IF NOT EXISTS recurrence_count integer; -- jumlah pengulangan
ALTER TABLE guest_orders ADD COLUMN IF NOT EXISTS total_days integer DEFAULT 1; -- total hari untuk kalkulasi harga
```

---

## Perubahan File

### 1. Komponen Baru: `RecurringMeetingSection.tsx`

Komponen collapsible untuk pengaturan recurring meeting:

```text
┌─────────────────────────────────────────────────────────────┐
│ 🔄 Meeting Berulang                                    [✓]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Tipe Pengulangan:                                           │
│ [Harian] [Mingguan] [Bulanan]                               │
│                                                             │
│ ┌─────────── Jika HARIAN ───────────┐                       │
│ │ Setiap: [1] hari                  │                       │
│ └───────────────────────────────────┘                       │
│                                                             │
│ ┌─────────── Jika MINGGUAN ─────────┐                       │
│ │ Setiap: [1] minggu                │                       │
│ │ Pada hari:                        │                       │
│ │ [Min][Sen][Sel][Rab][Kam][Jum][Sab]│                       │
│ └───────────────────────────────────┘                       │
│                                                             │
│ ┌─────────── Jika BULANAN ──────────┐                       │
│ │ Setiap: [1] bulan                 │                       │
│ │ ○ Pada tanggal: [15]              │                       │
│ │ ○ Pada minggu: [Pertama] [Senin]  │                       │
│ └───────────────────────────────────┘                       │
│                                                             │
│ Berakhir:                                                   │
│ ○ Pada tanggal: [Pilih tanggal]                             │
│ ○ Setelah: [5] kali pertemuan                               │
│                                                             │
│ ═══════════════════════════════════════════                 │
│ 📅 Preview: 5 sesi meeting                                  │
│    • 27 Jan 2026, 09:00                                     │
│    • 28 Jan 2026, 09:00                                     │
│    • 29 Jan 2026, 09:00                                     │
│    • 30 Jan 2026, 09:00                                     │
│    • 31 Jan 2026, 09:00                                     │
└─────────────────────────────────────────────────────────────┘
```

### 2. Update `QuickOrderForm.tsx`

**Perubahan Schema Zod:**
```typescript
// Tambahan field untuk recurring
is_recurring: z.boolean().default(false),
recurrence_type: z.number().optional(), // 1=daily, 2=weekly, 3=monthly
repeat_interval: z.number().min(1).optional(),
weekly_days: z.array(z.number()).optional(),
monthly_day: z.number().min(1).max(31).optional(),
monthly_week: z.number().min(1).max(5).optional(),
end_type: z.enum(['end_date', 'end_after_type']).optional(),
recurrence_end_date: z.date().optional(),
recurrence_count: z.number().min(1).max(99).optional(),
```

**Perubahan Form:**
- Tambah import RecurringMeetingSection
- Tambah state untuk tracking jumlah hari (`totalDays`)
- Kalkulasi harga: `currentPrice × totalDays`
- Kirim data recurring ke edge function

### 3. Update `PricingSummary.tsx`

**Perubahan:**
- Tambah prop `totalDays` dan `isRecurring`
- Tampilkan breakdown harga:
  ```text
  Harga per hari:     Rp10.000
  Jumlah hari:        5 hari
  ─────────────────────────────
  Total Bayar:        Rp50.000
  ```
- Tampilkan preview tanggal-tanggal meeting

### 4. Update Edge Function `create-guest-order/index.ts`

**Perubahan:**
- Terima parameter recurring baru
- Validasi parameter berdasarkan recurrence_type
- Kalkulasi harga: `basePrice × totalDays`
- Simpan semua field recurring ke database

### 5. Update Edge Function `xendit-webhook/index.ts`

**Perubahan:**
- Kirim parameter recurring ke Rapatin API:
  ```typescript
  recurring: order.is_recurring,
  recurrence: order.recurrence_type,
  repeat_interval: order.repeat_interval,
  weekly_days: order.weekly_days,
  monthly_day: order.monthly_day,
  monthly_week: order.monthly_week,
  end_type: order.end_type,
  end_date: order.recurrence_end_date,
  end_after_type: order.recurrence_count,
  ```

### 6. Update `QuickOrderDetail.tsx`

**Perubahan:**
- Tampilkan informasi recurring jika `is_recurring = true`
- Tampilkan daftar tanggal-tanggal meeting

---

## Utility: Kalkulasi Jumlah Hari

Fungsi untuk menghitung total hari berdasarkan parameter recurring:

```typescript
function calculateRecurringDays(params: {
  startDate: Date;
  recurrenceType: 1 | 2 | 3;
  repeatInterval: number;
  endType: 'end_date' | 'end_after_type';
  endDate?: Date;
  endAfterCount?: number;
  weeklyDays?: number[];
}): { totalDays: number; dates: Date[] }
```

**Logika:**
1. **Harian**: 
   - `end_date`: Hitung hari dari start ke end, bagi dengan interval
   - `end_after_type`: Langsung return count

2. **Mingguan**:
   - Hitung berapa kali hari yang dipilih muncul dalam rentang

3. **Bulanan**:
   - Hitung berapa kali tanggal/minggu yang dipilih muncul

---

## Flow Pengguna

```text
1. User memilih paket (100 peserta = Rp10.000)
2. User mengisi topik meeting
3. User memilih tanggal mulai: 27 Januari 2026
4. User mengaktifkan toggle "Meeting Berulang"
5. User memilih:
   - Tipe: Harian
   - Interval: Setiap 1 hari
   - Berakhir: Setelah 5 kali
6. Preview menampilkan:
   - 5 tanggal meeting
   - Total: Rp50.000 (5 × Rp10.000)
7. User klik "Bayar Sekarang"
8. Setelah bayar, webhook Rapatin membuat recurring meeting
```

---

## Catatan Teknis

### Validasi
- Jika recurring aktif, minimal harus ada 2 hari
- End date tidak boleh sebelum start date
- Weekly days wajib dipilih minimal 1 jika recurrence = 2
- Monthly day/week wajib diisi jika recurrence = 3
- Max interval: Daily 99, Weekly 50, Monthly 10

### Edge Cases
- Jika start_date jatuh di hari yang tidak dipilih (weekly), munculkan warning
- Jika monthly_day > hari dalam bulan tertentu (misal 31 Februari), Rapatin akan auto-adjust

---

## Ringkasan Perubahan

| File | Aksi |
|------|------|
| Database migration | Tambah 10 kolom baru untuk recurring |
| `src/components/quick-order/RecurringMeetingSection.tsx` | **Baru** - Komponen pengaturan recurring |
| `src/components/quick-order/QuickOrderForm.tsx` | Update schema, tambah recurring section |
| `src/components/quick-order/PricingSummary.tsx` | Update tampilan harga & preview tanggal |
| `src/utils/recurringCalculation.ts` | **Baru** - Utility kalkulasi hari |
| `supabase/functions/create-guest-order/index.ts` | Terima & validasi parameter recurring |
| `supabase/functions/xendit-webhook/index.ts` | Kirim parameter recurring ke Rapatin |
| `src/pages/QuickOrderDetail.tsx` | Tampilkan info recurring |
| `src/types/OrderTypes.ts` | Tambah tipe untuk recurring fields |
