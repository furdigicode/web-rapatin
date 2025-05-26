
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CreditCard, Video } from 'lucide-react';

const AppointmentDemo: React.FC = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Lihat Demo Booking Process
          </h2>
          <p className="text-lg text-muted-foreground">
            Pengalaman booking yang mudah untuk klien Anda, dan dashboard yang powerful untuk Anda.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
          {/* Client Booking Experience */}
          <div className="animate-fade-in">
            <h3 className="text-2xl font-semibold mb-6">Pengalaman Klien</h3>
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg">Book Konsultasi dengan Dr. Sarah</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm">
                    <Clock size={14} className="mr-1" />
                    10:00
                  </Button>
                  <Button variant="outline" size="sm">
                    <Clock size={14} className="mr-1" />
                    11:00
                  </Button>
                  <Button size="sm" className="bg-primary text-white">
                    <Clock size={14} className="mr-1" />
                    14:00
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Konsultasi Kesehatan (60 menit)</div>
                  <div className="text-sm text-muted-foreground">Rp 150.000</div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Video size={16} />
                  <span>Video call via Zoom</span>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  <CreditCard size={16} className="mr-2" />
                  Bayar & Book Appointment
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Admin Dashboard */}
          <div className="animate-fade-in">
            <h3 className="text-2xl font-semibold mb-6">Dashboard Admin</h3>
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg">Appointment Hari Ini</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                    <div>
                      <div className="font-medium">Budi Santoso</div>
                      <div className="text-sm text-muted-foreground">Konsultasi Bisnis</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">10:00 - 11:00</div>
                      <div className="text-xs text-green-600">Paid</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                    <div>
                      <div className="font-medium">Siti Rahayu</div>
                      <div className="text-sm text-muted-foreground">Konsultasi Hukum</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">14:00 - 15:00</div>
                      <div className="text-xs text-green-600">Paid</div>
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Total Hari Ini:</span>
                    <span className="font-semibold">Rp 300.000</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppointmentDemo;
