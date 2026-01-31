

# Rencana: Perbaiki Layout Mobile - Hapus Padding yang Tidak Perlu

## Masalah

Berdasarkan screenshot yang diberikan, ada whitespace di sisi kanan halaman Quick Order pada tampilan mobile. Masalah ini disebabkan oleh style default Vite di `src/App.css`:

```css
#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;  /* ← Ini menyebabkan whitespace */
  text-align: center;
}
```

`padding: 2rem` menambahkan 32px padding di semua sisi (termasuk kiri dan kanan), yang menyebabkan konten tidak memenuhi lebar layar sepenuhnya.

---

## Solusi

Hapus semua style dari `src/App.css` karena ini adalah sisa dari template default Vite yang tidak diperlukan lagi. Aplikasi Rapatin menggunakan Tailwind CSS dan container classes untuk mengatur layout.

---

## Perubahan Detail

**File:** `src/App.css`

### Sebelum:
```css
#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
/* ... dst */
```

### Sesudah:
```css
/* File dikosongkan - semua styling menggunakan Tailwind CSS */
```

Atau bisa juga menghapus file ini sepenuhnya, tapi untuk keamanan cukup kosongkan isinya.

---

## Dampak Perubahan

| Sebelum | Sesudah |
|---------|---------|
| Padding 32px di kiri-kanan semua halaman | Konten memenuhi lebar layar |
| Whitespace terlihat di mobile | Layout mobile terlihat rapi |
| `max-width: 1280px` membatasi lebar | Container menggunakan class Tailwind |

---

## Preview Visual

```text
SEBELUM:                          SESUDAH:
┌─────────────────────┐          ┌─────────────────────┐
│  ┌───────────────┐  │          │ ┌─────────────────┐ │
│  │   Content     │  │    →     │ │     Content     │ │
│  │               │  │          │ │                 │ │
│  └───────────────┘  │          │ └─────────────────┘ │
│    ↑ padding 2rem   │          │   No extra padding  │
└─────────────────────┘          └─────────────────────┘
```

---

## Ringkasan Perubahan

| File | Aksi | Deskripsi |
|------|------|-----------|
| `src/App.css` | Ubah | Kosongkan/hapus semua style default Vite |

Perubahan ini akan memperbaiki layout mobile pada halaman Quick Order dan semua halaman lainnya.

