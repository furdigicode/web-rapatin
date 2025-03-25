
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';

interface PricingPlanProps {
  participants: string;
  price: string;
  isPrimary?: boolean;
  delay: string;
}

const PricingPlan: React.FC<PricingPlanProps> = ({ participants, price, isPrimary = false, delay }) => {
  const features = [
    "Cloud Recording (72h access)",
    "Unlimited meeting duration",
    "Access for the whole day (00.00 - 23.59)",
    "Screen sharing",
    "AI Companion",
    "Polling, Q&A, Surveys",
    "Registration system",
    "Live streaming to YouTube",
    "Assign up to 99 Co-Hosts"
  ];

  return (
    <div 
      className={`rounded-xl p-1 animate-fade-in ${delay} ${
        isPrimary ? "bg-gradient-to-br from-primary/80 to-primary" : "bg-white"
      }`}
    >
      <div 
        className={`h-full rounded-lg p-6 ${
          isPrimary ? "bg-card shadow-elevation" : "glass"
        }`}
      >
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">{participants} Participants</h3>
          <div className="flex items-end mb-2">
            <span className="text-3xl font-bold">{price}</span>
            <span className="text-muted-foreground ml-1 text-sm">/meeting</span>
          </div>
          <p className="text-sm text-muted-foreground">One-time payment per scheduled meeting</p>
        </div>
        
        <div className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <Check 
                size={18} 
                className={`mr-2 mt-0.5 ${
                  isPrimary ? "text-primary" : "text-primary/80"
                }`} 
              />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
        
        <Button 
          asChild
          className={`w-full rounded-lg ${
            isPrimary 
              ? "bg-primary hover:bg-primary/90 text-white" 
              : "bg-white hover:bg-white/90 text-primary border border-primary/20"
          }`}
        >
          <a href="https://bikinjadwal.id/register">Buy Now & Schedule</a>
        </Button>
      </div>
    </div>
  );
};

const PricingSection: React.FC = () => {
  const plans = [
    { participants: "100 Participants", price: "Rp 20.000", isPrimary: false, delay: "delay-0" },
    { participants: "300 Participants", price: "Rp 35.000", isPrimary: true, delay: "delay-100" },
    { participants: "500 Participants", price: "Rp 60.000", isPrimary: false, delay: "delay-200" },
    { participants: "1000 Participants", price: "Rp 100.000", isPrimary: false, delay: "delay-300" }
  ];
  
  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center py-1 px-4 bg-accent rounded-full mb-4">
            <span className="text-xs font-medium text-primary">Transparent Pricing</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pay-Per-Meeting Pricing
          </h2>
          <p className="text-muted-foreground text-lg">
            No subscriptions, no commitments. Only pay for meetings you schedule, based on participant count.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <PricingPlan
              key={index}
              participants={plan.participants}
              price={plan.price}
              isPrimary={plan.isPrimary}
              delay={plan.delay}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center max-w-3xl mx-auto animate-fade-in delay-400">
          <p className="text-muted-foreground mb-6">
            All prices include taxes and fees. Your account balance is deducted only when you schedule a meeting.
          </p>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <a href="#features">See All Features</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
