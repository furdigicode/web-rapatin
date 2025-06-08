import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Calendar, DollarSign, Proportions, CreditCard, Users, BarChart, MessageSquare, Settings, Play, Download, CheckCircle, User, FileText, Clock, ClipboardList, Bell, Smartphone, UserCheck, Zap, Shield, MonitorPlay } from 'lucide-react';
import ComingSoonModal from "@/components/ui/coming-soon-modal";

const MeetingSchedulingMockup = () => (
  <div className="glass rounded-xl overflow-hidden shadow-elevation border border-white/40 mx-auto max-w-lg">
    <div className="p-8 space-y-6 bg-white/90">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-medium text-base">Jadwalkan Meeting Baru</h4>
        <div className="flex items-center text-sm text-primary">
          <Video size={14} className="mr-1" />
          <span>Zoom Ready</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="border border-gray-100 rounded-lg p-4 bg-white shadow-sm">
          <div className="text-sm font-medium mb-3">Meeting Details</div>
          <div className="space-y-3">
            <input className="w-full text-sm p-3 border border-gray-200 rounded" placeholder="Judul Meeting" value="Rapat Tim Marketing" readOnly />
            <div className="grid grid-cols-2 gap-3">
              <input className="text-sm p-3 border border-gray-200 rounded" placeholder="Tanggal" value="27 Jan 2025" readOnly />
              <input className="text-sm p-3 border border-gray-200 rounded" placeholder="Waktu" value="14:00 WIB" readOnly />
            </div>
          </div>
        </div>
        
        <div className="border border-gray-100 rounded-lg p-4 bg-white shadow-sm">
          <div className="text-sm font-medium mb-3">Peserta (300)</div>
          <div className="flex -space-x-2 mb-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-8 h-8 bg-primary/20 rounded-full border-2 border-white flex items-center justify-center">
                <User size={12} className="text-primary" />
              </div>
            ))}
            <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-sm">+</div>
          </div>
          <div className="text-xs text-gray-500 mb-2">Tim dari berbagai departemen akan bergabung</div>
        </div>
        
        <div className="border border-gray-100 rounded-lg p-4 bg-white shadow-sm">
          <div className="text-sm font-medium mb-3">Meeting Settings</div>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center justify-between">
              <span>Rekaman Otomatis</span>
              <div className="w-6 h-3 bg-primary rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <span>Waiting Room</span>
              <div className="w-6 h-3 bg-gray-300 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <span>Chat Enabled</span>
              <div className="w-6 h-3 bg-primary rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button className="flex-1 bg-primary text-white text-sm px-4 py-3 rounded-lg flex items-center justify-center">
            <Calendar size={14} className="mr-2" />
            Buat Meeting
          </button>
          <button className="bg-gray-100 text-gray-700 text-sm px-4 py-3 rounded-lg flex items-center justify-center">
            <Clock size={14} className="mr-2" />
            Draft
          </button>
        </div>
      </div>
    </div>
  </div>
);

