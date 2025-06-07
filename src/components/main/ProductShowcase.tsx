import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Calendar, DollarSign, Proportions, CreditCard, Users, BarChart, MessageSquare, Settings, Play, Download, CheckCircle, User, FileText, Clock, ClipboardList, Bell, Smartphone, UserCheck, Zap, Shield, MonitorPlay } from 'lucide-react';

const MeetingSchedulingMockup = () => (
  <div className="glass rounded-xl overflow-hidden shadow-elevation border border-white/40 mx-auto max-w-md">
    <div className="p-6 space-y-4 bg-white/90">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium text-sm">Jadwalkan Meeting Baru</h4>
        <div className="flex items-center text-xs text-primary">
          <Video size={12} className="mr-1" />
          <span>Zoom Ready</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="border border-gray-100 rounded-lg p-3 bg-white shadow-sm">
          <div className="text-sm font-medium mb-2">Meeting Details</div>
          <div className="space-y-2">
            <input className="w-full text-xs p-2 border border-gray-200 rounded" placeholder="Judul Meeting" value="Rapat Tim Marketing" readOnly />
            <div className="grid grid-cols-2 gap-2">
              <input className="text-xs p-2 border border-gray-200 rounded" placeholder="Tanggal" value="27 Jan 2025" readOnly />
              <input className="text-xs p-2 border border-gray-200 rounded" placeholder="Waktu" value="14:00 WIB" readOnly />
            </div>
          </div>
        </div>
        
        <div className="border border-gray-100 rounded-lg p-3 bg-white shadow-sm">
          <div className="text-sm font-medium mb-2">Peserta (300)</div>
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-6 h-6 bg-primary/20 rounded-full border-2 border-white flex items-center justify-center">
                <User size={10} className="text-primary" />
              </div>
            ))}
            <div className="w-6 h-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs">+</div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button className="flex-1 bg-primary text-white text-xs px-3 py-2 rounded-lg flex items-center justify-center">
            <Calendar size={12} className="mr-1" />
            Buat Meeting
          </button>
          <button className="bg-gray-100 text-gray-700 text-xs px-3 py-2 rounded-lg flex items-center justify-center">
            <Clock size={12} className="mr-1" />
            Draft
          </button>
        </div>
      </div>
    </div>
  </div>
);

