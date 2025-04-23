import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const whatsappUrl = `https://wa.me/6287788980084?text=${encodeURIComponent("Halo saya ingin daftar ke Rapatin")}`;

const heroStats = [
  {
    value: "100+",
    label: "Rapat Terjadwal Setiap Hari",
  },
  {
    value: "5.000+",
    label: "Pengguna Aktif",
  },
  {
    value: "99%",
    label: "Tingkat Kepuasan",
  },
  {
    value: "24/7",
    label: "Dukungan Pelanggan",
  },
];

const HeroSection: React.FC = () => {
  return (
    <section
      className="w-full py-16 md:py-20 bg-gradient-to-b from-[#e8f3fa] to-[#f8fcff]"
    >
      <div className="container max-w-7xl mx-auto px-4 flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-center text-[#141B23] mb-4 leading-tight">
          Jadwalkan Rapat Zoom <br />
          <span className="text-[#28B7EC]">Tanpa Langganan</span>
        </h1>
        <p className="mt-2 max-w-xl text-center text-lg md:text-xl text-gray-500 font-medium mb-8">
          Bayar hanya untuk yang kamu gunakan, dengan harga fleksibel berdasarkan jumlah peserta. Bisa pakai per hari. Tanpa langganan bulanan.
        </p>
        <Button
          asChild
          size="lg"
          className="rounded-lg bg-[#28B7EC] hover:bg-[#1595bf] text-white font-semibold px-8 md:px-10 h-12 mb-10 transition-colors duration-200"
        >
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Daftar Sekarang
            <ArrowRight size={18} className="ml-2" />
          </a>
        </Button>
        <div className="w-full flex justify-center">
          <div
            className="relative w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-white/80 p-2 md:p-4 mb-12"
            style={{ minHeight: 360 }}
          >
            <div className="absolute left-1/2 -top-5 -translate-x-1/2 bg-transparent px-4 py-2 h-8 flex items-center justify-center">
              <span className="text-base text-gray-400 font-medium select-none">Rapatin Dashboard</span>
            </div>
            <img
              src="/lovable-uploads/fe367934-5267-49d4-9e82-e5189610c43a.png"
              alt="Dashboard Preview"
              className="rounded-lg w-full object-cover object-top"
              style={{ minHeight: 320, background: "#F7FBFF" }}
            />
          </div>
        </div>
        <div className="w-full max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 mt-0">
          {heroStats.map((s, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-bold text-[#28B7EC] mb-1">{s.value}</span>
              <span className="text-sm text-center text-slate-500 font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
