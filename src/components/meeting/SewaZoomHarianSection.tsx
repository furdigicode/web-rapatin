
import React, { useState } from 'react';
import SectionContainer from '@/components/layout/SectionContainer';
import { Button } from '@/components/ui/button';
import { CheckCircle, Users, Zap, Shield, MessageCircle, GraduationCap, Briefcase, ShoppingBag, Megaphone, ArrowRight } from 'lucide-react';
import OrderOptionModal from '@/components/ui/order-option-modal';

const SewaZoomHarianSection: React.FC = () => {
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  const handleRegistration = () => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'CTAClick');
    }
    setOrderModalOpen(true);
  };

  return (
    <>
      <SectionContainer background="gradient-up" className="py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Sewa Zoom Harian: Solusi Praktis Meeting Online Tanpa Langganan
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Apakah Anda membutuhkan link Zoom hanya untuk satu hari? Atau ingin mengadakan webinar, kelas online, atau rapat penting tanpa harus langganan akun Zoom setiap bulan? Rapatin hadir sebagai solusi terbaik dengan fitur <strong>sewa Zoom harian</strong> yang fleksibel dan terjangkau.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Layanan ini sangat cocok untuk Anda yang mengadakan acara sekali pakai, seperti webinar promosi, kelas intensif, presentasi proyek, hingga kegiatan internal perusahaan. Anda tidak perlu lagi repot membuat akun Zoom baru atau membayar biaya bulanan—cukup pesan link Zoom harian sesuai tanggal dan kebutuhan Anda, dan link akan langsung aktif selama 24 jam penuh.
            </p>
          </div>

          <div className="glass rounded-2xl p-8 mb-12 shadow-elevation border border-white/40">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Kenapa Memilih Rapatin untuk Sewa Zoom Harian?
            </h2>
            <p className="text-muted-foreground mb-8 text-center">
              Berikut beberapa alasan mengapa pengguna memilih Rapatin sebagai platform penyedia link Zoom harian:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Tanpa Langganan Bulanan</h3>
                  <p className="text-muted-foreground text-sm">
                    Anda hanya membayar sesuai pemakaian, cocok untuk bisnis, komunitas, atau freelancer yang tidak butuh Zoom setiap hari.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Users size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Paket Kapasitas Beragam</h3>
                  <p className="text-muted-foreground text-sm">
                    Mulai dari 100 hingga 1000 peserta, kami siap menyesuaikan dengan skala acara Anda.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Zap size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Link Zoom Siap Pakai</h3>
                  <p className="text-muted-foreground text-sm">
                    Setelah pemesanan, sistem akan langsung memproses pembuatan link.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Shield size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Aman dan Stabil</h3>
                  <p className="text-muted-foreground text-sm">
                    Semua akun Zoom yang kami gunakan bersifat legal dan memiliki lisensi resmi, memastikan kestabilan saat acara berlangsung.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 md:col-span-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <MessageCircle size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Bisa Digunakan Bersama Platform Lain</h3>
                  <p className="text-muted-foreground text-sm">
                    Link Zoom dari Rapatin bisa Anda tempel ke produk digital di Lynk.id, Mayar, atau marketplace lainnya.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="glass rounded-xl p-6 shadow-elevation border border-white/40">
              <h2 className="text-xl font-bold mb-4">Berapa Harga Sewa Zoom Harian?</h2>
              <p className="text-muted-foreground mb-4">
                Harga <strong>sewa Zoom harian</strong> di Rapatin mulai dari <strong>Rp20.000</strong> tergantung kapasitas peserta dan durasi event. Anda juga bisa mengisi saldo terlebih dahulu untuk mempermudah pemesanan di kemudian hari, atau langsung bayar per meeting tanpa saldo.
              </p>
              <p className="text-muted-foreground text-sm">
                Kami juga menyediakan fitur penjadwalan otomatis melalui dashboard, yang memudahkan Anda mengatur acara berulang seperti kelas mingguan, pelatihan rutin, atau bimbingan belajar.
              </p>
            </div>

            <div className="glass rounded-xl p-6 shadow-elevation border border-white/40">
              <h2 className="text-xl font-bold mb-4">Cocok untuk Siapa?</h2>
              <p className="text-muted-foreground mb-4">Layanan ini telah digunakan oleh:</p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <GraduationCap size={20} className="text-primary" />
                  <span className="text-sm">Pengajar & tutor online</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Briefcase size={20} className="text-primary" />
                  <span className="text-sm">Perusahaan yang butuh meeting insidental</span>
                </li>
                <li className="flex items-center space-x-3">
                  <ShoppingBag size={20} className="text-primary" />
                  <span className="text-sm">Penjual e-course atau webinar</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Megaphone size={20} className="text-primary" />
                  <span className="text-sm">Event organizer dan komunitas digital</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="glass rounded-2xl p-8 text-center shadow-elevation border border-white/40">
            <h2 className="text-2xl font-bold mb-4">Gunakan Rapatin Sekarang</h2>
            <p className="text-muted-foreground mb-6">
              Ribuan acara telah sukses menggunakan layanan kami. Saatnya Anda merasakan kemudahan <strong>sewa Zoom harian</strong> tanpa repot. Jika Anda ingin booking link Zoom harian untuk hari ini atau besok, cukup masuk ke dashboard, isi form jadwal, dan biarkan sistem kami mengurus semuanya secara otomatis.
            </p>
            <Button size="lg" className="rounded-lg bg-primary hover:bg-primary/90 text-white" onClick={handleRegistration}>
              Buat Jadwal Meeting Sekarang
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </SectionContainer>

      <OrderOptionModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
      />
    </>
  );
};

export default SewaZoomHarianSection;
