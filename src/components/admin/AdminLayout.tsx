
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { Home, LogOut, Database, Book, Users, MessageSquare, Files, Image, HelpCircle, Settings } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';
import AdminInitializer from './AdminInitializer';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const location = useLocation();
  const isMobile = useMobile();
  
  const adminNavItems = [
    { title: 'Dashboard', href: '/admin', icon: <Home size={20} /> },
    { title: 'Pengaturan URL', href: '/admin/url-management', icon: <Link size={20} /> },
    { title: 'Blog', href: '/admin/blog-management', icon: <Book size={20} /> },
    { title: 'FAQ', href: '/admin/faq-management', icon: <HelpCircle size={20} /> },
    { title: 'Testimonial', href: '/admin/testimonial-management', icon: <MessageSquare size={20} /> },
    { title: 'Brand Logos', href: '/admin/brand-logo-management', icon: <Image size={20} /> },
    { title: 'Contact Info', href: '/admin/contact-management', icon: <Users size={20} /> },
    { title: 'About Page', href: '/admin/about-management', icon: <Database size={20} /> },
    { title: 'Terms', href: '/admin/terms-management', icon: <Files size={20} /> },
    { title: 'Privacy', href: '/admin/privacy-management', icon: <Files size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <AdminInitializer />
      
      {/* Sidebar */}
      <div className={`bg-card border-r border-border ${isMobile ? 'hidden' : 'w-64'}`}>
        <div className="flex flex-col h-full">
          <div className="py-4 px-5 border-b">
            <h2 className="text-xl font-bold">Admin Panel</h2>
            <p className="text-sm text-muted-foreground">Manage your website content</p>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="py-2">
              <nav className="grid gap-1 px-2">
                {adminNavItems.map((item, index) => (
                  <Button 
                    key={index}
                    variant={location.pathname === item.href ? "secondary" : "ghost"}
                    asChild
                    className="justify-start h-10"
                  >
                    <Link to={item.href}>
                      {item.icon}
                      <span className="ml-2">{item.title}</span>
                    </Link>
                  </Button>
                ))}
              </nav>
            </div>
          </ScrollArea>
          
          <div className="mt-auto border-t p-4">
            <Button variant="outline" className="w-full justify-start gap-2" asChild>
              <Link to="/">
                <LogOut size={18} />
                <span>Back to Site</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1">
        <header className="border-b bg-card h-14 flex items-center px-6">
          <h1 className="text-xl font-semibold">{title}</h1>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
