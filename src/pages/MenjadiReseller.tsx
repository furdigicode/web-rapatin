import React from "react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";

export default function MenjadiReseller() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h1 className="mb-8 text-center text-3xl font-bold md:text-4xl">Menjadi Reseller Rapatin</h1>
        
        <div className="mx-auto max-w-3xl space-y-8">
          <section className="rounded-lg bg-slate-50 p-6">
            <h2 className="mb-4 text-2xl font-semibold">Mengapa Menjadi Reseller Rapatin?</h2>
            <div className="space-y-4">
              <p>
                Rapatin menawarkan peluang bisnis yang menarik bagi mereka yang ingin mendapatkan penghasilan tambahan dengan modal minimal. Sebagai reseller Rapatin, Anda akan mendapatkan keuntungan dari setiap penjualan link Zoom tanpa perlu mengelola infrastruktur atau memberikan dukungan teknis.
              </p>
              <p>
                Kami menyediakan semua yang Anda butuhkan untuk memulai, termasuk materi pemasaran, panduan penjualan, dan dukungan berkelanjutan untuk membantu Anda sukses.
              </p>
            </div>
          </section>
          
          <section className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-2xl font-semibold">Keuntungan Menjadi Reseller</h2>
            <ul className="ml-6 list-disc space-y-2">
              <li>Komisi menarik hingga 25% dari setiap penjualan</li>
              <li>Sistem penjualan yang sederhana dan mudah dikelola</li>
              <li>Tanpa biaya pendaftaran atau investasi awal yang besar</li>
              <li>Produk berkualitas dengan permintaan pasar yang tinggi</li>
              <li>Dukungan tim Rapatin yang responsif</li>
              <li>Materi pemasaran yang siap pakai</li>
              <li>Pelatihan dan pendampingan untuk memaksimalkan penjualan</li>
            </ul>
          </section>
          
          <section className="rounded-lg bg-slate-50 p-6">
            <h2 className="mb-4 text-2xl font-semibold">Siapa Yang Dapat Menjadi Reseller?</h2>
            <p className="mb-4">
              Kami menerima siapa saja yang memiliki semangat untuk berjualan dan mengembangkan bisnis, termasuk:
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-md bg-white p-4 shadow-sm">
                <h3 className="mb-2 font-medium">Pemilik Bisnis</h3>
                <p className="text-sm text-muted-foreground">
                  Pemilik bisnis yang ingin menambahkan produk digital ke portofolio mereka
                </p>
              </div>
              <div className="rounded-md bg-white p-4 shadow-sm">
                <h3 className="mb-2 font-medium">Pebisnis Online</h3>
                <p className="text-sm text-muted-foreground">
                  Pelaku e-commerce atau penjual online yang ingin diversifikasi produk
                </p>
              </div>
              <div className="rounded-md bg-white p-4 shadow-sm">
                <h3 className="mb-2 font-medium">Mahasiswa</h3>
                <p className="text-sm text-muted-foreground">
                  Mahasiswa yang mencari penghasilan tambahan dengan jadwal fleksibel
                </p>
              </div>
              <div className="rounded-md bg-white p-4 shadow-sm">
                <h3 className="mb-2 font-medium">Profesional</h3>
                <p className="text-sm text-muted-foreground">
                  Profesional yang ingin membangun bisnis sampingan
                </p>
              </div>
            </div>
          </section>
          
          <section className="rounded-lg border bg-primary/5 p-6 text-center">
            <h2 className="mb-4 text-2xl font-semibold">Tertarik Menjadi Reseller Rapatin?</h2>
            <p className="mb-6">
              Isi formulir pendaftaran sekarang dan tim kami akan menghubungi Anda dalam 1-2 hari kerja untuk tahap selanjutnya.
            </p>
            <Link to="/menjadi-reseller/daftar">
              <Button size="lg" className="px-8">
                Daftar Sekarang
              </Button>
            </Link>
          </section>
          
          <section className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-2xl font-semibold">Pertanyaan Umum</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Apakah ada biaya pendaftaran?</h3>
                <p className="text-muted-foreground">
                  Tidak, pendaftaran sebagai reseller Rapatin sepenuhnya gratis.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Berapa komisi yang akan saya dapatkan?</h3>
                <p className="text-muted-foreground">
                  Komisi reseller berkisar antara 15-25% tergantung volume penjualan.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Bagaimana sistem pembayaran komisi?</h3>
                <p className="text-muted-foreground">
                  Pembayaran komisi dilakukan setiap bulan melalui transfer bank.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Apakah saya perlu memiliki pengalaman teknis?</h3>
                <p className="text-muted-foreground">
                  Tidak, semua dukungan teknis akan ditangani oleh tim Rapatin.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
