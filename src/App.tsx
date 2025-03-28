
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FAQ from "./pages/FAQ";

// Feature Pages
import BayarSesuaiPakai from "./pages/fitur/BayarSesuaiPakai";
import Dashboard from "./pages/fitur/Dashboard";
import RekamanCloud from "./pages/fitur/RekamanCloud";
import LaporanPeserta from "./pages/fitur/LaporanPeserta";

// Company Pages
import TentangKami from "./pages/TentangKami";
import Kontak from "./pages/Kontak";
import SyaratKetentuan from "./pages/SyaratKetentuan";
import KebijakanPrivasi from "./pages/KebijakanPrivasi";
import Blog from "./pages/Blog";

// Admin Pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import URLManagement from "./pages/admin/URLManagement";
import FAQManagement from "./pages/admin/FAQManagement";
import BlogManagement from "./pages/admin/BlogManagement";
import TestimonialManagement from "./pages/admin/TestimonialManagement";
import BrandLogoManagement from "./pages/admin/BrandLogoManagement";
import AboutManagement from "./pages/admin/AboutManagement";
import ContactManagement from "./pages/admin/ContactManagement";
import TermsManagement from "./pages/admin/TermsManagement";
import PrivacyManagement from "./pages/admin/PrivacyManagement";

// Crisp
import { useEffect } from "react";
import { useLocation, BrowserRouter, Routes, Route } from "react-router-dom";

const queryClient = new QueryClient();

const App = () => (
  const location = useLocation();

  useEffect(() => {
    const isAdminPage = location.pathname.startsWith("/admin");
    if (!isAdminPage) {
      window.$crisp = [];
      window.CRISP_WEBSITE_ID = "c876efde-7b19-4dc0-affd-2efcdc34ba2c";

      const d = document;
      const s = d.createElement("script");
      s.src = "https://client.crisp.chat/l.js";
      s.async = true;
      d.getElementsByTagName("head")[0].appendChild(s);
    }
  }, [location.pathname]);

  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/faq" element={<FAQ />} />
          
          {/* Feature Pages */}
          <Route path="/fitur/bayar-sesuai-pakai" element={<BayarSesuaiPakai />} />
          <Route path="/fitur/dashboard" element={<Dashboard />} />
          <Route path="/fitur/rekaman-cloud" element={<RekamanCloud />} />
          <Route path="/fitur/laporan-peserta" element={<LaporanPeserta />} />
          
          {/* Company Pages */}
          <Route path="/tentang-kami" element={<TentangKami />} />
          <Route path="/kontak" element={<Kontak />} />
          <Route path="/syarat-ketentuan" element={<SyaratKetentuan />} />
          <Route path="/kebijakan-privasi" element={<KebijakanPrivasi />} />
          <Route path="/blog" element={<Blog />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/urls" element={<URLManagement />} />
          <Route path="/admin/faq" element={<FAQManagement />} />
          <Route path="/admin/blog" element={<BlogManagement />} />
          <Route path="/admin/testimonials" element={<TestimonialManagement />} />
          <Route path="/admin/brand-logos" element={<BrandLogoManagement />} />
          <Route path="/admin/about" element={<AboutManagement />} />
          <Route path="/admin/contact" element={<ContactManagement />} />
          <Route path="/admin/terms" element={<TermsManagement />} />
          <Route path="/admin/privacy" element={<PrivacyManagement />} />
          
          {/* 404 Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
