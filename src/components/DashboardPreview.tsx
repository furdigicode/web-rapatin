
import React from 'react';
import { Calendar, CheckCircle, Clock, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

const DashboardPreview: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <section id="dashboard" className="py-20 bg-accent/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left column - text content */}
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
          
          {/* Right column - illustration */}
          <div className="relative">
            {/* Create Schedule Card */}
            <div className="glass rounded-xl overflow-hidden shadow-elevation border border-white/40 mx-auto max-w-md">
              <div className="bg-white/70 backdrop-blur-sm p-4 border-b border-white/20">
                <h3 className="font-medium">Create Schedule</h3>
              </div>
              
              <div className="p-6 space-y-4 bg-white/90">
                <div className="space-y-2">
                  <Label>Meeting Capacity*</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100 Participants</SelectItem>
                      <SelectItem value="300">300 Participants</SelectItem>
                      <SelectItem value="500">500 Participants</SelectItem>
                      <SelectItem value="1000">1000 Participants</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Topic*</Label>
                  <Input placeholder="Input the Topic" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date*</Label>
                    <div className="relative">
                      <Input placeholder="Mar 25, 2025" />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Time*</Label>
                    <div className="relative">
                      <Input placeholder="14:23" />
                      <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                </div>
                
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-2">
                  <Plus size={18} className="mr-2" /> Create Schedule
                </Button>
              </div>
            </div>
            
            {/* Subtle background element for depth */}
            <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full rounded-xl bg-primary/10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
