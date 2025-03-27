
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

const queryClient = new QueryClient();

const App = () => (
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
          
          {/* 404 Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
