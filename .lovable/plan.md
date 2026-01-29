
# Rencana: Tambah Card Panduan Menetapkan Co-Host

## Ringkasan

Menambahkan card baru di dialog "Panduan Lainnya" untuk panduan menetapkan peserta lain sebagai Co-Host, dengan link ke dokumentasi resmi Zoom.

---

## Perubahan yang Diperlukan

### File: `src/pages/QuickOrderDetail.tsx`

**Lokasi:** Line 786 (setelah card "Panduan Recording")

**Tambahkan card baru:**

```tsx
<a
  href="https://support.zoom.com/hc/id/article?id=zm_kb&sysparm_article=KB0066642#h_9c3ee7f2-b70c-4061-8dcf-00dd836b2075"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
>
  <Users className="w-5 h-5 text-primary" />
  <div>
    <p className="font-medium">Menetapkan Peserta Sebagai Co-Host</p>
    <p className="text-sm text-muted-foreground">Berbagi hak pengelolaan meeting dengan peserta lain</p>
  </div>
  <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground" />
</a>
```

---

## Tampilan yang Diharapkan

```text
┌─────────────────────────────────────────┐
│  Panduan Lainnya                    [X] │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐│
│  │ 📖 Panduan Mengundang Peserta    ↗  ││
│  │    Cara mengundang peserta ke...    ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │ 📖 Panduan Recording             ↗  ││
│  │    Cara merekam meeting Zoom        ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │ 👥 Menetapkan Co-Host            ↗  ││  ← BARU
│  │    Berbagi hak pengelolaan...       ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │ 📖 Panduan Fitur Lainnya         ↗  ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

---

## Informasi dari Zoom Support

Berdasarkan dokumentasi resmi Zoom, cara menetapkan Co-Host:

**Desktop (Windows/macOS/Linux):**
1. Mulai meeting sebagai host
2. Klik icon **Participants** di toolbar
3. Arahkan kursor ke nama peserta yang akan dijadikan co-host
4. Klik **More** → **Make co-host**
5. Klik **Confirm**

**Mobile (Android/iOS):**
1. Mulai meeting sebagai host
2. Tap icon **Participants**
3. Tap nama peserta → **Make co-host**
4. Tap **Yes** untuk konfirmasi

---

## Catatan Teknis

- Menggunakan icon `Users` untuk membedakan dari card lain yang menggunakan `BookOpen`
- Icon `Users` sudah di-import di file ini
- Link mengarah langsung ke section yang relevan (#h_9c3ee7f2-b70c-4061-8dcf-00dd836b2075)

---

## File yang Diubah

| File | Perubahan |
|------|-----------|
| `src/pages/QuickOrderDetail.tsx` | Tambah card baru untuk panduan Co-Host di dialog Panduan Lainnya |
