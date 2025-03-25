
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, Video } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="pt-28 pb-12 md:pt-32 md:pb-24 overflow-hidden bg-hero-pattern">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center py-1 px-4 bg-accent/70 rounded-full backdrop-blur-sm">
              <span className="text-xs font-medium text-primary">Schedule meetings, no subscription needed</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance">
              Schedule <span className="text-primary">online meetings</span> without a paid Zoom account
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl text-balance">
              Pay only for what you use, with flexible pricing based on participant count. No monthly subscriptions, just top up your balance and schedule.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full h-12 px-8">
                <a href="https://bikinjadwal.id/register">Sign Up & Start Scheduling</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full h-12 px-8">
                <a href="#pricing">See Pricing</a>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 max-w-md pt-2">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign size={18} className="text-primary" />
                <span>Pay-As-You-Go</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Video size={18} className="text-primary" />
                <span>Zoom, Meet, Teams</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={18} className="text-primary" />
                <span>Easy Scheduling</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock size={18} className="text-primary" />
                <span>Unlimited Duration</span>
              </div>
            </div>
          </div>

          <div className="relative animate-slide-in-right">
            <div className="relative w-full h-[440px] glass rounded-2xl overflow-hidden border border-white/40 shadow-elevation">
              <div className="absolute top-0 left-0 right-0 h-12 bg-white/50 backdrop-blur-sm border-b border-white/20 flex items-center px-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="mx-auto text-sm font-medium">BikinJadwal.id Dashboard</div>
              </div>
              <div className="p-6 pt-16">
                <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
                  <h3 className="font-medium mb-3">Schedule New Meeting</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 p-2 border rounded-lg bg-muted/30">
                      <Calendar size={16} className="text-primary" />
                      <span className="text-sm">Tomorrow, 2:00 PM</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 border rounded-lg bg-muted/30">
                      <Video size={16} className="text-primary" />
                      <span className="text-sm">Zoom Meeting</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 border rounded-lg bg-muted/30">
                      <DollarSign size={16} className="text-primary" />
                      <span className="text-sm">100 Participants - Rp 20.000</span>
                    </div>
                  </div>
                  <Button className="mt-4 w-full bg-primary hover:bg-primary/90 text-white">Create Meeting</Button>
                </div>
                <div className="bg-gradient-to-tr from-primary/10 to-primary/5 rounded-xl p-6 shadow-sm">
                  <div className="flex justify-between mb-4">
                    <h3 className="font-medium">Your Balance</h3>
                    <span className="font-bold">Rp 80.000</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Last topup: 3 days ago</div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 -z-10 w-full h-full rounded-2xl bg-primary/10 animate-float"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
