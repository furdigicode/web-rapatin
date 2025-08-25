import { HeroContent, FeatureContent, HowItWorksContent } from '@/types/ProductPageTypes';

export const eventHeroContent: HeroContent = {
  badge: "Event Management System",
  title: "Mulai Jual Event & Webinar Zoom <span class='text-primary'>Tanpa Langganan Lisensi Sendiri</span>",
  subtitle: "Platform lengkap untuk membuat, mengelola, dan memonetisasi event online dengan sistem pembayaran terintegrasi dan reminder otomatis.",
  primaryCTA: {
    text: "Mulai Buat Event",
    href: "#pricing"
  },
  secondaryCTA: {
    text: "Lihat Fitur",
    href: "#features"
  },
  highlights: [
    {
      icon: "Users",
      text: "Unlimited peserta"
    },
    {
      icon: "CreditCard",
      text: "Pembayaran terintegrasi"
    },
    {
      icon: "Bell",
      text: "Reminder otomatis"
    },
    {
      icon: "BarChart3",
      text: "Analitik real-time"
    }
  ],
  image: {
    src: "/lovable-uploads/eacac0dc-069c-493d-9628-07767c87079e.png",
    alt: "Event Management System Dashboard Preview"
  }
};

export const eventFeatureContent: FeatureContent = {
  badge: "Fitur Lengkap",
  title: "Semua yang Anda Butuhkan untuk <span class='text-primary'>Event Sukses</span>",
  subtitle: "Dari pembuatan event hingga analitik pasca-event, kelola semuanya dalam satu platform terintegrasi.",
  features: [
    {
      icon: "Calendar",
      title: "Event Builder",
      description: "Buat event dengan mudah menggunakan form builder yang intuitif. Atur jadwal, lokasi, dan detail event dalam hitungan menit.",
      delay: "0"
    },
    {
      icon: "Globe",
      title: "Halaman Event Publik",
      description: "Halaman landing page otomatis untuk setiap event dengan desain menarik dan informasi lengkap untuk peserta.",
      delay: "100"
    },
    {
      icon: "CreditCard",
      title: "Sistem Pembayaran",
      description: "Terima pembayaran tiket melalui berbagai metode: QRIS, Virtual Account, Credit Card, dan E-Wallet.",
      delay: "200"
    },
    {
      icon: "Users",
      title: "Manajemen Peserta",
      description: "Kelola pendaftaran peserta, kirim tiket digital, dan pantau daftar hadir secara real-time.",
      delay: "300"
    },
    {
      icon: "Bell",
      title: "Reminder Otomatis",
      description: "Sistem pengingat otomatis via email dan WhatsApp untuk memastikan peserta tidak melewatkan event Anda.",
      delay: "400"
    },
    {
      icon: "BarChart3",
      title: "Analitik Event",
      description: "Dashboard analitik lengkap untuk melacak penjualan tiket, kehadiran peserta, dan performa event.",
      delay: "500"
    }
  ],
  useCases: {
    title: "Cocok untuk berbagai jenis event",
    items: [
      {
        icon: "Presentation",
        title: "Webinar & Workshop"
      },
      {
        icon: "GraduationCap",
        title: "Seminar & Training"
      },
      {
        icon: "Music",
        title: "Konser & Pertunjukan"
      },
      {
        icon: "Briefcase",
        title: "Corporate Event"
      },
      {
        icon: "Heart",
        title: "Event Komunitas"
      },
      {
        icon: "Star",
        title: "Exhibition & Expo"
      }
    ]
  }
};

export const eventHowItWorksContent: HowItWorksContent = {
  badge: "Cara Kerja",
  title: "Buat Event dalam <span class='text-primary'>3 Langkah Mudah</span>",
  subtitle: "Proses yang sederhana dan cepat untuk memulai event Anda dari nol hingga go-live.",
  steps: [
    {
      number: 1,
      icon: "Plus",
      title: "Buat Event Baru",
      description: "Isi detail event, tentukan harga tiket, dan atur jadwal. Platform akan membuat halaman event publik secara otomatis."
    },
    {
      number: 2,
      icon: "Share",
      title: "Distribusi & Promosi",
      description: "Bagikan link event ke media sosial atau website. Peserta bisa langsung mendaftar dan melakukan pembayaran."
    },
    {
      number: 3,
      icon: "Play",
      title: "Jalankan Event",
      description: "Pantau kehadiran real-time, kirim reminder otomatis, dan akses analitik lengkap selama dan setelah event."
    }
  ]
};