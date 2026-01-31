

# Rencana: Update Warna & Tambah Tombol Panduan Host di Email

## Ringkasan

Mengubah warna email template sesuai brand aplikasi (cyan/teal) dan menambahkan tombol "Panduan Menjadi Host" setelah credentials card.

---

## Warna Brand Aplikasi

| Elemen | Warna Lama | Warna Baru |
|--------|------------|------------|
| Primary | `#2563eb` (blue-600) | `#0891b2` (cyan-600) |
| Primary Dark | `#1d4ed8` (blue-700) | `#0e7490` (cyan-700) |
| Primary Light | `#bfdbfe` (blue-200) | `#a5f3fc` (cyan-200) |
| Shadow | `rgba(37, 99, 235, 0.4)` | `rgba(8, 145, 178, 0.4)` |

---

## Perubahan Detail

### File: `supabase/functions/send-order-email/index.ts`

### 1. Header Background (Baris 83)

```typescript
// Sebelum
background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)
color subtitle: #bfdbfe

// Sesudah  
background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%)
color subtitle: #a5f3fc
```

### 2. Total Bayar Price (Baris 147)

```typescript
// Sebelum
color: #2563eb

// Sesudah
color: #0891b2
```

### 3. Gabung Meeting Button (Baris 164)

```typescript
// Sebelum
background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)
box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4)

// Sesudah
background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%)
box-shadow: 0 4px 14px rgba(8, 145, 178, 0.4)
```

### 4. Tambah Tombol Panduan Menjadi Host (Setelah Baris 191)

Menambahkan tombol baru setelah credentials table dengan link ke video YouTube:

```html
<!-- Panduan Button -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px;">
  <tr>
    <td align="center">
      <a href="https://www.youtube.com/watch?v=8QX78u43_JE" target="_blank" 
         style="display: inline-block; background: #f3f4f6; color: #374151; 
                text-decoration: none; padding: 12px 24px; border-radius: 8px; 
                font-size: 14px; font-weight: 500; border: 1px solid #d1d5db;">
        📖 Panduan Cara Menjadi Host
      </a>
    </td>
  </tr>
</table>
```

---

## Preview Perubahan

```text
┌─────────────────────────────────────────────────────┐
│           HEADER (Cyan Gradient)                    │
│                    🎉 Rapatin                       │
│              Pembayaran Berhasil!                   │
├─────────────────────────────────────────────────────┤
│  ...                                                │
│                                                     │
│  Total Bayar              Rp150.000  (cyan color)  │
│                                                     │
│  🔐 Kredensial Zoom                                │
│  ───────────────────────────────────────           │
│                                                     │
│         ┌──────────────────────────┐               │
│         │ 🔵 Gabung Meeting        │ (cyan button) │
│         └──────────────────────────┘               │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ Meeting ID            123 4567 8901         │   │
│  │ Passcode                          abc123    │   │
│  │ Host Key                          070707    │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│         ┌──────────────────────────┐               │
│         │ 📖 Panduan Cara Menjadi  │  ← NEW       │
│         │         Host             │  (gray btn)  │
│         └──────────────────────────┘               │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 💡 Tips Penting                             │   │
│  │ ...                                         │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Ringkasan Perubahan

| Lokasi | Baris | Perubahan |
|--------|-------|-----------|
| Header gradient | 83 | `#2563eb → #0891b2`, `#1d4ed8 → #0e7490` |
| Subtitle color | 85 | `#bfdbfe → #a5f3fc` |
| Total Bayar | 147 | `#2563eb → #0891b2` |
| Gabung Meeting button | 164 | Gradient & shadow → cyan colors |
| Panduan button | setelah 191 | Tambah tombol baru |

