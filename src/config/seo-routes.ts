// Sumber tunggal metadata SEO untuk halaman marketing statis.
// Dipakai oleh komponen <SEO> (client-side) dan oleh scripts/prerender-meta.mjs
// yang menuliskan meta ini ke HTML mentah saat build.

export const SITE_URL = "https://rapatin.id";
export const DEFAULT_OG_IMAGE =
  "https://rapatin.id/lovable-uploads/b85c0fd2-b1c7-4ba8-8938-bf1ac3bdeb28.png";

export interface SeoRoute {
  /** Path rute, harus sama persis dengan yang ada di src/App.tsx */
  path: string;
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  type?: string;
}

export const SEO_ROUTES: SeoRoute[] = [
  {
    path: "/",
    title: "Rapatin - Platform Meeting Online Terlengkap Indonesia",
    description:
      "Platform lengkap untuk meeting, event, dan appointment booking. Bayar sesuai penggunaan dengan harga fleksibel. Zoom scheduling, event management, dan appointment booking dalam satu platform.",
    keywords:
      "meeting online, zoom scheduling, event management, appointment booking, platform meeting indonesia, bayar sesuai pakai, jadwal rapat",
  },
  {
    path: "/sewa-zoom-harian",
    title: "Sewa Zoom Harian - Link Zoom Tanpa Langganan Bulanan | Rapatin",
    description:
      "Sewa zoom harian mulai Rp 20.000. Link zoom siap pakai tanpa langganan bulanan. Cocok untuk webinar, kelas online, rapat penting. Kapasitas 100-1000 peserta.",
    keywords:
      "sewa zoom harian, link zoom harian, zoom tanpa langganan, booking zoom harian, rental zoom meeting, webinar tanpa langganan, kelas online zoom, rapat zoom harian, sewa akun zoom",
  },
  {
    path: "/fitur/bayar-sesuai-pakai",
    title: "Bayar Sesuai Pakai - Model Pricing Fleksibel Rapatin | Tanpa Langganan",
    description:
      "Top up saldo dan bayar hanya untuk rapat yang dijadwalkan. Tanpa langganan bulanan, harga transparan berdasarkan peserta dan durasi.",
    keywords:
      "bayar sesuai pakai, zoom tanpa langganan, pricing fleksibel meeting, top up saldo rapat",
  },
  {
    path: "/fitur/dashboard",
    title: "Dashboard Meeting Online - Interface Modern Rapatin | Kelola Rapat Mudah",
    description:
      "Dashboard intuitif untuk penjadwalan, kustomisasi, akses rekaman, dan laporan rapat. Antarmuka modern untuk kemudahan penggunaan.",
    keywords:
      "dashboard meeting, interface zoom, kelola jadwal rapat, laporan meeting online",
  },
  {
    path: "/fitur/rekaman-cloud",
    title: "Rekaman Cloud Otomatis - Simpan & Unduh Rekaman Meeting | Rapatin",
    description:
      "Rekaman rapat otomatis disimpan di cloud selama 72 jam. Notifikasi email, unduh kapan saja, keamanan terjamin dengan enkripsi.",
    keywords:
      "rekaman cloud, recording meeting otomatis, unduh rekaman zoom, cloud storage rapat",
  },
  {
    path: "/fitur/laporan-peserta",
    title: "Laporan Peserta Meeting - Tracking Kehadiran Otomatis | Rapatin",
    description:
      "Laporan kehadiran otomatis dengan data partisipasi lengkap. Ekspor ke CSV/PDF, visualisasi data, filter berdasarkan tanggal dan durasi.",
    keywords:
      "laporan peserta meeting, tracking kehadiran rapat, attendance report zoom, analisis partisipasi",
  },
];

export const canonicalFor = (path: string) =>
  path === "/" ? SITE_URL : `${SITE_URL}${path}`;

export const getSeoRoute = (path: string): SeoRoute | undefined =>
  SEO_ROUTES.find((route) => route.path === path);
