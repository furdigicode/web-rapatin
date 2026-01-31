

# Rencana: Perbaikan Email Sender Mailjet

## Masalah

Berdasarkan logs:
```
Email sent successfully: {"Messages":[{"Status":"success",...}]}
```

Mailjet menerima request dengan sukses, tapi email tidak sampai ke inbox. Kemungkinan besar karena **domain sender belum terverifikasi** di Mailjet.

---

## Perubahan Kode

### File: `supabase/functions/send-order-email/index.ts`

Ubah email pengirim dari `noreply@rapatin.id` ke `admin@rapatin.id`:

**Baris 358-361 (sebelum):**
```typescript
From: {
  Email: "noreply@rapatin.id",
  Name: "Rapatin"
},
```

**Baris 358-361 (sesudah):**
```typescript
From: {
  Email: "admin@rapatin.id",
  Name: "Rapatin"
},
```

---

## Checklist di Mailjet Dashboard

Untuk memastikan email terkirim, pastikan:

1. **Verifikasi Domain** di [Mailjet Sender Domains](https://app.mailjet.com/account/sender):
   - Tambahkan domain `rapatin.id`
   - Set DNS records (SPF, DKIM, DMARC)

2. **Atau Verifikasi Email Sender**:
   - Tambahkan `admin@rapatin.id` sebagai verified sender
   - Klik link verifikasi yang dikirim ke email tersebut

3. **Cek Spam Folder** - Email mungkin masuk ke folder spam jika domain belum fully verified

---

## Ringkasan

| Item | Perubahan |
|------|-----------|
| File | `supabase/functions/send-order-email/index.ts` |
| Baris | 359 |
| Perubahan | `noreply@rapatin.id` → `admin@rapatin.id` |

---

## Catatan Penting

API endpoint sudah benar menggunakan **v3.1**:
```typescript
// Baris 374
const mailjetResponse = await fetch('https://api.mailjet.com/v3.1/send', {...});
```

Format payload juga sudah sesuai dengan dokumentasi Mailjet Send API v3.1 yang Anda tunjukkan.

