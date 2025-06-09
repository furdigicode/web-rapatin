
import { HeroContent, FeatureContent, HowItWorksContent } from '@/types/ProductPageTypes';

export const meetingHeroContent: HeroContent = {
  badge: "Aplikasi penjadwalan rapat premium tanpa batas waktu",
  title: "Jadwalkan <span class=\"text-primary\">rapat online</span> tanpa akun Zoom berbayar",
  subtitle: "Bayar hanya untuk yang kamu gunakan, dengan harga fleksibel berdasarkan jumlah peserta. Tanpa langganan bulanan, cukup isi saldo dan jadwalkan.",
  primaryCTA: {
    text: "Mulai Menjadwalkan",
    href: "https://app.rapatin.id/dashboard/register"
  },
  secondaryCTA: {
    text: "Lihat Harga",
    href: "#pricing"
  },
  highlights: [
    { icon: "BadgeDollarSign", text: "Bayar Setiap Rapat" },
    { icon: "Video", text: "Kualitas Video Full HD" },
    { icon: "Calendar", text: "Penjadwalan Mudah" },
    { icon: "Clock", text: "Durasi Tidak Terbatas" }
  ],
  image: {
    src: "/lovable-uploads/e7e34560-7715-4bb4-9fa9-26f74f4090b8.png",
    alt: "Ilustrasi Rapatin"
  }
};

export const meetingFeatureContent: FeatureContent = {
  badge: "Fitur Unggulan",
  title: "Semua yang Anda butuhkan untuk <span class=\"text-primary\">rapat online</span> yang lancar",
  subtitle: "Platform kami menggabungkan fleksibilitas dengan fitur canggih untuk membuat rapat online Anda mudah dan produktif.",
  features: [
    {
      icon: "CreditCard",
      title: "Model Bayar Sesuai Pakai",
      description: "Top up saldo akun Anda dan bayar hanya untuk rapat yang Anda jadwalkan. Tanpa langganan bulanan atau biaya tersembunyi.",
      delay: "delay-0"
    },
    {
      icon: "LayoutDashboard",
      title: "Dashboard Intuitif",
      description: "Buat atau edit jadwal dengan antarmuka modern kami yang dirancang untuk kemudahan penggunaan.",
      delay: "delay-100"
    },
    {
      icon: "CloudLightning",
      title: "Rekaman Cloud",
      description: "Rekaman otomatis disimpan dan tersedia untuk diunduh selama 72 jam melalui dashboard Anda.",
      delay: "delay-200"
    },
    {
      icon: "FileText",
      title: "Laporan Peserta",
      description: "Dapatkan laporan kehadiran otomatis untuk setiap rapat untuk melacak partisipasi.",
      delay: "delay-300"
    },
    {
      icon: "Video",
      title: "Tanpa Akun Zoom Berbayar",
      description: "Jadwalkan rapat tanpa memerlukan akun Zoom berbayar. Berfungsi langsung untuk semua orang.",
      delay: "delay-400"
    },
    {
      icon: "Sparkles",
      title: "Akses Semua Fitur",
      description: "Nikmati akses penuh ke semua fitur premium seperti polling, ruang diskusi, tanya jawab, dan berbagi layar tanpa batasan.",
      delay: "delay-500"
    }
  ],
  useCases: {
    title: "<span class=\"text-primary\">Rapatin </span>Cocok Untuk",
    items: [
      { icon: "GraduationCap", title: "Guru & Dosen" },
      { icon: "Briefcase", title: "Bisnis & Startup" },
      { icon: "Mic", title: "Coach & Trainer" },
      { icon: "Users", title: "Komunitas" },
      { icon: "UserCheck", title: "Konsultan" },
      { icon: "BookOpen", title: "Mahasiswa" },
      { icon: "CalendarCheck", title: "HR & Rekruter" },
      { icon: "PartyPopper", title: "Event Organizer" }
    ]
  }
};

export const meetingHowItWorksContent: HowItWorksContent = {
  badge: "Cara Kerja",
  title: "<span class=\"text-primary\">Tiga langkah sederhana</span> menuju rapat online tanpa batas",
  subtitle: "Mulai menggunakan Rapatin dengan cepat dan nikmati pengalaman rapat online yang lebih baik tanpa kerumitan.",
  steps: [
    {
      number: 1,
      icon: "UserPlus",
      title: "Daftar dan Isi Saldo",
      description: "Buat akun dan isi saldo Anda dengan metode pembayaran yang tersedia."
    },
    {
      number: 2,
      icon: "Calendar",
      title: "Jadwalkan Rapat",
      description: "Buat jadwal rapat Anda dengan detail seperti jumlah peserta dan durasi."
    },
    {
      number: 3,
      icon: "Video",
      title: "Pakai Ruang Rapat",
      description: "Jadi Host rapat untuk melangsungkan rapat dengan fitur lengkap dan tanpa batasan waktu 40 menit."
    }
  ]
};
