import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { useEffect } from "react";
import Index from "./pages/Index";
import MainPage from "./pages/MainPage";
import MeetingScheduling from "./pages/MeetingScheduling";
import NotFound from "./pages/NotFound";
import FAQ from "./pages/FAQ";
import TentangKami from "./pages/TentangKami";
import Kontak from "./pages/Kontak";
import Appointment from "./pages/Appointment";
import SewaZoomHarian from "./pages/SewaZoomHarian";

// Feature Pages
import BayarSesuaiPakai from "./pages/fitur/BayarSesuaiPakai";
import Dashboard from "./pages/fitur/Dashboard";
import RekamanCloud from "./pages/fitur/RekamanCloud";
import LaporanPeserta from "./pages/fitur/LaporanPeserta";

// Company Pages
import SyaratKetentuan from "./pages/SyaratKetentuan";
import KebijakanPrivasi from "./pages/KebijakanPrivasi";
import MenjadiReseller from "./pages/MenjadiReseller";

// Blog Pages (Simple static version)
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

// Admin Pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import BlogManagement from "./pages/admin/BlogManagement";
import ContentManagement from "./pages/admin/ContentManagement";
import ProtectedRoute from "./components/admin/ProtectedRoute";

// Sitemap
import SitemapXML from "./pages/SitemapXML";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view with Meta Pixel for non-admin pages
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  }, [location.pathname]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/main-page" element={<MainPage />} />
      <Route path="/meeting-scheduling" element={<MeetingScheduling />} />
      <Route path="/sewa-zoom-harian" element={<SewaZoomHarian />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/appointment" element={<Appointment />} />
      
      {/* Feature Pages */}
      <Route path="/fitur/bayar-sesuai-pakai" element={<BayarSesuaiPakai />} />
      <Route path="/fitur/dashboard" element={<Dashboard />} />
      <Route path="/fitur/rekaman-cloud" element={<RekamanCloud />} />
      <Route path="/fitur/laporan-peserta" element={<LaporanPeserta />} />
      
      {/* Company Pages */}
      <Route path="/syarat-ketentuan" element={<SyaratKetentuan />} />
      <Route path="/kebijakan-privasi" element={<KebijakanPrivasi />} />
      <Route path="/menjadi-reseller" element={<MenjadiReseller />} />
      <Route path="/tentang-kami" element={<TentangKami />} />
      <Route path="/kontak" element={<Kontak />} />
      
      {/* Blog Pages - Simple static version */}
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      
      {/* Sitemap */}
      <Route path="/sitemap.xml" element={<SitemapXML />} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/blog" element={<ProtectedRoute><BlogManagement /></ProtectedRoute>} />
      <Route path="/admin/content" element={<ProtectedRoute><ContentManagement /></ProtectedRoute>} />
      
      {/* 404 Catch-all Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
