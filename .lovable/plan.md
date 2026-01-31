

# Rencana: Perbaikan Warna Solid & Layout Email

## Ringkasan

Mengubah header dan tombol dari gradient ke warna solid `#179ecf`, menambah spacing sebelum footer, dan mengubah link WhatsApp menjadi tombol hijau.

---

## Perubahan Detail

### File: `supabase/functions/send-order-email/index.ts`

### 1. Header - Ubah ke Warna Solid (Baris 83)

| Sebelum | Sesudah |
|---------|---------|
| `background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%)` | `background-color: #179ecf` |

```html
<!-- Sebelum -->
<td style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 32px; text-align: center;">

<!-- Sesudah -->
<td style="background-color: #179ecf; padding: 32px; text-align: center;">
```

### 2. Tombol Gabung Meeting - Ubah ke Warna Solid (Baris 164)

| Sebelum | Sesudah |
|---------|---------|
| `background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%)` | `background-color: #179ecf` |
| `box-shadow: 0 4px 14px rgba(8, 145, 178, 0.4)` | Hapus box-shadow |

```html
<!-- Sebelum -->
<a href="${zoomLink}" ... style="... background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); ... box-shadow: 0 4px 14px rgba(8, 145, 178, 0.4);">

<!-- Sesudah -->
<a href="${zoomLink}" ... style="... background-color: #179ecf; ...">
```

### 3. Total Bayar - Update Warna (Baris 147)

| Sebelum | Sesudah |
|---------|---------|
| `color: #0891b2` | `color: #179ecf` |

### 4. Tips Penting - Tambah Padding Bawah (Baris 208)

| Sebelum | Sesudah |
|---------|---------|
| `padding: 24px 32px 0 32px` | `padding: 24px 32px 24px 32px` |

### 5. Footer - Tambah Spacer + Tombol WhatsApp (Baris 224-236)

Menambahkan:
- Spacer row sebelum footer untuk jarak yang lebih baik
- Mengubah link WhatsApp menjadi tombol hijau

```html
<!-- Spacer -->
<tr>
  <td style="height: 24px;"></td>
</tr>

<!-- Footer dengan tombol WhatsApp -->
<tr>
  <td style="padding: 32px; text-align: center; border-top: 1px solid #e5e7eb;">
    <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 13px;">
      Ada pertanyaan? Hubungi kami via WhatsApp
    </p>
    <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
      <tr>
        <td align="center">
          <a href="https://wa.me/6287788980084" target="_blank" 
             style="display: inline-block; background-color: #22c55e; 
                    color: #ffffff; text-decoration: none; padding: 14px 32px; 
                    border-radius: 12px; font-size: 14px; font-weight: 600;">
            💬 Hubungi via WhatsApp
          </a>
        </td>
      </tr>
    </table>
    <p style="margin: 24px 0 0 0; color: #9ca3af; font-size: 12px;">
      © 2026 Rapatin - Sewa Zoom Meeting Terpercaya
    </p>
  </td>
</tr>
```

---

## Preview Perubahan

```text
┌─────────────────────────────────────────────────────┐
│         HEADER (Solid #179ecf)                      │
│                    Rapatin                          │
│              Pembayaran Berhasil!                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Total Bayar          Rp150.000  (color: #179ecf)  │
│                                                     │
│         ┌──────────────────────────┐               │
│         │ 🔵 Gabung Meeting        │ (solid #179ecf)│
│         └──────────────────────────┘               │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 💡 Tips Penting                             │   │
│  │ ...                                         │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│              ← 24px spacer →                        │
│  ───────────────────────────────────────────────   │
│         Ada pertanyaan? Hubungi kami via WA        │
│                                                     │
│         ┌──────────────────────────┐               │
│         │ 💬 Hubungi via WhatsApp  │  (hijau)     │
│         └──────────────────────────┘               │
│                                                     │
│          © 2026 Rapatin - Sewa Zoom...             │
└─────────────────────────────────────────────────────┘
```

---

## Ringkasan Perubahan

| Lokasi | Baris | Perubahan |
|--------|-------|-----------|
| Header | 83 | `gradient → solid #179ecf` |
| Total Bayar | 147 | `#0891b2 → #179ecf` |
| Gabung Meeting button | 164 | `gradient → solid #179ecf`, hapus shadow |
| Tips Penting padding | 208 | `0 → 24px` padding bawah |
| Footer spacer | setelah 222 | Tambah `<tr>` spacer 24px |
| WhatsApp | 226-232 | Link → Tombol hijau `#22c55e` |

