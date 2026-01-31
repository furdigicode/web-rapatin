
# Rencana: Fitur Resend Email dari Admin Panel

## Ringkasan

Menambahkan tombol "Kirim Ulang Email" di dialog detail order pada admin panel. Tombol ini memungkinkan admin untuk mengirim ulang email konfirmasi jika email gagal terkirim atau perlu dikirim ulang.

---

## Tampilan

```text
┌─────────────────────────────────────────────────────┐
│  Detail Order                      INV-260131-0001  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Bagian yang sudah ada...]                         │
│                                                     │
├─────────────────────────────────────────────────────┤
│  📧 EMAIL KONFIRMASI                                │
│  ─────────────────────                              │
│                                                     │
│  Kirim email konfirmasi order & detail Zoom ke      │
│  pelanggan.                                         │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  📧  Kirim Email Konfirmasi                 │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ⚠ Pastikan Zoom meeting sudah tersedia sebelum    │
│    mengirim email.                                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Logika Tombol

| Kondisi | Tampilan Tombol | Aksi |
|---------|-----------------|------|
| Status bukan `paid` | Hidden | - |
| Status `paid` tapi belum ada `zoom_link` | Disabled + warning | Tidak bisa kirim |
| Status `paid` dan ada `zoom_link` | Enabled | Kirim email |
| Sedang mengirim | Loading spinner | - |

---

## Perubahan File

### 1. `src/components/admin/OrderDetailDialog.tsx`

**Tambah state dan handler:**
```typescript
const [sendingEmail, setSendingEmail] = useState(false);

const handleResendEmail = async () => {
  setSendingEmail(true);
  try {
    const { data, error } = await supabase.functions.invoke('send-order-email', {
      body: { orderId: order.id }
    });
    
    if (error || data?.error) {
      toast({
        title: "Gagal mengirim email",
        description: error?.message || data?.error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Email terkirim",
        description: `Email konfirmasi berhasil dikirim ke ${order.email}`
      });
    }
  } catch (err) {
    toast({
      title: "Error",
      description: "Terjadi kesalahan saat mengirim email",
      variant: "destructive"
    });
  }
  setSendingEmail(false);
};
```

**Tambah section Email setelah Kledo Integration (sebelum Timeline):**
```typescript
{/* Email Konfirmasi Section - only for paid orders */}
{order.payment_status === 'paid' && (
  <>
    <Separator />
    <div className="space-y-3">
      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
        <Mail className="h-4 w-4" />
        Email Konfirmasi
      </h3>
      <div className="grid gap-3 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          Kirim email konfirmasi order & detail Zoom ke pelanggan.
        </p>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleResendEmail}
          disabled={sendingEmail || !hasZoomData}
          className="w-full"
        >
          {sendingEmail ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Mail className="h-4 w-4 mr-2" />
          )}
          Kirim Email Konfirmasi
        </Button>
        
        {!hasZoomData && (
          <p className="text-xs text-orange-600 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Zoom meeting harus tersedia sebelum mengirim email
          </p>
        )}
      </div>
    </div>
  </>
)}
```

---

## Detail Perubahan

| Baris | Perubahan |
|-------|-----------|
| ~100 | Tambah state `sendingEmail` |
| ~233 (setelah handleSyncKledo) | Tambah function `handleResendEmail` |
| ~680 (setelah Kledo section) | Tambah section Email Konfirmasi |

---

## Alur Kerja

```text
┌────────────────┐     ┌────────────────────┐     ┌────────────────────┐
│ Admin klik     │────►│ Validasi zoom_link │────►│ Invoke edge func   │
│ "Kirim Email"  │     │ tersedia           │     │ send-order-email   │
└────────────────┘     └────────────────────┘     └────────────────────┘
                                                           │
                                                           ▼
                                                  ┌────────────────────┐
                                                  │ Toast notification │
                                                  │ sukses/gagal       │
                                                  └────────────────────┘
```

---

## Ringkasan File

| File | Aksi | Deskripsi |
|------|------|-----------|
| `src/components/admin/OrderDetailDialog.tsx` | Ubah | Tambah state, handler, dan UI section email |

---

## Hasil

| Aspek | Deskripsi |
|-------|-----------|
| Akses | Hanya muncul untuk order dengan status `paid` |
| Validasi | Disabled jika Zoom meeting belum tersedia |
| Feedback | Toast notification untuk sukses/gagal |
| Non-blocking | Tidak mengganggu alur kerja admin lainnya |
