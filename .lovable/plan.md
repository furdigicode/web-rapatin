

# Rencana: Pindah Payment Method & Buat Timeline Visual

## Ringkasan Perubahan

1. Pindahkan informasi "Metode Pembayaran" ke dekat "Total Bayar" di kartu Detail Order
2. Ubah section "Riwayat" menjadi timeline visual dengan titik-titik (dot) dan garis penghubung seperti stepper/wizard

## File yang Diubah

`src/pages/QuickOrderDetail.tsx`

---

## Detail Perubahan

### 1. Pindahkan Payment Method ke Dekat Total Bayar

**Lokasi**: Lines 460-468

**Sebelum:**
```tsx
<Separator />

<div className="flex items-start gap-3">
  <CreditCard className="w-5 h-5 text-muted-foreground mt-0.5" />
  <div className="flex-1">
    <p className="text-sm text-muted-foreground">Total Bayar</p>
    <p className="text-xl font-bold text-primary">{formatRupiah(order.price)}</p>
  </div>
</div>
```

**Sesudah:**
```tsx
<Separator />

<div className="flex items-start gap-3">
  <CreditCard className="w-5 h-5 text-muted-foreground mt-0.5" />
  <div className="flex-1">
    <p className="text-sm text-muted-foreground">Total Bayar</p>
    <p className="text-xl font-bold text-primary">{formatRupiah(order.price)}</p>
    {order.payment_method && (
      <p className="text-sm text-muted-foreground mt-1">
        via <span className="font-medium text-foreground">{order.payment_method}</span>
      </p>
    )}
  </div>
</div>
```

### 2. Ubah Section Riwayat Menjadi Timeline Visual

**Lokasi**: Lines 579-601

**Sebelum:**
```tsx
{isPaid && order.paid_at && (
  <Card>
    <CardContent className="p-6">
      <h2 className="font-semibold text-lg mb-4">Riwayat</h2>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Order dibuat</span>
          <span>{formatDateTime(order.created_at)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Pembayaran diterima</span>
          <span className="text-green-600 font-medium">{formatDateTime(order.paid_at)}</span>
        </div>
        {order.payment_method && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Metode Pembayaran</span>
            <span className="font-medium">{order.payment_method}</span>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
)}
```

**Sesudah:**
```tsx
{isPaid && order.paid_at && (
  <Card>
    <CardContent className="p-6">
      <h2 className="font-semibold text-lg mb-4">Riwayat</h2>
      <div className="relative">
        {/* Timeline Item 1: Order Dibuat */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <div className="w-0.5 h-full bg-border min-h-[40px]" />
          </div>
          <div className="pb-6">
            <p className="font-medium text-sm">Order dibuat</p>
            <p className="text-sm text-muted-foreground">
              {formatDateTime(order.created_at)}
            </p>
          </div>
        </div>

        {/* Timeline Item 2: Pembayaran Diterima */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <div className="w-0.5 h-full bg-border min-h-[40px]" />
          </div>
          <div className="pb-6">
            <p className="font-medium text-sm text-green-600">Pembayaran diterima</p>
            <p className="text-sm text-muted-foreground">
              {formatDateTime(order.paid_at)}
            </p>
          </div>
        </div>

        {/* Timeline Item 3: Zoom Meeting Dibuat */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full ${order.zoom_link ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
          </div>
          <div>
            <p className={`font-medium text-sm ${order.zoom_link ? 'text-green-600' : 'text-yellow-600'}`}>
              {order.zoom_link ? 'Zoom meeting dibuat' : 'Membuat Zoom meeting...'}
            </p>
            {order.zoom_link && (
              <p className="text-sm text-muted-foreground">
                Meeting siap digunakan
              </p>
            )}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
)}
```

---

## Preview Tampilan

### Payment Method (di Detail Order)

```text
┌─────────────────────────────────────────┐
│ Detail Order                            │
├─────────────────────────────────────────┤
│ 💳 Total Bayar                          │
│    Rp100.000                            │
│    via QRIS (DANA)              ← Baru  │
└─────────────────────────────────────────┘
```

### Timeline Riwayat (Visual)

```text
┌─────────────────────────────────────────┐
│ Riwayat                                 │
├─────────────────────────────────────────┤
│  ●  Order dibuat                        │
│  │  Senin, 27 Januari 2026, 16:43       │
│  │                                      │
│  ●  Pembayaran diterima                 │
│  │  Senin, 27 Januari 2026, 16:50       │
│  │                                      │
│  ●  Zoom meeting dibuat                 │
│     Meeting siap digunakan              │
└─────────────────────────────────────────┘
```

**Keterangan Visual:**
- `●` = Titik/dot timeline (w-3 h-3 rounded-full)
- `│` = Garis penghubung vertikal (w-0.5 bg-border)
- Warna dot: primary untuk awal, green untuk sukses, yellow+pulse untuk proses

---

## Ringkasan Perubahan

| Aspek | Sebelum | Sesudah |
|-------|---------|---------|
| Payment Method | Di section Riwayat | Di bawah Total Bayar dengan format "via QRIS (DANA)" |
| Riwayat | List biasa dengan flex justify-between | Timeline visual dengan dots dan garis penghubung |
| Timeline Items | 2 items (order, bayar) + payment method | 3 items (order, bayar, zoom dibuat) |
| Status Zoom | Tidak ada di riwayat | Ditampilkan dengan status dinamis |

