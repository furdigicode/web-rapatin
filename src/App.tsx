import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { useEffect, lazy, Suspense } from "react";
import { useMetaPixel } from "./hooks/useMetaPixel";

// Eager load: Index page (critical for LCP)
import Index from "./pages/Index";

// Lazy load: All other routes
const MainPage = lazy(() => import("./pages/MainPage"));
const MeetingScheduling = lazy(() => import("./pages/MeetingScheduling"));
const NotFound = lazy(() => import("./pages/NotFound"));
const FAQ = lazy(() => import("./pages/FAQ"));
const TentangKami = lazy(() => import("./pages/TentangKami"));
const Kontak = lazy(() => import("./pages/Kontak"));
const Appointment = lazy(() => import("./pages/Appointment"));
const SewaZoomHarian = lazy(() => import("./pages/SewaZoomHarian"));
const EventManagement = lazy(() => import("./pages/EventManagement"));

// Feature Pages - Lazy loaded
const BayarSesuaiPakai = lazy(() => import("./pages/fitur/BayarSesuaiPakai"));
const Dashboard = lazy(() => import("./pages/fitur/Dashboard"));
const RekamanCloud = lazy(() => import("./pages/fitur/RekamanCloud"));
const LaporanPeserta = lazy(() => import("./pages/fitur/LaporanPeserta"));

// Company Pages - Lazy loaded
const SyaratKetentuan = lazy(() => import("./pages/SyaratKetentuan"));
const KebijakanPrivasi = lazy(() => import("./pages/KebijakanPrivasi"));
const MenjadiReseller = lazy(() => import("./pages/MenjadiReseller"));

// Blog Pages - Lazy loaded
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));

// Voting Pages - Lazy loaded
const VotingDetail = lazy(() => import("./pages/VotingDetail"));

// Admin Pages - Lazy loaded (not critical for initial load)
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const BlogManagement = lazy(() => import("./pages/admin/BlogManagement"));
const ContentManagement = lazy(() => import("./pages/admin/ContentManagement"));
const CategoryManagementPage = lazy(() => import("./pages/admin/CategoryManagement"));
const NotificationManagementPage = lazy(() => import("./pages/admin/NotificationManagement"));
const ProtectedRoute = lazy(() => import("./components/admin/ProtectedRoute"));
const LegalManagement = lazy(() => import("./pages/admin/LegalManagement"));
const LegalTermsManagement = lazy(() => import("./pages/admin/LegalTermsManagement"));
const TrackingSettings = lazy(() => import("./pages/admin/TrackingSettings"));
const VotingManagement = lazy(() => import("./pages/admin/VotingManagement"));
const VotingCategoryManagement = lazy(() => import("./pages/admin/VotingCategoryManagement"));
const VotingResults = lazy(() => import("./pages/admin/VotingResults"));

// Sitemap - Lazy loaded
const SitemapXML = lazy(() => import("./pages/SitemapXML"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view with Meta Pixel for non-admin pages (handled by useMetaPixel hook now)
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  }, [location.pathname]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/main-page" element={<MainPage />} />
        <Route path="/meeting-scheduling" element={<MeetingScheduling />} />
        <Route path="/sewa-zoom-harian" element={<SewaZoomHarian />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/event-management" element={<EventManagement />} />
        
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
        
        {/* Voting Pages */}
        <Route path="/voting/:slug" element={<VotingDetail />} />
        
        {/* Sitemap */}
        <Route path="/sitemap.xml" element={<SitemapXML />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/blog" element={<ProtectedRoute><BlogManagement /></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute><CategoryManagementPage /></ProtectedRoute>} />
        <Route path="/admin/content" element={<ProtectedRoute><ContentManagement /></ProtectedRoute>} />
        <Route path="/admin/notifications" element={<ProtectedRoute><NotificationManagementPage /></ProtectedRoute>} />
        <Route path="/admin/legal" element={<ProtectedRoute><LegalManagement /></ProtectedRoute>} />
        <Route path="/admin/legal-terms" element={<ProtectedRoute><LegalTermsManagement /></ProtectedRoute>} />
        <Route path="/admin/tracking" element={<ProtectedRoute><TrackingSettings /></ProtectedRoute>} />
        <Route path="/admin/voting" element={<ProtectedRoute><VotingManagement /></ProtectedRoute>} />
        <Route path="/admin/voting/:id/results" element={<ProtectedRoute><VotingResults /></ProtectedRoute>} />
        <Route path="/admin/voting-categories" element={<ProtectedRoute><VotingCategoryManagement /></ProtectedRoute>} />
        
        {/* 404 Catch-all Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

function App() {
  // Initialize Meta Pixel from database settings
  useMetaPixel();

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRoutes />
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
