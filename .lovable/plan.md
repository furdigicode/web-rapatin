
# Rencana: Modal Pilihan Jalur Order (Quick Order vs Aplikasi)

## Ringkasan

Membuat modal/dialog baru yang muncul ketika user mengklik CTA di halaman "Sewa Zoom Harian". Modal ini menampilkan **dua pilihan jalur** dengan kelebihan dan kekurangan masing-masing:

1. **Quick Order** - Cepat dan praktis, tapi terbatas
2. **Via Aplikasi** - Fitur lengkap dengan dashboard

---

## Desain Modal

```text
┌─────────────────────────────────────────────────────────────────────┐
│                                                              [X]    │
│                                                                     │
│              🎯 Pilih Cara Order Anda                               │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐  │
│  │ ⚡ Quick Order               │  │ 📱 Via Aplikasi             │  │
│  │                              │  │                              │  │
│  │  Praktis & Cepat             │  │  Fitur Lengkap               │  │
│  │  Tanpa perlu daftar akun     │  │  Kelola semua di dashboard   │  │
│  │                              │  │                              │  │
│  │  ✓ Bayar langsung            │  │  ✓ Edit jadwal kapan saja    │  │
│  │  ✓ Link Zoom instan          │  │  ✓ Akses rekaman cloud       │  │
│  │  ✓ Tanpa registrasi          │  │  ✓ Laporan peserta           │  │
│  │                              │  │  ✓ Ringkasan rapat (AI)      │  │
│  │  ✗ Tidak bisa edit jadwal    │  │  ✓ Riwayat semua meeting     │  │
│  │  ✗ Tidak ada rekaman         │  │                              │  │
│  │  ✗ Tidak ada laporan         │  │  ✗ Perlu daftar akun         │  │
│  │                              │  │                              │  │
│  │  [  Pilih Quick Order  ]     │  │  [  Daftar & Mulai   ]       │  │
│  │                              │  │                              │  │
│  │  Cocok untuk:                │  │  Cocok untuk:                │  │
│  │  Meeting sekali pakai        │  │  Meeting rutin/berulang      │  │
│  └──────────────────────────────┘  └──────────────────────────────┘  │
│                                                                     │
│  💡 Butuh bantuan memilih? Hubungi kami via WhatsApp               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Detail Konten Modal

### Opsi 1: Quick Order

| Aspek | Detail |
|-------|--------|
| Judul | Quick Order |
| Subtitle | Praktis & Cepat |
| Deskripsi | Tanpa perlu daftar akun |
| Kelebihan | Bayar langsung, Link Zoom instan, Tanpa registrasi |
| Kekurangan | Tidak bisa edit jadwal, Tidak ada akses rekaman, Tidak ada laporan peserta |
| Target | Meeting sekali pakai |
| CTA | "Pilih Quick Order" → navigasi ke /quick-order |

### Opsi 2: Via Aplikasi

| Aspek | Detail |
|-------|--------|
| Judul | Via Aplikasi |
| Subtitle | Fitur Lengkap |
| Deskripsi | Kelola semua di dashboard |
| Kelebihan | Edit jadwal kapan saja, Akses rekaman cloud, Laporan peserta, Ringkasan rapat (AI), Riwayat semua meeting |
| Kekurangan | Perlu daftar akun dulu |
| Target | Meeting rutin/berulang |
| CTA | "Daftar & Mulai" → redirect ke app.rapatin.id/dashboard/register |

---

## Implementasi Teknis

### File yang Dibuat/Diubah

| File | Aksi | Deskripsi |
|------|------|-----------|
| `src/components/ui/order-option-modal.tsx` | Buat | Komponen modal pemilihan jalur order |
| `src/components/meeting/SewaZoomHarianSection.tsx` | Ubah | Ganti FreeTrialModal dengan OrderOptionModal |

---

## Kode Komponen Modal

### `src/components/ui/order-option-modal.tsx`

```tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap, Smartphone, Check, X, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useURLParams, getRedirectUrl } from '@/hooks/useURLParams';

