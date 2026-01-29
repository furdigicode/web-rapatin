
# Rencana: Update Dialog Panduan Lainnya

## Ringkasan

Mengupdate dialog "Panduan Lainnya" dengan link dokumentasi resmi Zoom, menambah panduan Breakout Room, menghapus card placeholder, dan menghilangkan icon di sebelah kiri setiap card.

---

## Perubahan yang Diperlukan

### File: `src/pages/QuickOrderDetail.tsx`

#### 1. Hapus Card "Panduan Mengundang Peserta" (Line 762-775)
Card ini dihapus karena masih menggunakan placeholder link.

#### 2. Update Link Panduan Recording
**Sebelum:** `https://example.com/panduan-2`
**Sesudah:** `https://support.zoom.com/hc/id/article?id=zm_kb&sysparm_article=KB0062631#h_7420acb5-1897-4061-87b4-5b76e99c03b4`

#### 3. Tambah Card Panduan Breakout Room
Link: `https://support.zoom.com/hc/id/article?id=zm_kb&sysparm_article=KB0062544#mcetoc_1icojfikb22`

#### 4. Hapus Card "Panduan Fitur Lainnya" (Line 802-814)
Card ini dihapus karena masih menggunakan placeholder link.

#### 5. Hapus Icon di Semua Card
Menghilangkan elemen `<BookOpen>`, `<Users>`, dan `<ExternalLink>` dari setiap card panduan.

---

## Tampilan Sebelum & Sesudah

### Sebelum:
```
┌─────────────────────────────────────────┐
│ 📖 Panduan Mengundang Peserta        ↗  │  ← Dihapus
│ 📖 Panduan Recording                 ↗  │
│ 👥 Menetapkan Peserta Sebagai Co-Host↗  │
│ 📖 Panduan Fitur Lainnya             ↗  │  ← Dihapus
└─────────────────────────────────────────┘
```

### Sesudah:
```
┌─────────────────────────────────────────┐
│ Panduan Recording                       │
│ Cara merekam meeting Zoom               │
├─────────────────────────────────────────┤
│ Menetapkan Peserta Sebagai Co-Host      │
│ Berbagi hak pengelolaan meeting...      │
├─────────────────────────────────────────┤
│ Panduan Breakout Room                   │
│ Membagi peserta ke dalam ruang diskusi  │
└─────────────────────────────────────────┘
```

---

## Kode Card Baru (Tanpa Icon)

```tsx
{/* Panduan Recording */}
<a
  href="https://support.zoom.com/hc/id/article?id=zm_kb&sysparm_article=KB0062631#h_7420acb5-1897-4061-87b4-5b76e99c03b4"
  target="_blank"
  rel="noopener noreferrer"
  className="flex flex-col gap-1 p-3 rounded-lg border hover:bg-muted transition-colors"
>
  <p className="font-medium">Panduan Recording</p>
  <p className="text-sm text-muted-foreground">Cara merekam meeting Zoom</p>
</a>

{/* Menetapkan Co-Host */}
<a
  href="https://support.zoom.com/hc/id/article?id=zm_kb&sysparm_article=KB0066642#h_9c3ee7f2-b70c-4061-8dcf-00dd836b2075"
  target="_blank"
  rel="noopener noreferrer"
  className="flex flex-col gap-1 p-3 rounded-lg border hover:bg-muted transition-colors"
>
  <p className="font-medium">Menetapkan Peserta Sebagai Co-Host</p>
  <p className="text-sm text-muted-foreground">Berbagi hak pengelolaan meeting dengan peserta lain</p>
</a>

{/* Panduan Breakout Room */}
<a
  href="https://support.zoom.com/hc/id/article?id=zm_kb&sysparm_article=KB0062544#mcetoc_1icojfikb22"
  target="_blank"
  rel="noopener noreferrer"
  className="flex flex-col gap-1 p-3 rounded-lg border hover:bg-muted transition-colors"
>
  <p className="font-medium">Panduan Breakout Room</p>
  <p className="text-sm text-muted-foreground">Membagi peserta ke dalam ruang diskusi terpisah</p>
</a>
```

---

## File yang Diubah

| File | Perubahan |
|------|-----------|
| `src/pages/QuickOrderDetail.tsx` | Hapus 2 card placeholder, update link Recording, tambah Breakout Room, hapus semua icon |
