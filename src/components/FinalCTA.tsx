
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

const FinalCTA: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto glass rounded-2xl p-8 md:p-12 shadow-elevation border border-white/40 animate-scale-in">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Ready to schedule your first meeting?</h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of users who are already enjoying the flexibility of our pay-as-you-go meeting platform.
              </p>
              <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-white">
                <a href="https://bikinjadwal.id/register">
                  Sign Up & Start Scheduling
                  <ArrowRight size={16} className="ml-2" />
                </a>
              </Button>
            </div>
            <div className="rounded-xl bg-primary/5 p-6 space-y-4">
              <h3 className="font-medium text-lg">What you'll get:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold text-primary">✓</span>
                  </div>
                  <span className="text-sm">Instant meeting setup without a paid Zoom account</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold text-primary">✓</span>
                  </div>
                  <span className="text-sm">Pay only for meetings you actually schedule</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold text-primary">✓</span>
                  </div>
                  <span className="text-sm">Cloud recordings and participant reports</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold text-primary">✓</span>
                  </div>
                  <span className="text-sm">Full access to premium meeting features</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold text-primary">✓</span>
                  </div>
                  <span className="text-sm">Dedicated support for all your questions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
