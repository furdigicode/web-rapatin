
import React from 'react';
import { Calendar, Check, CheckCircle, Clock, Copy, Eye, Home, Inbox, LayoutDashboard, Plus, Search, Tag, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
          
          {/* Dashboard Preview */}
          <div className="relative animate-slide-in-right">
            <div className="relative glass rounded-xl overflow-hidden shadow-elevation border border-white/40">
              <div className="bg-white/70 backdrop-blur-sm p-4 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">Schedules</h3>
                    <div className="flex text-sm gap-4 text-muted-foreground">
                      <button className="text-primary font-medium">Upcoming</button>
                      <button>Previous</button>
                    </div>
                  </div>
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white h-9 rounded-lg">
                    <Plus size={16} className="mr-1" /> Create Schedule
                  </Button>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Filters section */}
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <Button variant="outline" size="sm" className="flex gap-2 items-center h-9 text-sm">
                      <span>Group by</span>
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Button>
                  </div>
                  <div>
                    <Input className="h-9 w-60" placeholder="Search" />
                  </div>
                </div>
                
                {/* Table header */}
                <div className="grid grid-cols-4 border-b pb-2 text-sm font-medium">
                  <div className="flex items-center gap-1">
                    <span>Room</span>
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>Meeting ID</div>
                  <div>Topic</div>
                  <div>Time</div>
                </div>
                
                {/* Meeting rows */}
                <div className="grid grid-cols-4 py-3 border-b text-sm items-center">
                  <div>Room 3</div>
                  <div>98591727859</div>
                  <div>Team Meeting</div>
                  <div>Mar 25, 2025 13:08 WIB</div>
                </div>
                
                <div className="grid grid-cols-4 py-3 text-sm items-center">
                  <div>Room 3</div>
                  <div>99171675194</div>
                  <div>Product Demo</div>
                  <div>Mar 26, 2025 12:15 WIB</div>
                </div>
                
                {/* Pagination */}
                <div className="flex justify-between items-center pt-2 text-sm">
                  <div className="text-muted-foreground">
                    Showing 1 to 2 of 2 results
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Per page</span>
                    <Select defaultValue="10">
                      <SelectTrigger className="w-16 h-8">
                        <SelectValue placeholder="10" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Create Schedule Form - no longer rotated */}
            <div className="absolute top-0 right-0 glass rounded-xl overflow-hidden shadow-elevation border border-white/40 w-72 md:block">
              <div className="bg-white/70 backdrop-blur-sm p-3 border-b border-white/20">
                <h3 className="font-medium text-sm">Create Schedule</h3>
              </div>
              <div className="p-3 space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Meeting Capacity*</Label>
                  <Select>
                    <SelectTrigger className="h-8 text-xs">
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
                <div className="space-y-1">
                  <Label className="text-xs">Topic*</Label>
                  <Input className="h-8 text-xs" placeholder="Input the Topic" />
                </div>
                <div className="flex gap-2">
                  <div className="space-y-1 flex-1">
                    <Label className="text-xs">Date*</Label>
                    <Input className="h-8 text-xs" placeholder="Mar 25, 2025" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <Label className="text-xs">Time*</Label>
                    <Input className="h-8 text-xs" placeholder="14:23" />
                  </div>
                </div>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white w-full text-xs mt-2">
                  Create
                </Button>
              </div>
            </div>
            
            {/* Status badge for "Closed" with View icon */}
            <div className="absolute bottom-16 right-4 bg-white py-1 px-2 rounded-lg text-xs flex items-center gap-2 shadow-sm">
              <div className="flex items-center text-red-500 gap-1">
                <X size={14} className="stroke-2" /> 
                <span>Closed</span>
              </div>
              <div className="text-amber-500 flex items-center gap-1">
                <Eye size={14} />
                <span>View</span>
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

