
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
    <section className="w-full py-10 md:py-16 bg-gradient-to-b from-[#e8f3fa] to-[#f8fcff]">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex flex-col-reverse md:flex-row items-center md:items-start gap-10 md:gap-12">
          {/* Left column: Text, CTA, Stats */}
          <div className="w-full md:w-[50%] flex flex-col items-start md:pt-8">
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#141B23] mb-4 leading-tight text-left">
              Jadwalkan Rapat Zoom <br />
              <span className="text-[#28B7EC]">Tanpa Langganan</span>
            </h1>
            <p className="mb-6 max-w-lg text-base md:text-lg text-gray-500 font-medium text-left">
              Bayar hanya untuk yang kamu gunakan, dengan harga fleksibel berdasarkan jumlah peserta. Bisa pakai per hari. Tanpa langganan bulanan.
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-lg bg-[#28B7EC] hover:bg-[#1595bf] text-white font-semibold px-8 md:px-10 h-12 mb-8 transition-colors duration-200"
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

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-2 w-full max-w-sm">
              {heroStats.map((s, idx) => (
                <div key={idx} className="flex flex-col items-start">
                  <span className="text-2xl md:text-3xl font-bold text-[#28B7EC] mb-1">{s.value}</span>
                  <span className="text-sm text-slate-500 font-medium">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Right column: Dashboard image */}
          <div className="w-full md:w-[58%] flex justify-center">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-white/80 p-2 md:p-4 relative">
              <div className="absolute left-4 top-4 z-10">
                <span className="text-base text-gray-400 font-medium select-none bg-white/70 px-3 py-1 rounded shadow-sm">Rapatin Dashboard</span>
              </div>
              <img
                src="/lovable-uploads/55f2e8b1-7998-47f2-93b3-b06f1b4815c2.png"
                alt="Dashboard Meeting Details Preview"
                className="rounded-lg w-full object-cover object-top border border-[#e9eff3]"
                style={{ minHeight: 320, background: "#F7FBFF" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
