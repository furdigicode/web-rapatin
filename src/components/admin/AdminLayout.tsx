
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false); // Default closed on mobile
  const [isMobile, setIsMobile] = React.useState(false);
  const location = useLocation();
  const { toast } = useToast();
  const { logout, admin } = useAdminAuth();

  // Detect mobile screen size
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true); // Auto-open on desktop
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-close sidebar on route change in mobile
  React.useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Click outside to close on mobile
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isSidebarOpen) {
        const sidebar = document.getElementById('admin-sidebar');
        const trigger = document.getElementById('mobile-trigger');
        
        if (sidebar && !sidebar.contains(event.target as Node) && 
            trigger && !trigger.contains(event.target as Node)) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isSidebarOpen]);

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logout berhasil",
      description: "Anda telah keluar dari sistem",
    });
  };

  const navItems = [
    { 
      icon: <LayoutDashboard size={20} />, 
      label: 'Dashboard', 
      path: '/admin/dashboard',
      active: location.pathname === '/admin/dashboard'
    },
    { 
      icon: <FileText size={20} />, 
      label: 'Blog', 
      path: '/admin/blog',
      active: location.pathname === '/admin/blog'
    }
  ];

  return (
    <div className="min-h-screen flex relative">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        id="admin-sidebar"
        className={`bg-card border-r border-border fixed md:static top-0 bottom-0 left-0 z-40 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64' : 'w-0 md:w-16 overflow-hidden'
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b">
          {isSidebarOpen && (
            <Link to="/admin/dashboard" className="flex items-center">
              <img 
                src="/lovable-uploads/2daea350-0851-4dd8-8f79-ee07aaaad905.png" 
                alt="Rapatin Logo" 
                className="h-8 mr-2" 
              />
              <span className="font-bold">Admin</span>
            </Link>
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
                <div className="text-muted-foreground text-xs">{admin?.email}</div>
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
              id="mobile-trigger"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden mr-2 w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-lg md:text-xl font-bold truncate">{title}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="hidden sm:flex">
              <a href="/" target="_blank" className="flex items-center gap-2">
                <Home size={16} />
                <span className="hidden md:inline">Lihat Website</span>
              </a>
            </Button>
            <Button asChild variant="outline" size="sm" className="sm:hidden">
              <a href="/" target="_blank" className="flex items-center justify-center">
                <Home size={16} />
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
