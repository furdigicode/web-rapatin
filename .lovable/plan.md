

# Rencana: Ubah "Panduan Menjadi Host" Menjadi Dialog

## Ringkasan

Mengubah tombol "Panduan Menjadi Host" yang saat ini berupa link eksternal menjadi tombol yang membuka dialog. Konten panduan akan ditambahkan kemudian oleh user.

---

## Perubahan yang Diperlukan

### File: `src/pages/QuickOrderDetail.tsx`

**Lokasi:** Line 692-701

**Sebelum:**
```tsx
<Button asChild variant="outline" className="flex-1">
  <a 
    href="https://example.com/panduan-host" 
    target="_blank" 
    rel="noopener noreferrer"
  >
    <BookOpen className="w-4 h-4 mr-2" />
    Panduan Menjadi Host
  </a>
</Button>
```

**Sesudah:**
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline" className="flex-1">
      <BookOpen className="w-4 h-4 mr-2" />
      Panduan Menjadi Host
    </Button>
  </DialogTrigger>
  <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Panduan Menjadi Host</DialogTitle>
    </DialogHeader>
    <div className="prose prose-sm dark:prose-invert">
      {/* Placeholder - konten akan ditambahkan oleh user */}
      <p className="text-muted-foreground">
        Panduan menjadi host akan ditambahkan di sini.
      </p>
    </div>
  </DialogContent>
</Dialog>
```

---

## Tampilan yang Diharapkan

### Tombol (tetap sama)
```text
┌──────────────────────────┐  ┌──────────────────────────┐
│  📖 Panduan Menjadi Host │  │  📖 Panduan Lainnya      │
└──────────────────────────┘  └──────────────────────────┘
```

### Dialog "Panduan Menjadi Host" (saat diklik)
```text
┌─────────────────────────────────────────┐
│  Panduan Menjadi Host               [X] │
├─────────────────────────────────────────┤
│                                         │
│  Panduan menjadi host akan ditambahkan  │
│  di sini.                               │
│                                         │
│  (scrollable jika konten panjang)       │
│                                         │
└─────────────────────────────────────────┘
```

---

## Catatan

- Dialog menggunakan `max-h-[80vh] overflow-y-auto` agar bisa scroll jika konten panjang
- Placeholder text sementara akan diganti dengan panduan lengkap dari user
- Layout dan styling konsisten dengan dialog "Panduan Lainnya"

---

## File yang Diubah

| File | Perubahan |
|------|-----------|
| `src/pages/QuickOrderDetail.tsx` | Ubah tombol link menjadi Dialog dengan placeholder content |

