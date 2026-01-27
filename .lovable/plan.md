
# Rencana: Masking Data Email dan WhatsApp

## Ringkasan
Menambahkan fungsi masking untuk menyembunyikan sebagian karakter pada data sensitif (email dan nomor WhatsApp) di halaman Quick Order Detail agar lebih aman jika link dibagikan atau dilihat orang lain.

## Contoh Masking

| Data Asli | Setelah Masking |
|-----------|-----------------|
| `rapatinapp@gmail.com` | `rap*****@gmail.com` |
| `johndoe@company.co.id` | `joh****@company.co.id` |
| `081234567890` | `0812****7890` |
| `+6281234567890` | `+6281****7890` |

## Logika Masking

### Email Masking
- Tampilkan 3 karakter pertama dari username
- Ganti sisanya dengan asterisk (`*`)
- Tampilkan domain lengkap (setelah `@`)
- Contoh: `john.doe@example.com` → `joh*****@example.com`

### WhatsApp Masking
- Tampilkan 4 digit pertama (termasuk kode negara jika ada)
- Ganti 4 digit tengah dengan asterisk
- Tampilkan 4 digit terakhir
- Contoh: `081234567890` → `0812****7890`

## Perubahan File

### File yang Diubah: `src/pages/QuickOrderDetail.tsx`

Tambahkan 2 fungsi helper untuk masking:

```typescript
// Fungsi masking email
const maskEmail = (email: string): string => {
  const [username, domain] = email.split('@');
  if (!domain) return email;
  
  const visibleChars = Math.min(3, username.length);
  const masked = username.slice(0, visibleChars) + '*'.repeat(Math.max(username.length - visibleChars, 3));
  
  return `${masked}@${domain}`;
};

// Fungsi masking nomor telepon/WhatsApp
const maskPhone = (phone: string): string => {
  // Hapus semua karakter non-digit untuk penghitungan
  const digitsOnly = phone.replace(/\D/g, '');
  
  if (digitsOnly.length < 8) return phone;
  
  // Tampilkan 4 digit pertama dan 4 digit terakhir
  const prefix = phone.slice(0, 4);
  const suffix = phone.slice(-4);
  const middleLength = phone.length - 8;
  
  return `${prefix}${'*'.repeat(Math.max(middleLength, 4))}${suffix}`;
};
```

### Lokasi Perubahan di JSX

```tsx
// Baris 366 - Email (sebelumnya)
<p className="font-medium">{order.email}</p>

// Menjadi
<p className="font-medium">{maskEmail(order.email)}</p>

// Baris 374 - WhatsApp (sebelumnya)
<p className="font-medium">{order.whatsapp}</p>

// Menjadi
<p className="font-medium">{maskPhone(order.whatsapp)}</p>
```

## Hasil Akhir

```text
┌─────────────────────────────────────────────────┐
│ DETAIL ORDER                                     │
│ ├─ Nama      : John Doe                         │
│ ├─ Email     : joh*****@gmail.com      (masked) │
│ ├─ WhatsApp  : 0812****7890            (masked) │
│ ├─ Topik     : Team Meeting Weekly              │
│ └─ ...                                          │
└─────────────────────────────────────────────────┘
```

## Catatan Keamanan

- Masking hanya dilakukan di **frontend** untuk display
- Data asli tetap tersimpan di database (tidak berubah)
- Data asli tetap dikirim ke email/WhatsApp customer
- Ini mencegah orang yang tidak berhak melihat data lengkap jika mendapat akses ke link

## Urutan Implementasi

1. Tambahkan fungsi `maskEmail()` di `QuickOrderDetail.tsx`
2. Tambahkan fungsi `maskPhone()` di `QuickOrderDetail.tsx`
3. Update tampilan email untuk menggunakan masking
4. Update tampilan WhatsApp untuk menggunakan masking
