
import React from 'react';
import { CheckCircle, Copy, Edit, MoreHorizontal, Plus, Video } from 'lucide-react';
import { Button } from "@/components/ui/button";

const DashboardPreview: React.FC = () => {
  return (
    <section id="dashboard" className="py-20 bg-accent/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center py-1 px-4 bg-accent rounded-full mb-2">
              <span className="text-xs font-medium text-primary">Intuitive Interface</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Streamlined dashboard for easy <span className="text-primary">meeting management</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Our user-friendly dashboard makes it simple to create, manage, and monitor your scheduled meetings. 
              Access recordings, participant reports, and meeting links all in one place.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4 mt-1 text-primary">
                  <CheckCircle size={16} />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Quick Meeting Creation</h3>
                  <p className="text-muted-foreground text-sm">Set up a new meeting in less than 30 seconds with our streamlined interface.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4 mt-1 text-primary">
                  <CheckCircle size={16} />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Access Recordings</h3>
                  <p className="text-muted-foreground text-sm">Easily download and share your meeting recordings for 72 hours after the meeting.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4 mt-1 text-primary">
                  <CheckCircle size={16} />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Participant Analytics</h3>
                  <p className="text-muted-foreground text-sm">Track attendance and engagement with detailed participant reports for each meeting.</p>
                </div>
              </div>
            </div>
            
            <Button asChild size="lg" className="mt-6 bg-primary hover:bg-primary/90 text-white rounded-full">
              <a href="https://bikinjadwal.id/register">Try The Dashboard Now</a>
            </Button>
          </div>
          
          <div className="relative animate-slide-in-right">
            <div className="relative glass rounded-xl overflow-hidden shadow-elevation border border-white/40">
              <div className="bg-white/70 backdrop-blur-sm p-4 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Your Meetings</h3>
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-white h-9">
                    <Plus size={16} className="mr-1" /> New Meeting
                  </Button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="bg-white/80 rounded-lg p-4 border border-white/40 hover:shadow-soft transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">Weekly Team Check-in</h4>
                      <p className="text-sm text-muted-foreground">Today, 15:00 - 16:00</p>
                    </div>
                    <div className="flex items-center">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal size={14} />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs bg-accent/60 py-1 px-2 rounded text-primary font-medium">
                      100 Participants
                    </div>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      <Video size={14} className="mr-1" /> Join Meeting
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white/80 rounded-lg p-4 border border-white/40 hover:shadow-soft transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">Client Presentation</h4>
                      <p className="text-sm text-muted-foreground">Tomorrow, 10:00 - 11:30</p>
                    </div>
                    <div className="flex items-center">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal size={14} />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs bg-accent/60 py-1 px-2 rounded text-primary font-medium">
                      300 Participants
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        <Copy size={14} className="mr-1" /> Copy Link
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/80 rounded-lg p-4 border border-white/40 hover:shadow-soft transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">Product Demo</h4>
                      <p className="text-sm text-muted-foreground">Aug 15, 14:00 - 15:00</p>
                    </div>
                    <div className="flex items-center">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal size={14} />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs bg-accent/60 py-1 px-2 rounded text-primary font-medium">
                      500 Participants
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        <Copy size={14} className="mr-1" /> Copy Link
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 -z-10 w-full h-full rounded-xl bg-primary/10 animate-float delay-500"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
