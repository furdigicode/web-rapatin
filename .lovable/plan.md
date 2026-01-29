

# Rencana: Tambah Host Key dengan Tampilan Tersembunyi

## Ringkasan

Menambahkan informasi "Host Key" dengan nilai `070707` di kartu Detail Zoom, tepat di bawah "Link Meeting" dan sebelum "Invitation". Nilai akan tersembunyi secara default (ditampilkan sebagai `******`) dan bisa ditampilkan dengan tombol toggle.

---

## Perubahan yang Diperlukan

### 1. Tambah Import Icon

**File:** `src/pages/QuickOrderDetail.tsx`

Tambah icon `Eye` dan `EyeOff` dari lucide-react untuk toggle visibility:

```typescript
import { 
  // ... existing imports
  Eye,
  EyeOff
} from "lucide-react";
```

### 2. Tambah State untuk Toggle Visibility

Di dalam komponen, tambahkan state:

```typescript
const [showHostKey, setShowHostKey] = useState(false);
```

### 3. Tambah UI Host Key

**Lokasi:** Setelah "Link Meeting" (line 664), sebelum "Invitation" (line 666)

```tsx
{/* Host Key */}
<div>
  <span className="text-sm text-muted-foreground block mb-1">Host Key</span>
  <div className="flex items-center gap-2">
    <code className="flex-1 bg-muted p-3 rounded-lg text-sm font-mono">
      {showHostKey ? "070707" : "••••••"}
    </code>
    <Button
      size="icon"
      variant="outline"
      onClick={() => setShowHostKey(!showHostKey)}
      title={showHostKey ? "Sembunyikan" : "Tampilkan"}
    >
      {showHostKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </Button>
    <Button
      size="icon"
      variant="outline"
      onClick={() => copyToClipboard("070707", "Host Key")}
    >
      <Copy className="w-4 h-4" />
    </Button>
  </div>
</div>
```

---

## Tampilan yang Diharapkan

### State Default (tersembunyi)
```text
Host Key
┌────────────────────────────────┐  ┌───┐  ┌───┐
│  ••••••                        │  │ 👁 │  │📋│
└────────────────────────────────┘  └───┘  └───┘
```

### Setelah Klik Toggle (terlihat)
```text
Host Key
┌────────────────────────────────┐  ┌────┐  ┌───┐
│  070707                        │  │ 👁‍🗨 │  │📋│
└────────────────────────────────┘  └────┘  └───┘
```

---

## Urutan Field di Detail Zoom

1. Meeting ID
2. Passcode
3. Link Meeting
4. **Host Key** ← Baru
5. Invitation
6. Tombol Panduan

---

## File yang Diubah

| File | Perubahan |
|------|-----------|
| `src/pages/QuickOrderDetail.tsx` | Tambah import Eye/EyeOff, state showHostKey, dan UI Host Key |

