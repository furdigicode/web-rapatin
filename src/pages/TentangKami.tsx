import React from 'react';
import SEO from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionContainer from '@/components/layout/SectionContainer';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Briefcase,
  Lightbulb,
  MessageSquare,
  ShieldCheck,
  Users,
  Heart,
  Handshake,
  Headphones,
  Mail,
  PhoneCall,
  MapPin
} from 'lucide-react';

const TentangKami = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Tentang Kami - Rapatin Platform Meeting Online Terpercaya Indonesia"
        description="Kenali Rapatin, platform meeting online terpercaya Indonesia. Misi kami membuat meeting online mudah, aman, dan terjangkau untuk semua kalangan."
        keywords="tentang rapatin, profil perusahaan, sejarah rapatin, visi misi, tim rapatin, meeting online indonesia"
        url="https://rapatin.id/tentang-kami"
      />
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <SectionContainer className="py-24 bg-primary-gradient text-white text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            Tentang Rapatin
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto animate-fade-in">
            Platform meeting online terpercaya di Indonesia. Kami hadir untuk membuat meeting online mudah, aman, dan terjangkau untuk semua kalangan.
          </p>
        </SectionContainer>

        {/* Visi & Misi */}
        <SectionContainer className="py-16">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="glass p-8 rounded-xl animate-fade-in">
              <h2 className="text-2xl font-semibold mb-4">Visi Kami</h2>
              <p className="text-muted-foreground">
                Menjadi platform meeting online pilihan utama di Indonesia, yang memberdayakan setiap individu dan organisasi untuk terhubung dan berkolaborasi tanpa batas.
              </p>
            </div>
            <div className="glass p-8 rounded-xl animate-fade-in delay-100">
              <h2 className="text-2xl font-semibold mb-4">Misi Kami</h2>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>Menyediakan platform meeting online yang mudah digunakan dan terjangkau.</li>
                <li>Menjamin keamanan dan privasi data pengguna.</li>
                <li>Memberikan fitur-fitur inovatif untuk meningkatkan produktivitas meeting.</li>
                <li>Mendukung kolaborasi tanpa batas bagi semua kalangan.</li>
              </ul>
            </div>
          </div>
        </SectionContainer>

        {/* Nilai-Nilai */}
        <SectionContainer className="py-16 bg-accent/30">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 animate-fade-in">
              Nilai-Nilai Kami
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass p-6 rounded-xl animate-fade-in">
                <Briefcase className="w-6 h-6 text-primary mb-3 mx-auto" />
                <h3 className="text-lg font-semibold mb-2">Profesionalisme</h3>
                <p className="text-muted-foreground">
                  Kami menjunjung tinggi profesionalisme dalam setiap aspek layanan kami.
                </p>
              </div>
              <div className="glass p-6 rounded-xl animate-fade-in delay-100">
                <Lightbulb className="w-6 h-6 text-primary mb-3 mx-auto" />
                <h3 className="text-lg font-semibold mb-2">Inovasi</h3>
                <p className="text-muted-foreground">
                  Kami terus berinovasi untuk memberikan solusi meeting online terbaik.
                </p>
              </div>
              <div className="glass p-6 rounded-xl animate-fade-in delay-200">
                <MessageSquare className="w-6 h-6 text-primary mb-3 mx-auto" />
                <h3 className="text-lg font-semibold mb-2">Komunikasi</h3>
                <p className="text-muted-foreground">
                  Kami mengutamakan komunikasi yang efektif dan transparan.
                </p>
              </div>
              <div className="glass p-6 rounded-xl animate-fade-in">
                <ShieldCheck className="w-6 h-6 text-primary mb-3 mx-auto" />
                <h3 className="text-lg font-semibold mb-2">Keamanan</h3>
                <p className="text-muted-foreground">
                  Kami menjaga keamanan dan privasi data pengguna dengan serius.
                </p>
              </div>
              <div className="glass p-6 rounded-xl animate-fade-in delay-100">
                <Users className="w-6 h-6 text-primary mb-3 mx-auto" />
                <h3 className="text-lg font-semibold mb-2">Kolaborasi</h3>
                <p className="text-muted-foreground">
                  Kami mendukung kolaborasi tanpa batas bagi semua pengguna.
                </p>
              </div>
              <div className="glass p-6 rounded-xl animate-fade-in delay-200">
                <Heart className="w-6 h-6 text-primary mb-3 mx-auto" />
                <h3 className="text-lg font-semibold mb-2">Kepedulian</h3>
                <p className="text-muted-foreground">
                  Kami peduli terhadap kebutuhan dan kepuasan pengguna.
                </p>
              </div>
            </div>
          </div>
        </SectionContainer>

        {/* Tim Kami */}
        <SectionContainer className="py-16">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 animate-fade-in">
              Tim Kami
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-in">
              Tim yang berdedikasi dan berpengalaman di bidang teknologi dan meeting online.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Anggota Tim 1 */}
              <div className="glass p-6 rounded-xl animate-fade-in">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src="https://utfs.io/f/ca545af1-9324-4499-b999-c143c5959b5c-9gjt4i.png" alt="John Doe" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold mb-2">John Doe</h3>
                <p className="text-muted-foreground text-sm mb-3">CEO</p>
                <div className="flex justify-center gap-4">
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><MessageSquare className="w-4 h-4" /></a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Briefcase className="w-4 h-4" /></a>
                </div>
              </div>

              {/* Anggota Tim 2 */}
              <div className="glass p-6 rounded-xl animate-fade-in delay-100">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src="https://utfs.io/f/ca545af1-9324-4499-b999-c143c5959b5c-4vj8ri.png" alt="Jane Smith" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold mb-2">Jane Smith</h3>
                <p className="text-muted-foreground text-sm mb-3">CTO</p>
                <div className="flex justify-center gap-4">
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><MessageSquare className="w-4 h-4" /></a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Briefcase className="w-4 h-4" /></a>
                </div>
              </div>

              {/* Anggota Tim 3 */}
              <div className="glass p-6 rounded-xl animate-fade-in delay-200">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src="https://utfs.io/f/ca545af1-9324-4499-b999-c143c5959b5c-4g3wzk.png" alt="Mike Johnson" />
                  <AvatarFallback>MJ</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold mb-2">Mike Johnson</h3>
                <p className="text-muted-foreground text-sm mb-3">CMO</p>
                <div className="flex justify-center gap-4">
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><MessageSquare className="w-4 h-4" /></a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Briefcase className="w-4 h-4" /></a>
                </div>
              </div>
            </div>
          </div>
        </SectionContainer>

        {/* Mitra Kami */}
        <SectionContainer className="py-16 bg-accent/30">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 animate-fade-in">
              Mitra Kami
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-in">
              Kami bangga bermitra dengan organisasi-organisasi terkemuka di Indonesia.
            </p>
            <div className="grid md:grid-cols-4 gap-8">
              {/* Mitra 1 */}
              <div className="flex items-center justify-center glass p-4 rounded-xl animate-fade-in">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png"
                  alt="Mitra 1"
                  className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>

              {/* Mitra 2 */}
              <div className="flex items-center justify-center glass p-4 rounded-xl animate-fade-in delay-100">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png"
                  alt="Mitra 2"
                  className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>

              {/* Mitra 3 */}
              <div className="flex items-center justify-center glass p-4 rounded-xl animate-fade-in delay-200">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Slack_Mark_Web.png/1024px-Slack_Mark_Web.png"
                  alt="Mitra 3"
                  className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>

              {/* Mitra 4 */}
              <div className="flex items-center justify-center glass p-4 rounded-xl animate-fade-in delay-300">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Zoom_logo.svg/2048px-Zoom_logo.svg.png"
                  alt="Mitra 4"
                  className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </SectionContainer>

        {/* Hubungi Kami */}
        <SectionContainer className="py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 animate-fade-in">
              Hubungi Kami
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-in">
              Kami siap membantu Anda dengan segala pertanyaan dan kebutuhan meeting online Anda.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Kontak 1 */}
              <div className="glass p-6 rounded-xl animate-fade-in">
                <Headphones className="w-6 h-6 text-primary mb-3 mx-auto" />
                <h3 className="text-lg font-semibold mb-2">Customer Support</h3>
                <p className="text-muted-foreground">Senin - Jumat, 09:00 - 17:00</p>
                <Badge variant="outline" className="mt-4">+62 812 3456 7890</Badge>
              </div>

              {/* Kontak 2 */}
              <div className="glass p-6 rounded-xl animate-fade-in delay-100">
                <Mail className="w-6 h-6 text-primary mb-3 mx-auto" />
                <h3 className="text-lg font-semibold mb-2">Email</h3>
                <p className="text-muted-foreground">Balasan dalam 24 jam</p>
                <Badge variant="outline" className="mt-4">support@rapatin.id</Badge>
              </div>

              {/* Kontak 3 */}
              <div className="glass p-6 rounded-xl animate-fade-in delay-200">
                <MapPin className="w-6 h-6 text-primary mb-3 mx-auto" />
                <h3 className="text-lg font-semibold mb-2">Alamat</h3>
                <p className="text-muted-foreground">Jl. Jend. Sudirman Kav. 54-55</p>
                <Badge variant="outline" className="mt-4">Jakarta Selatan</Badge>
              </div>
            </div>
          </div>
        </SectionContainer>
      </main>

      <Footer />
    </div>
  );
};

export default TentangKami;
