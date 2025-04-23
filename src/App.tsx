
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FAQ from "./pages/FAQ";
import TentangKami from "./pages/TentangKami";
import Kontak from "./pages/Kontak";

import BayarSesuaiPakai from "./pages/fitur/BayarSesuaiPakai";
import Dashboard from "./pages/fitur/Dashboard";
import RekamanCloud from "./pages/fitur/RekamanCloud";
import LaporanPeserta from "./pages/fitur/LaporanPeserta";

import SyaratKetentuan from "./pages/SyaratKetentuan";
import KebijakanPrivasi from "./pages/KebijakanPrivasi";
import MenjadiReseller from "./pages/MenjadiReseller";

import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import BlogManagement from "./pages/admin/BlogManagement";

// WhatsApp Widget Injection
function WhatsappWidgetScript() {
  useEffect(() => {
    // Remove Crisp chat widget if it exists
    const crisp = document.querySelector('script[src*="crisp.chat"]');
    if (crisp) {
      crisp.remove();
      const crispElements = document.querySelectorAll('[id*="crisp"]');
      crispElements.forEach(el => el.remove());
    }

    // Inject WhatsApp Widget if not already present
    if (!document.getElementById("balesoto-script")) {
      const script = document.createElement('script');
      script.id = "balesoto-script";
      script.type = "text/javascript";
      script.src = "https://cdn.balesotomatis.id/scripts/embed.js";
      script.setAttribute("balesoto-origin", "aHR0cHM6Ly93aWRnZXQuYmFsZXNvdG9tYXRpcy5pZC9pbmRleA==");
      script.setAttribute("balesoto-key", "BALESOTO-gr9i53");
      document.body.appendChild(script);
    }
  }, []);

  return null;
}

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/faq" element={<FAQ />} />
      
      <Route path="/fitur/bayar-sesuai-pakai" element={<BayarSesuaiPakai />} />
      <Route path="/fitur/dashboard" element={<Dashboard />} />
      <Route path="/fitur/rekaman-cloud" element={<RekamanCloud />} />
      <Route path="/fitur/laporan-peserta" element={<LaporanPeserta />} />
      
      <Route path="/syarat-ketentuan" element={<SyaratKetentuan />} />
      <Route path="/kebijakan-privasi" element={<KebijakanPrivasi />} />
      <Route path="/menjadi-reseller" element={<MenjadiReseller />} />
      <Route path="/tentang-kami" element={<TentangKami />} />
      <Route path="/kontak" element={<Kontak />} />
      
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/blog" element={<BlogManagement />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <WhatsappWidgetScript />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;

