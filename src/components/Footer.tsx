
import React from 'react';
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <a href="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold text-primary">BikinJadwal<span className="text-foreground">.id</span></span>
            </a>
            <p className="text-muted-foreground mb-4 text-sm">
              Schedule meetings without needing a paid Zoom account. Pay-as-you-go, no subscriptions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Features</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Pay-As-You-Go</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Dashboard</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Cloud Recording</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Participant Reports</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Getting Started</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">FAQ</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Tutorial Videos</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">About Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Contact</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} BikinJadwal.id. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <select className="text-sm bg-transparent border rounded py-1 px-2">
              <option value="en">English</option>
              <option value="id">Bahasa Indonesia</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
