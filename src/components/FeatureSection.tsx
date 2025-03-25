
import React from 'react';
import { 
  Calendar, 
  CloudLightning, 
  CreditCard, 
  Download, 
  FileText, 
  LayoutDashboard, 
  LifeBuoy, 
  Video
} from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description, delay }) => {
  return (
    <div className={`glass p-6 rounded-xl transition-all duration-300 hover:shadow-elevation animate-fade-in ${delay}`}>
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const FeatureSection: React.FC = () => {
  const features = [
    {
      icon: <CreditCard size={22} />,
      title: "Pay-As-You-Go Model",
      description: "Top up your account and pay only for meetings you schedule. No monthly subscriptions or hidden fees.",
      delay: "delay-0"
    },
    {
      icon: <LayoutDashboard size={22} />,
      title: "Intuitive Dashboard",
      description: "Create or edit schedules with our clean, modern interface designed for self-service.",
      delay: "delay-100"
    },
    {
      icon: <CloudLightning size={22} />,
      title: "Cloud Recording",
      description: "Recordings automatically saved and available for download for 72 hours via your dashboard.",
      delay: "delay-200"
    },
    {
      icon: <FileText size={22} />,
      title: "Participant Reports",
      description: "Get automatic attendance reports for each meeting to track participation.",
      delay: "delay-300"
    },
    {
      icon: <Video size={22} />,
      title: "No Zoom Account Needed",
      description: "Schedule meetings without requiring a paid Zoom account. Works instantly for everyone.",
      delay: "delay-400"
    },
    {
      icon: <LifeBuoy size={22} />,
      title: "Dedicated Support",
      description: "Our support team is ready to help with any technical issues you might encounter.",
      delay: "delay-500"
    },
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-background to-accent/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center py-1 px-4 bg-accent rounded-full mb-4">
            <span className="text-xs font-medium text-primary">Powerful Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need for seamless <span className="text-primary">online meetings</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Our platform combines flexibility with powerful features to make your online meetings effortless and productive.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Feature 
              key={index} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>

        <div className="mt-20 max-w-3xl mx-auto glass p-8 rounded-xl animate-fade-in shadow-soft">
          <h3 className="text-2xl font-bold mb-6 text-center">
            Perfect For
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-accent/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
                <CreditCard size={18} />
              </div>
              <p className="font-medium text-sm">No-Subscription Users</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-accent/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
                <Calendar size={18} />
              </div>
              <p className="font-medium text-sm">Heavy Meeting Users</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-accent/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
                <Download size={18} />
              </div>
              <p className="font-medium text-sm">Last-Minute Meetings</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-accent/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
                <Video size={18} />
              </div>
              <p className="font-medium text-sm">Educators & Teams</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