interface OrderOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderOptionModal: React.FC<OrderOptionModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const urlParams = useURLParams();

  const handleQuickOrder = () => {
    // Track with FB Pixel
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'QuickOrderSelected');
    }
    onClose();
    navigate('/quick-order');
  };

  const handleViaApp = () => {
    // Track with FB Pixel
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'AppRegistrationSelected');
    }
    
    // Construct URL with referral code if exists
    let url = 'https://app.rapatin.id/dashboard/register';
    if (urlParams.referralCode && urlParams.referralCode !== 'TRIAL25') {
      url += `?ref=${urlParams.referralCode}`;
    }
    
    window.open(url, '_blank');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl md:text-2xl font-bold flex items-center justify-center gap-2">
            🎯 Pilih Cara Order Anda
          </DialogTitle>
          <DialogDescription>
            Pilih metode yang paling sesuai dengan kebutuhan Anda
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {/* Quick Order Option */}
          <div className="border rounded-xl p-5 hover:border-primary/50 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold">Quick Order</h3>
                <p className="text-xs text-muted-foreground">Praktis & Cepat</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Tanpa perlu daftar akun
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600" />
                <span>Bayar langsung</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600" />
                <span>Link Zoom instan</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600" />
                <span>Tanpa registrasi</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <X className="w-4 h-4 text-red-400" />
                <span>Tidak bisa edit jadwal</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <X className="w-4 h-4 text-red-400" />
                <span>Tidak ada akses rekaman</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <X className="w-4 h-4 text-red-400" />
                <span>Tidak ada laporan peserta</span>
              </div>
            </div>
            
            <Button 
              onClick={handleQuickOrder} 
              variant="outline" 
              className="w-full"
            >
              Pilih Quick Order
            </Button>
            
            <p className="text-xs text-center text-muted-foreground mt-3">
              Cocok untuk meeting sekali pakai
            </p>
          </div>

          {/* Via Aplikasi Option */}
          <div className="border-2 border-primary rounded-xl p-5 relative shadow-md bg-primary/5">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
                Rekomendasi
              </span>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold">Via Aplikasi</h3>
                <p className="text-xs text-muted-foreground">Fitur Lengkap</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Kelola semua di dashboard
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600" />
                <span>Edit jadwal kapan saja</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600" />
                <span>Akses rekaman cloud</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600" />
                <span>Laporan peserta</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600" />
                <span>Ringkasan rapat (AI)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600" />
                <span>Riwayat semua meeting</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <X className="w-4 h-4 text-red-400" />
                <span>Perlu daftar akun</span>
              </div>
            </div>
            
            <Button 
              onClick={handleViaApp} 
              className="w-full bg-primary hover:bg-primary/90"
            >
              Daftar & Mulai
            </Button>
            
            <p className="text-xs text-center text-muted-foreground mt-3">
              Cocok untuk meeting rutin/berulang
            </p>
          </div>
        </div>

        {/* Help Footer */}
        <div className="mt-4 pt-4 border-t text-center">
          <a 
            href="https://wa.me/6287788980084" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Butuh bantuan memilih? Hubungi kami via WhatsApp
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderOptionModal;
```

---

## Perubahan pada SewaZoomHarianSection.tsx

```tsx
// Ganti import
import OrderOptionModal from '@/components/ui/order-option-modal';

// Ganti state name (opsional, untuk kejelasan)
const [orderModalOpen, setOrderModalOpen] = useState(false);

// Ganti handler
const handleRegistration = () => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'CTAClick');
  }
  setOrderModalOpen(true);
};

// Ganti komponen modal di return
<OrderOptionModal
  isOpen={orderModalOpen}
  onClose={() => setOrderModalOpen(false)}
/>
```

---

## Alur User

```text
User di halaman Sewa Zoom Harian
          │
          ▼
    Klik CTA "Buat Jadwal Meeting Sekarang"
          │
          ▼
    Modal Pilihan Muncul
          │
    ┌─────┴─────┐
    ▼           ▼
Quick Order   Via Aplikasi
    │           │
    ▼           ▼
/quick-order   app.rapatin.id/register
```

---

## Tracking Events

| Event | Trigger |
|-------|---------|
| `CTAClick` | User klik tombol CTA |
| `QuickOrderSelected` | User pilih Quick Order |
| `AppRegistrationSelected` | User pilih Via Aplikasi |

---

## Catatan

- Modal selalu muncul (tidak tergantung URL params seperti sebelumnya)
- Opsi "Via Aplikasi" diberi highlight sebagai rekomendasi karena memiliki fitur lebih lengkap
- Link WhatsApp di footer modal untuk user yang butuh bantuan memilih
- Responsive: di mobile kedua opsi ditampilkan vertikal (stacked)
