
import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Link as LinkIcon, 
  FileText, 
  Settings, 
  Users, 
  MessageSquare,
  FileQuestion,
  LogOut,
  Menu,
  X,
  Home,
  Star
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Check auth on mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
    if (!isAuthenticated && location.pathname !== '/admin/login') {
      navigate('/admin/login');
    }
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    toast({
      title: "Logout berhasil",
      description: "Anda telah keluar dari sistem",
    });
    navigate('/admin/login');
  };

  const navItems = [
    { 
      icon: <LayoutDashboard size={20} />, 
      label: 'Dashboard', 
      path: '/admin/dashboard',
      active: location.pathname === '/admin/dashboard'
    },
    { 
      icon: <LinkIcon size={20} />, 
      label: 'Manajemen URL', 
      path: '/admin/urls',
      active: location.pathname === '/admin/urls'
    },
    { 
      icon: <FileQuestion size={20} />, 
      label: 'FAQ', 
      path: '/admin/faq',
      active: location.pathname === '/admin/faq'
    },
    { 
      icon: <FileText size={20} />, 
      label: 'Blog', 
      path: '/admin/blog',
      active: location.pathname === '/admin/blog'
    },
    { 
      icon: <Star size={20} />, 
      label: 'Testimonial', 
      path: '/admin/testimonials',
      active: location.pathname === '/admin/testimonials'
    },
    { 
      icon: <MessageSquare size={20} />, 
      label: 'Tentang Kami', 
      path: '/admin/about',
      active: location.pathname === '/admin/about'
    },
    { 
      icon: <Users size={20} />, 
      label: 'Kontak', 
      path: '/admin/contact',
      active: location.pathname === '/admin/contact'
    },
    { 
      icon: <Settings size={20} />, 
      label: 'S&K dan Privasi', 
      path: '/admin/terms-privacy',
      active: location.pathname === '/admin/terms-privacy'
    }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside 
        className={`bg-card border-r border-border fixed md:static top-0 bottom-0 left-0 z-40 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64' : 'w-0 md:w-16 overflow-hidden'
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b">
          {isSidebarOpen ? (
            <Link to="/admin/dashboard" className="flex items-center">
              <img 
                src="/lovable-uploads/2daea350-0851-4dd8-8f79-ee07aaaad905.png" 
                alt="Rapatin Logo" 
                className="h-8 mr-2" 
              />
              <span className="font-bold">Admin</span>
            </Link>
          ) : (
            <span className="w-8 h-8 flex items-center justify-center">
              <img 
                src="/lovable-uploads/2daea350-0851-4dd8-8f79-ee07aaaad905.png" 
                alt="Logo" 
                className="h-6" 
              />
            </span>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-muted-foreground hover:text-foreground md:flex hidden"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center ${
                    isSidebarOpen ? 'px-3' : 'justify-center px-1'
                  } py-2 rounded-md transition-colors ${
                    item.active 
                      ? 'bg-primary/10 text-primary' 
                      : 'hover:bg-accent hover:text-foreground'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {isSidebarOpen && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t">
          <div className={`flex ${isSidebarOpen ? 'justify-between' : 'justify-center'} items-center`}>
            {isSidebarOpen && (
              <div className="text-sm">
                <div className="font-medium">Admin</div>
                <div className="text-muted-foreground text-xs">admin@rapatin.id</div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-accent text-muted-foreground hover:text-foreground"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b flex items-center justify-between px-4 bg-card">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden mr-2 w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-xl font-bold">{title}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <a href="/" target="_blank" className="flex items-center gap-2">
                <Home size={16} />
                <span>Lihat Website</span>
              </a>
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