const EventManagementMockup = () => (
  <div className="glass rounded-xl overflow-hidden shadow-elevation border border-white/40 mx-auto max-w-lg">
    <div className="p-8 space-y-6 bg-white/90">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-medium text-base">Event Dashboard</h4>
        <div className="flex items-center text-sm text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
          <span>3 Live Events</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="border border-gray-100 rounded-lg p-4 bg-white shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="font-medium text-sm">Webinar Marketing Digital</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Live</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs text-gray-500 mb-4">
            <div className="text-center">
              <div className="font-bold text-primary text-lg">1,245</div>
              <div>Terdaftar</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-primary text-lg">892</div>
              <div>Hadir</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-primary text-lg">72%</div>
              <div>Attendance</div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="flex-1 bg-primary text-white text-xs px-3 py-2 rounded">
              <BarChart size={10} className="inline mr-1" />
              Analytics
            </button>
            <button className="bg-gray-100 text-gray-700 text-xs px-3 py-2 rounded">
              <Settings size={10} className="inline mr-1" />
              Manage
            </button>
          </div>
        </div>
        
        <div className="border border-gray-100 rounded-lg p-4 bg-white shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="font-medium text-sm">Workshop Design Thinking</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Upcoming</span>
          </div>
          <div className="text-xs text-gray-500 mb-3">15 Feb 2025 • 500 slots tersisa</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div className="bg-primary h-2 rounded-full" style={{width: '60%'}}></div>
          </div>
          <div className="text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Pendaftar: 1,500</span>
              <span>Target: 2,000</span>
            </div>
          </div>
        </div>

        <div className="border border-gray-100 rounded-lg p-4 bg-white shadow-sm">
          <div className="text-sm font-medium mb-3">Event Statistics</div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-blue-50 p-2 rounded">
              <div className="font-bold text-blue-600">IDR 2.4M</div>
              <div className="text-gray-600">Revenue</div>
            </div>
            <div className="bg-green-50 p-2 rounded">
              <div className="font-bold text-green-600">4.8/5</div>
              <div className="text-gray-600">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AppointmentBookingMockup = () => (
  <div className="glass rounded-xl overflow-hidden shadow-elevation border border-white/40 mx-auto max-w-lg">
    <div className="p-8 space-y-6 bg-white/90">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-medium text-base">Appointment Booking</h4>
        <div className="flex items-center text-sm text-primary">
          <CreditCard size={14} className="mr-1" />
          <span>Payment Ready</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="border border-gray-100 rounded-lg p-4 bg-white shadow-sm">
          <div className="text-sm font-medium mb-4">Available Slots Today</div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {['09:00', '10:30', '14:00', '15:30', '16:00'].map((time, idx) => (
              <button key={time} className={`text-sm p-3 rounded ${idx === 2 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}>
                {time}
              </button>
            ))}
            <div className="text-sm p-3 text-center text-gray-400 border border-dashed border-gray-300 rounded">+12 more</div>
          </div>
        </div>
        
        <div className="border border-gray-100 rounded-lg p-4 bg-white shadow-sm">
          <div className="text-sm font-medium mb-3">Next Appointments</div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <div className="text-sm font-medium">Konsultasi Bisnis</div>
                <div className="text-xs text-gray-500">Sarah Johnson • 1 jam</div>
              </div>
              <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded flex items-center">
                <DollarSign size={10} className="mr-1" />
                Paid
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <div className="text-sm font-medium">Coaching Session</div>
                <div className="text-xs text-gray-500">Mike Chen • 30 min</div>
              </div>
              <div className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                Pending
              </div>
            </div>
          </div>
        </div>
        
        <div className="border border-gray-100 rounded-lg p-4 bg-white shadow-sm">
          <div className="text-sm font-medium mb-3">Today's Summary</div>
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div>
              <div className="font-bold text-primary text-lg">8</div>
              <div className="text-gray-600">Booked</div>
            </div>
            <div>
              <div className="font-bold text-green-600 text-lg">6</div>
              <div className="text-gray-600">Completed</div>
            </div>
            <div>
              <div className="font-bold text-orange-600 text-lg">2</div>
              <div className="text-gray-600">Pending</div>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button className="flex-1 bg-primary text-white text-sm px-4 py-3 rounded-lg flex items-center justify-center">
            <Calendar size={14} className="mr-2" />
            Book Now
          </button>
          <button className="bg-gray-100 text-gray-700 text-sm px-4 py-3 rounded-lg flex items-center justify-center">
            <FileText size={14} className="mr-2" />
            Reports
          </button>
        </div>
      </div>
    </div>
  </div>
);

const ProductShowcase: React.FC = () => {
  const [comingSoonModal, setComingSoonModal] = useState<{
    isOpen: boolean;
    productName: string;
  }>({
    isOpen: false,
    productName: '',
  });

  const handleComingSoon = (productName: string) => {
    setComingSoonModal({
      isOpen: true,
      productName,
    });
  };

  const closeModal = () => {
    setComingSoonModal({
      isOpen: false,
      productName: '',
    });
  };

  const products = [
    {
      id: 'meeting',
      title: 'Meeting Scheduling',
      subtitle: 'Jadwalkan meeting dengan infrastruktur Zoom yang mudah',
      description: 'Platform meeting scheduling yang terintegrasi dengan Zoom untuk meeting profesional tanpa perlu akun berbayar.',
      mockup: <MeetingSchedulingMockup />,
      url: 'https://rapatin.id/meeting-scheduling',
      isAvailable: true,
      features: [
        { icon: Video, text: 'Unlock semua fitur Zoom Professional', description: 'Akses fitur premium Zoom tanpa langganan sendiri - recording cloud, breakout rooms, dan fitur enterprise lainnya' },
        { icon: MonitorPlay, text: 'Kualitas video Full HD 1080p dengan audio jernih', description: 'Video berkualitas tinggi dengan teknologi noise reduction untuk meeting profesional yang sempurna' },
        { icon: Calendar, text: 'Interface scheduling yang intuitif dan mudah', description: 'Atur jadwal meeting dalam hitungan detik dengan kalender terintegrasi dan timezone otomatis' },
        { icon: DollarSign, text: 'Hemat hingga 70% biaya langganan Zoom', description: 'Nikmati fitur premium Zoom tanpa perlu berlangganan - cukup bayar per penggunaan sesuai kebutuhan' },
        { icon: Shield, text: 'Keamanan tingkat enterprise dengan enkripsi end-to-end', description: 'Proteksi data meeting dengan standar keamanan bank dan compliance GDPR untuk privasi terjamin' }
      ]
    },
    {
      id: 'event',
      title: 'Event Management System',
      subtitle: 'Kelola event besar dengan sistem yang powerful',
      description: 'Sistem manajemen event lengkap untuk webinar, workshop, dan acara virtual dengan kapasitas besar.',
      mockup: <EventManagementMockup />,
      url: '/event-management',
      isAvailable: false,
      features: [
        { icon: Users, text: 'Hingga 10.000 peserta per event', description: 'Cocok untuk webinar, kelas online, dan seminar berskala besar dengan infrastruktur cloud yang stabil' },
        { icon: ClipboardList, text: 'Formulir pendaftaran fleksibel', description: 'Kumpulkan data peserta sesuai kebutuhan Anda - custom fields, validasi otomatis, dan integrasi database' },
        { icon: Zap, text: 'Pembayaran otomatis & notifikasi real-time', description: 'Terima pembayaran langsung dengan gateway terintegrasi, tanpa perlu cek manual dan konfirmasi otomatis' },
        { icon: Smartphone, text: 'Distribusi link Zoom otomatis + pengingat WhatsApp', description: 'Undangan dan reminder terkirim otomatis via email dan WhatsApp tanpa repot, tingkatkan attendance rate' },
        { icon: UserCheck, text: 'Pelacakan kehadiran peserta secara otomatis', description: 'Rekam kehadiran dan pantau aktivitas peserta dengan mudah - laporan real-time dan analytics mendalam' }
      ]
    },
    {
      id: 'appointment',
      title: 'Appointment Bookings',
      subtitle: 'Sistem booking appointment dengan payment otomatis',
      description: 'Platform appointment booking untuk konsultasi, coaching, atau layanan profesional dengan sistem pembayaran terintegrasi.',
      mockup: <AppointmentBookingMockup />,
      url: '/appointment',
      isAvailable: false,
      features: [
        { icon: Clock, text: 'Jadwal personal one-on-one yang fleksibel', description: 'Atur waktu konsultasi sesuai kebutuhan klien dengan buffer time otomatis dan zona waktu yang akurat' },
        { icon: Calendar, text: 'Integrasi kalender real-time multi-platform', description: 'Sinkronisasi otomatis dengan Google Calendar, Outlook, dan Apple Calendar - hindari double booking selamanya' },
        { icon: Users, text: 'Sistem manajemen klien lengkap dengan history', description: 'Kelola data klien, riwayat appointment, notes pribadi, dan follow-up dalam satu dashboard terintegrasi' },
        { icon: CreditCard, text: 'Payment gateway otomatis multi-metode', description: 'Terima pembayaran langsung via transfer bank, e-wallet, kartu kredit dengan fee transparan dan settlement cepat' },
        { icon: Bell, text: 'Reminder otomatis via WhatsApp, SMS & Email', description: 'Kurangi no-show hingga 80% dengan sistem pengingat cerdas H-1, H-3, dan 30 menit sebelum appointment' }
      ]
    }
  ];

  return (
    <>
      <section id="product-showcase" className="py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-20 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tiga Produk Utama dalam <span className="text-primary">Satu Platform</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Semua kebutuhan penjadwalan Anda tersedia dalam satu platform yang mudah digunakan
            </p>
          </div>
          
          <div className="space-y-40">
            {products.map((product, index) => (
              <div key={product.id} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 animate-fade-in`} style={{animationDelay: `${index * 0.2}s`}}>
                <div className="lg:w-1/2 relative">
                  {product.mockup}
                  <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full rounded-xl bg-primary/10"></div>
                </div>
                <div className="lg:w-1/2 space-y-6">
                  <div>
                    <h3 className="text-3xl font-bold mb-2">{product.title}</h3>
                    <p className="text-xl text-primary mb-4">{product.subtitle}</p>
                    <p className="text-muted-foreground text-lg leading-relaxed">{product.description}</p>
                  </div>
                  
                  <div className="space-y-4">
                    {product.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                          <feature.icon size={16} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold mb-1">{feature.text}</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    {product.isAvailable ? (
                      <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                        <a href={product.url}>Pelajari selengkapnya</a>
                      </Button>
                    ) : (
                      <Button 
                        size="lg" 
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => handleComingSoon(product.title)}
                      >
                        Daftar Waiting List
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ComingSoonModal
        isOpen={comingSoonModal.isOpen}
        onClose={closeModal}
        productName={comingSoonModal.productName}
      />
    </>
  );
};

export default ProductShowcase;
