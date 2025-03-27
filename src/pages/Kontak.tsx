
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Kontak = () => {
  return (
    <div className="min-h-screen">
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
          
          {/* Contact Info & Form */}
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Contact Info Cards */}
              <div className="space-y-4">
                <Card className="glass hover:shadow-elevation transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                      <Mail size={22} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Email</h3>
                    <p className="text-muted-foreground mb-3">Kami akan merespons dalam 24 jam</p>
                    <a href="mailto:hello@rapatin.id" className="text-primary font-medium">hello@rapatin.id</a>
                  </CardContent>
                </Card>
                
                <Card className="glass hover:shadow-elevation transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                      <Phone size={22} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Telepon</h3>
                    <p className="text-muted-foreground mb-3">Senin - Jumat, 9:00 - 17:00 WIB</p>
                    <a href="tel:+6281234567890" className="text-primary font-medium">+62 812 3456 7890</a>
                  </CardContent>
                </Card>
                
                <Card className="glass hover:shadow-elevation transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                      <MapPin size={22} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Kantor</h3>
                    <p className="text-muted-foreground mb-3">Kunjungi kami di:</p>
                    <address className="not-italic text-primary font-medium">
                      Jl. Sudirman No. 123<br />
                      Jakarta Selatan, 12190<br />
                      Indonesia
                    </address>
                  </CardContent>
                </Card>
              </div>
              
              {/* Contact Form */}
              <div className="md:col-span-2">
                <Card className="glass overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 text-primary">
                        <MessageSquare size={22} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">Kirim Pesan</h3>
                        <p className="text-muted-foreground">Isi formulir di bawah ini dan kami akan segera menghubungi Anda</p>
                      </div>
                    </div>
                    
                    <form className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-1">Nama</label>
                          <input 
                            type="text" 
                            id="name" 
                            className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/50" 
                            placeholder="Nama Anda"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                          <input 
                            type="email" 
                            id="email" 
                            className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/50" 
                            placeholder="email@anda.com"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium mb-1">Subjek</label>
                        <input 
                          type="text" 
                          id="subject" 
                          className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/50" 
                          placeholder="Subjek pesan"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-1">Pesan</label>
                        <textarea 
                          id="message" 
                          rows={5}
                          className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/50" 
                          placeholder="Tulis pesan Anda di sini..."
                        ></textarea>
                      </div>
                      
                      <Button type="submit" className="w-full md:w-auto">
                        Kirim Pesan
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Kontak;
