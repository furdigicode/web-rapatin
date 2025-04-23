
import React from 'react';

const DashboardPreview: React.FC = () => {
  return (
    <section id="dashboard-preview" className="py-20 bg-background w-full">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-10 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Rapatin Dashboard</h2>
          <div className="aspect-video rounded-xl overflow-hidden shadow-elevation border border-white/40 glass flex items-center justify-center" style={{ background: '#fff' }}>
            <img 
              src="/lovable-uploads/f60104e0-c084-405c-9919-ddac06e8a0c2.png"
              alt="Rapatin Dashboard Screenshot"
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
