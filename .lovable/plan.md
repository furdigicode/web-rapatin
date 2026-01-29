
# Rencana: Tambah Tombol Open Link di Sebelah Kiri Tombol Copy

## Ringkasan

Menambahkan tombol untuk membuka link meeting di tab baru, diposisikan di sebelah kiri tombol copy yang sudah ada.

---

## Perubahan yang Diperlukan

### File: `src/pages/QuickOrderDetail.tsx`

**Lokasi:** Line 659-665 (bagian Link Meeting)

**Sebelum:**
```tsx
<Button
  size="icon"
  variant="outline"
  onClick={() => copyToClipboard(order.zoom_link!, "Link meeting")}
>
  <Copy className="w-4 h-4" />
</Button>
```

**Sesudah:**
```tsx
<Button
  size="icon"
  variant="outline"
  onClick={() => window.open(order.zoom_link!, "_blank")}
  title="Buka link"
>
  <ExternalLink className="w-4 h-4" />
</Button>
<Button
  size="icon"
  variant="outline"
  onClick={() => copyToClipboard(order.zoom_link!, "Link meeting")}
  title="Salin link"
>
  <Copy className="w-4 h-4" />
</Button>
```

---

## Tampilan yang Diharapkan

```text
Link Meeting
┌────────────────────────────────────┐  ┌───┐  ┌───┐
│  https://zoom.us/j/123456789       │  │ ↗ │  │📋│
└────────────────────────────────────┘  └───┘  └───┘
                                        Open   Copy
```

---

## Catatan

- Icon `ExternalLink` sudah di-import di file ini
- Tombol open menggunakan `window.open()` dengan target `_blank` untuk membuka di tab baru
- Menambahkan `title` attribute untuk tooltip pada kedua tombol

---

## File yang Diubah

| File | Perubahan |
|------|-----------|
| `src/pages/QuickOrderDetail.tsx` | Tambah tombol ExternalLink di sebelah kiri tombol Copy |
