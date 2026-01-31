

# Rencana: Perbaikan Tampilan Email Mobile

## Ringkasan

Memperbaiki tampilan email konfirmasi di Gmail mobile agar cards full-width, menambah spacing sebelum footer, dan mengubah link WhatsApp menjadi tombol.

---

## Masalah & Solusi

| Masalah | Lokasi | Solusi |
|---------|--------|--------|
| Cards tidak full width di mobile | Order Info, Detail Meeting, Zoom Credentials | Hapus padding dari inner `<td>`, pindahkan ke cell styling |
| Garis footer nempel ke Tips | Footer section | Tambah `margin-top` atau wrapper `<tr>` dengan padding |
| WhatsApp hanya link teks | Footer section | Ubah jadi tombol hijau dengan style seperti "Gabung Meeting" |

---

## Perubahan Detail

### 1. Order Info Card (Baris 101-118)

**Sebelum:**
```html
<table width="100%" ... style="background-color: #f0fdf4; border-radius: 12px; padding: 20px; ...">
  <tr>
    <td>
      <table width="100%">
```

**Sesudah:**
```html
<table width="100%" ... style="background-color: #f0fdf4; border-radius: 12px; ...">
  <tr>
    <td style="padding: 20px;">
      <table width="100%">
```

### 2. Zoom Credentials Card (Baris 171-185)

**Sebelum:**
```html
<table width="100%" ... style="background-color: #f9fafb; border-radius: 12px; padding: 16px; ...">
```

**Sesudah:**
```html
<table width="100%" ... style="background-color: #f9fafb; border-radius: 12px; ...">
  <tr>
    <td style="padding: 16px;">
      <!-- inner table wrapped -->
```

### 3. Tips Penting Card (Baris 192-203)

**Sebelum:**
```html
<table width="100%" ... style="background-color: #fffbeb; border-radius: 12px; padding: 16px; ...">
```

**Sesudah:**
```html
<table width="100%" ... style="background-color: #fffbeb; border-radius: 12px; ...">
  <tr>
    <td style="padding: 16px;">
```

### 4. Footer - Tambah Spacing (Baris 208-220)

**Sebelum:**
```html
<td style="padding: 32px; text-align: center; border-top: 1px solid #e5e7eb; margin-top: 24px;">
```

**Sesudah:**
```html
<!-- Spacer row before footer -->
<tr>
  <td style="height: 24px;"></td>
</tr>
<tr>
  <td style="padding: 32px; text-align: center; border-top: 1px solid #e5e7eb;">
```

### 5. WhatsApp - Ubah Link ke Tombol (Baris 210-215)

**Sebelum:**
```html
<p style="margin: 0; color: #6b7280; font-size: 13px;">
  Ada pertanyaan? Hubungi kami via WhatsApp
</p>
<a href="https://wa.me/6287788980084" style="display: inline-block; margin-top: 12px; color: #2563eb; text-decoration: none; font-size: 14px; font-weight: 600;">
  📱 0877-8898-0084
</a>
```

**Sesudah:**
```html
<p style="margin: 0 0 16px 0; color: #6b7280; font-size: 13px;">
  Ada pertanyaan? Hubungi kami via WhatsApp
</p>
<table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
  <tr>
    <td align="center">
      <a href="https://wa.me/6287788980084" target="_blank" 
         style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); 
                color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; 
                font-size: 14px; font-weight: 600; box-shadow: 0 4px 14px rgba(34, 197, 94, 0.4);">
        💬 Hubungi via WhatsApp
      </a>
    </td>
  </tr>
</table>
```

---

## Preview Perubahan

```text
┌─────────────────────────────────────────────────────┐
│                    🎉 Rapatin                        │
│              Pembayaran Berhasil!                    │
├─────────────────────────────────────────────────────┤
│  Halo Eky,                                          │
│  Terima kasih telah...                              │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ Order          INV-260130-0001              │   │ ← Full width
│  │ Status                    ✓ Lunas           │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  📋 Detail Meeting                                  │
│  ───────────────────────────────────────           │
│  Topik                    Coba Quick Order         │
│  Tanggal              Sabtu, 7 Februari 2026       │
│  ...                                               │
│                                                     │
│  🔐 Kredensial Zoom                                │
│  ───────────────────────────────────────           │
│              [ 🔵 Gabung Meeting ]                  │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ Meeting ID            123 4567 8901         │   │ ← Full width
│  │ Passcode                          abc123    │   │
│  │ Host Key                          070707    │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 💡 Tips Penting                             │   │ ← Full width
│  │ • Buka link meeting 5 menit...              │   │
│  │ • Gunakan Host Key...                       │   │
│  │ • Pastikan koneksi internet...              │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│                   ← 24px spacing →                  │
│  ───────────────────────────────────────────────   │
│         Ada pertanyaan? Hubungi kami via WA        │
│                                                     │
│         ┌──────────────────────────────┐           │
│         │ 💬 Hubungi via WhatsApp      │           │ ← Tombol hijau
│         └──────────────────────────────┘           │
│                                                     │
│          © 2026 Rapatin - Sewa Zoom...             │
└─────────────────────────────────────────────────────┘
```

---

## Ringkasan File

| File | Aksi | Deskripsi |
|------|------|-----------|
| `supabase/functions/send-order-email/index.ts` | Ubah | Perbaiki struktur HTML email untuk mobile |

---

## Catatan Teknis

Email HTML memerlukan teknik khusus untuk mobile:
- `padding` pada `<table>` tidak selalu di-support, harus dipindahkan ke `<td>`
- `margin-top` juga sering diabaikan di email clients, gunakan spacer `<tr>` sebagai gantinya
- Tombol dibuat dengan nested `<table>` untuk kompatibilitas maksimal