const EventManagementMockup = () => (
  <div className="glass rounded-xl overflow-hidden shadow-elevation border border-white/40 mx-auto max-w-md">
    <div className="p-6 space-y-4 bg-white/90">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium text-sm">Event Dashboard</h4>
        <div className="flex items-center text-xs text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
          <span>3 Live Events</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="border border-gray-100 rounded-lg p-3 bg-white shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="font-medium text-sm">Webinar Marketing Digital</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Live</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mb-3">
            <div className="text-center">
              <div className="font-bold text-primary">1,245</div>
              <div>Terdaftar</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-primary">892</div>
              <div>Hadir</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-primary">72%</div>
              <div>Attendance</div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="flex-1 bg-primary text-white text-xs px-2 py-1 rounded">
              <BarChart size={10} className="inline mr-1" />
              Analytics
            </button>
            <button className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
              <Settings size={10} className="inline mr-1" />
              Manage
            </button>
          </div>
        </div>
        
        <div className="border border-gray-100 rounded-lg p-3 bg-white shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="font-medium text-sm">Workshop Design Thinking</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Upcoming</span>
          </div>
          <div className="text-xs text-gray-500 mb-2">15 Feb 2025 • 500 slots tersisa</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{width: '60%'}}></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AppointmentBookingMockup = () => (
  <div className="glass rounded-xl overflow-hidden shadow-elevation border border-white/40 mx-auto max-w-md">
    <div className="p-6 space-y-4 bg-white/90">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium text-sm">Appointment Booking</h4>
        <div className="flex items-center text-xs text-primary">
          <CreditCard size={12} className="mr-1" />
          <span>Payment Ready</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="border border-gray-100 rounded-lg p-3 bg-white shadow-sm">
          <div className="text-sm font-medium mb-3">Available Slots Today</div>
          <div className="grid grid-cols-3 gap-2">
            {['09:00', '10:30', '14:00', '15:30', '16:00'].map((time, idx) => (
              <button key={time} className={`text-xs p-2 rounded ${idx === 2 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}>
                {time}
              </button>
            ))}
            <div className="text-xs p-2 text-center text-gray-400">+12 more</div>
          </div>
        </div>
        
        <div className="border border-gray-100 rounded-lg p-3 bg-white shadow-sm">
          <div className="text-sm font-medium mb-2">Next Appointments</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs font-medium">Konsultasi Bisnis</div>
                <div className="text-xs text-gray-500">Sarah Johnson • 1 jam</div>
              </div>
              <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded flex items-center">
                <DollarSign size={10} className="mr-1" />
                Paid
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs font-medium">Coaching Session</div>
                <div className="text-xs text-gray-500">Mike Chen • 30 min</div>
              </div>
              <div className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                Pending
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button className="flex-1 bg-primary text-white text-xs px-3 py-2 rounded-lg flex items-center justify-center">
            <Calendar size={12} className="mr-1" />
            Book Now
          </button>
          <button className="bg-gray-100 text-gray-700 text-xs px-3 py-2 rounded-lg flex items-center justify-center">
            <FileText size={12} className="mr-1" />
            Reports
          </button>
        </div>
      </div>
    </div>
  </div>
);

const ProductShowcase: React.FC = () => {
  const products = [
    {
      id: 'meeting',
      title: 'Meeting Scheduling',
      subtitle: 'Jadwalkan meeting dengan infrastruktur Zoom yang mudah',
      description: 'Platform meeting scheduling yang terintegrasi dengan Zoom untuk meeting profesional tanpa perlu akun berbayar.',
      mockup: <MeetingSchedulingMockup />,
      features: [
        { icon: Video, text: 'Unlock semua fitur Zoom Professional', description: 'Akses fitur premium Zoom tanpa langganan sendiri' },
        { icon: MonitorPlay, text: 'Kualitas video Full HD 1080p', description: 'Video berkualitas tinggi untuk meeting profesional' },
        { icon: Calendar, text: 'Easy scheduling interface', description: 'Interface yang mudah untuk mengatur jadwal meeting' },
        { icon: DollarSign, text: 'Ekonomis, tanpa langganan Zoom sendiri', description: 'Hemat biaya dengan menggunakan infrastruktur bersama' },
        { icon: Shield, text: 'Keamanan tingkat enterprise', description: 'Proteksi data dan privasi meeting yang terjamin' }
      ]
    },
    {
      id: 'event',
      title: 'Event Management System',
      subtitle: 'Kelola event besar dengan sistem yang powerful',
      description: 'Sistem manajemen event lengkap untuk webinar, workshop, dan acara virtual dengan kapasitas besar.',
      mockup: <EventManagementMockup />,
      features: [
        { icon: Users, text: 'Hingga 10.000 peserta per event', description: 'Cocok untuk webinar, kelas online, dan seminar berskala besar' },
        { icon: ClipboardList, text: 'Formulir pendaftaran fleksibel', description: 'Kumpulkan data peserta sesuai kebutuhan Anda' },
        { icon: Zap, text: 'Pembayaran otomatis & notifikasi real-time', description: 'Terima pembayaran langsung, tanpa perlu cek manual' },
        { icon: Smartphone, text: 'Distribusi link Zoom otomatis + pengingat WhatsApp', description: 'Undangan dan reminder terkirim otomatis tanpa repot' },
        { icon: UserCheck, text: 'Pelacakan kehadiran peserta secara otomatis', description: 'Rekam kehadiran dan pantau aktivitas peserta dengan mudah' }
      ]
    },
    {
      id: 'appointment',
      title: 'Appointment Bookings',
      subtitle: 'Sistem booking appointment dengan payment otomatis',
      description: 'Platform appointment booking untuk konsultasi, coaching, atau layanan profesional dengan sistem pembayaran terintegrasi.',
      mockup: <AppointmentBookingMockup />,
      features: [
        { icon: Clock, text: 'Jadwal personal one-on-one yang fleksibel', description: 'Atur waktu konsultasi sesuai kebutuhan klien' },
        { icon: Calendar, text: 'Integrasi kalender real-time', description: 'Sinkronisasi otomatis dengan Google Calendar dan aplikasi lain' },
        { icon: Users, text: 'Sistem manajemen klien lengkap', description: 'Kelola data dan riwayat klien dalam satu platform' },
        { icon: CreditCard, text: 'Payment gateway otomatis', description: 'Terima pembayaran langsung dengan berbagai metode' },
        { icon: Bell, text: 'Reminder otomatis via WhatsApp & Email', description: 'Kurangi no-show dengan sistem pengingat cerdas' }
      ]
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tiga Produk Utama dalam <span className="text-primary">Satu Platform</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Semua kebutuhan penjadwalan Anda tersedia dalam satu platform yang mudah digunakan
          </p>
        </div>
        
        <div className="space-y-20">
          {products.map((product, index) => (
            <div key={product.id} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 animate-fade-in`} style={{animationDelay: `${index * 0.2}s`}}>
              <div className="lg:w-1/2 relative">
                {product.mockup}
                <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full rounded-xl bg-primary/10"></div>
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
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Coba {product.title}
                  </Button>
                  <Button variant="outline" size="lg">
                    Pelajari Lebih Lanjut
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
