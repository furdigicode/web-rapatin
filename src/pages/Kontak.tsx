
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, MapPin, MessageSquare, Whatsapp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Default contact information
const defaultContactData = {
  email: "halo@rapatin.id",
  phone: "+62 8788 8898 0084",
  address: "Jl. Sudirman No. 123, Jakarta Selatan, 12190, Indonesia",
  officeHours: "Senin - Jumat, 9:00 - 17:00 WIB",
  formTitle: "Kirim Pesan",
  formSubtitle: "Isi formulir di bawah ini untuk menghubungi Kami"
};

const Kontak = () => {
  const { toast } = useToast();
  const [contactData, setContactData] = useState(defaultContactData);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Load contact data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("contactData");
    if (savedData) {
      setContactData(JSON.parse(savedData));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Mohon isi semua field yang wajib diisi",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would typically send the data to a backend API
    // For demo purposes, just show a success message
    toast({
      title: "Pesan Terkirim",
      description: "Terima kasih atas pesan Anda. Kami akan segera menghubungi Anda.",
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

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
                    <a href={`mailto:${contactData.email}`} className="text-primary font-medium">
                      {contactData.email}
                    </a>
                  </CardContent>
                </Card>
                
                <Card className="glass hover:shadow-elevation transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                      <Whatsapp size={22} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Whatsapp</h3>
                    <p className="text-muted-foreground mb-3">{contactData.officeHours}</p>
                    <a href={`https://wa.me/${contactData.phone.replace(/\D/g,'')}`} className="text-primary font-medium">
                      {contactData.phone}
                    </a>
                  </CardContent>
                </Card>
                
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
                        <h3 className="text-xl font-semibold">{contactData.formTitle}</h3>
                        <p className="text-muted-foreground">{contactData.formSubtitle}</p>
                      </div>
                    </div>
                    
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-1">Nama</label>
                          <input 
                            type="text" 
                            id="name" 
                            className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/50" 
                            placeholder="Nama Anda"
                            value={formData.name}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                          <input 
                            type="email" 
                            id="email" 
                            className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/50" 
                            placeholder="email@anda.com"
                            value={formData.email}
                            onChange={handleInputChange}
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
                          value={formData.subject}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-1">Pesan</label>
                        <textarea 
                          id="message" 
                          rows={5}
                          className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/50" 
                          placeholder="Tulis pesan Anda di sini..."
                          value={formData.message}
                          onChange={handleInputChange}
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
