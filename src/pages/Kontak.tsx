import React, { useEffect, useState } from 'react';
import SEO from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, MapPin, MessageSquare, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Default contact information
const defaultContactData = {
  email: "halo@rapatin.id",
  phone: "+62 877 8898 0084",
  address: "Desa Tempel, Jatisari, Mijen, Kota Semarang",
  livechat: "Dukungan langsung melalui livechat di aplikasi"
};

const Kontak = () => {
  const {
    toast
  } = useToast();
  const [contactData, setContactData] = useState(defaultContactData);

  // Load contact data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("contactData");
    if (savedData) {
      setContactData(JSON.parse(savedData));
    }
  }, []);
  const openLiveChat = () => {
    // Functionality to open CRISP chat
    if (window.$crisp) {
      window.$crisp.push(['do', 'chat:open']);
    }
  };
  return (
    <div className="min-h-screen">
      <SEO
        title="Hubungi Kami - Customer Service Rapatin 24/7 | Dukungan Meeting"
        description="Butuh bantuan meeting online? Hubungi customer service Rapatin via WhatsApp, email, live chat. Dukungan teknis dan konsultasi 24/7."
        keywords="kontak rapatin, customer service meeting, bantuan zoom, support rapatin whatsapp"
        canonicalUrl="https://rapatin.id/kontak"
        type="website"
      />
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Hubungi Kami</h1>
            <p className="text-lg text-muted-foreground">
              Ada pertanyaan atau masukan? Jangan ragu untuk menghubungi kami.
            </p>
          </div>
          
          {/* Contact Info Cards */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Email Card */}
              <Card className="glass hover:shadow-elevation transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <Mail size={22} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Email</h3>
                  <a href={`mailto:${contactData.email}`} className="text-primary font-medium">
                    {contactData.email}
                  </a>
                </CardContent>
              </Card>
              
              {/* WhatsApp Card */}
              <Card className="glass hover:shadow-elevation transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <MessageCircle size={22} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Whatsapp</h3>
                  <a href={`https://wa.me/${contactData.phone.replace(/\D/g, '')}`} className="text-primary font-medium">
                    {contactData.phone}
                  </a>
                </CardContent>
              </Card>
              
              {/* Office Card */}
              <Card className="glass hover:shadow-elevation transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <MapPin size={22} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Kantor</h3>
                  <address className="not-italic text-primary font-medium whitespace-pre-line">
                    {contactData.address}
                  </address>
                </CardContent>
              </Card>
              
              {/* Live Chat Card */}
              <Card className="glass hover:shadow-elevation transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <MessageSquare size={22} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
                  <p className="text-muted-foreground mb-3">{contactData.livechat}</p>
                  
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Kontak;
