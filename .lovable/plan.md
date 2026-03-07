

# Tambah Trigger Manual Notifikasi Admin di Order Detail Dialog

## Perubahan: `src/components/admin/OrderDetailDialog.tsx`

Tambahkan section baru **"Notifikasi Admin"** di dialog detail order, tepat setelah section WhatsApp Notification (sebelum Timeline). Section ini berisi tombol untuk memanggil `notify-admin-order` Edge Function secara manual.

### Detail Implementasi

1. **State baru**: `sendingAdminNotif` (boolean loading state)
2. **Handler baru**: `handleNotifyAdmin()` — memanggil `supabase.functions.invoke('notify-admin-order', { body: { order_id, event_type } })` dengan event_type pilihan (default "new_order" untuk pending, "payment_success" untuk paid)
3. **UI**: Section dengan icon `Bell`, judul "Notifikasi Admin WA", deskripsi singkat, dan tombol trigger. Tersedia untuk semua status order (tidak hanya paid).
4. **Posisi**: Setelah WhatsApp Notification section, sebelum Timeline separator.

### Struktur UI

```
─── Notifikasi Admin WA ───
Kirim notifikasi order ke WhatsApp admin.

[ 🔔 Kirim Notif Admin ]
```

| File | Perubahan |
|------|-----------|
| `OrderDetailDialog.tsx` | Tambah state, handler, dan UI section untuk trigger manual notify-admin-order |

