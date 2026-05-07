import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './context/LanguageContext';
import { WeatherProvider } from './context/WeatherContext';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';
import CustomCursor from './components/CustomCursor';
import SplashScreen from './components/SplashScreen';
import AnimatedBackground from './components/AnimatedBackground';
import usePageTracking from './hooks/usePageTracking';
import CookieConsent from './components/CookieConsent';

// Pages
import Home from './pages/public/Home';
const Products = lazy(() => import('./pages/public/Products'));
const About = lazy(() => import('./pages/public/About'));
const Contact = lazy(() => import('./pages/public/Contact'));
const BulkOrder = lazy(() => import('./pages/public/BulkOrder'));
const Customers = lazy(() => import('./pages/public/Customers'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const ManageCategories = lazy(() => import('./pages/admin/ManageCategories'));
const ManageCustomers = lazy(() => import('./pages/admin/ManageCustomers'));
const AddProduct = lazy(() => import('./pages/admin/AddProduct'));
const EditProduct = lazy(() => import('./pages/admin/EditProduct'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const PrivacyPolicy = lazy(() => import('./pages/public/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/public/TermsAndConditions'));
const Reviews = lazy(() => import('./pages/public/Reviews'));
const ManageReviews = lazy(() => import('./pages/admin/ManageReviews'));
const NotFound = lazy(() => import('./pages/public/NotFound'));




const ProtectedRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  if (loading) return null;
  return isAdmin ? children : <Navigate to="/admin-milku-secure-9281/login" />;
};

const PageSkeletonFallback = () => (
    <div className="fixed inset-0 bg-white z-[600] flex flex-col items-center pt-24 px-6 md:px-10 overflow-hidden">
        <div className="w-full max-w-[1400px] space-y-12 animate-pulse">
            
            {/* Nav & Title Setup Skeleton */}
            <div className="flex justify-between items-center w-full mb-10">
                <div className="w-32 h-10 bg-slate-100 rounded-xl" />
                <div className="hidden md:flex gap-6">
                    <div className="w-20 h-4 bg-slate-100 rounded" />
                    <div className="w-20 h-4 bg-slate-100 rounded" />
                    <div className="w-20 h-4 bg-slate-100 rounded" />
                </div>
            </div>

            {/* Giant Hero Block Skeleton */}
            <div className="w-full h-[30vh] md:h-[45vh] bg-slate-50 border border-slate-100 rounded-[40px] flex flex-col justify-center px-10 gap-6">
                <div className="w-1/2 md:w-1/3 h-12 bg-slate-200/50 rounded-2xl" />
                <div className="w-3/4 md:w-1/2 h-4 bg-slate-200/50 rounded" />
                <div className="w-2/3 md:w-1/3 h-4 bg-slate-200/50 rounded" />
                <div className="w-32 h-10 bg-slate-200/50 rounded-full mt-4" />
            </div>
            
            {/* Grid Features/Products Skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="w-full aspect-[4/5] bg-slate-50 border border-slate-100 rounded-[30px] p-6 flex flex-col justify-end gap-3">
                        <div className="w-3/4 h-6 bg-slate-200/50 rounded-lg" />
                        <div className="w-1/2 h-3 bg-slate-200/50 rounded" />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [pathname]);
    return null;
};

const AnimatedRoutes = ({ splashFinished }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // Redirect logic removed to allow direct linking and SEO indexing.

    return (
        <div className="relative w-full">
            <ScrollToTop />
            <AnimatePresence mode="wait">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full"
                >
                    <Suspense fallback={<PageSkeletonFallback />}>
                        <Routes location={location}>
                            <Route path="/" element={<Home splashFinished={splashFinished} />} />
                            <Route path="/products" element={<Products splashFinished={splashFinished} />} />
                            <Route path="/about" element={<About splashFinished={splashFinished} />} />
                            <Route path="/contact" element={<Contact splashFinished={splashFinished} />} />
                            <Route path="/bulk-order" element={<BulkOrder splashFinished={splashFinished} />} />
                            <Route path="/trusted-by" element={<Customers splashFinished={splashFinished} />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicy splashFinished={splashFinished} />} />
                            <Route path="/terms-conditions" element={<TermsAndConditions splashFinished={splashFinished} />} />
                            <Route path="/reviews" element={<Reviews splashFinished={splashFinished} />} />


                            <Route path="/admin-milku-secure-9281/login" element={<AdminLogin />} />
                            <Route path="/admin-milku-secure-9281/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

                            <Route path="/admin-milku-secure-9281/manage-categories" element={<ProtectedRoute><ManageCategories /></ProtectedRoute>} />
                            <Route path="/admin-milku-secure-9281/manage-customers" element={<ProtectedRoute><ManageCustomers /></ProtectedRoute>} />
                            <Route path="/admin-milku-secure-9281/manage-reviews" element={<ProtectedRoute><ManageReviews /></ProtectedRoute>} />
                            <Route path="/admin-milku-secure-9281/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
                            <Route path="/admin-milku-secure-9281/edit-product/:id" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
                            <Route path="/admin-milku-secure-9281/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Suspense>
                </motion.div>
            </AnimatePresence>

            {/* SYNCED BLOOM OVERLAY */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={`bloom-${location.pathname}`}
                    id="bloom-overlay"
                    className="fixed inset-0 bg-white z-[9000] pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ 
                        duration: 0.6, 
                        times: [0, 0.4, 1],
                        ease: "easeInOut"
                    }}
                />
            </AnimatePresence>
        </div>
    );
};

function AppContent({ showSplash, handleSplashDone, splashFinished }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin-milku-secure-9281');

  // GA4 Automated Page Tracking
  usePageTracking();

  return (
    <WeatherProvider>
      <ThemeProvider>
        <LanguageProvider>
          <div className="relative w-full overflow-hidden">
            <CookieConsent />
            <AnimatePresence mode="wait">
              {showSplash && <SplashScreen key="splash" onComplete={handleSplashDone} />}
            </AnimatePresence>
            <div className="relative min-h-screen bg-milku-bg-cream overflow-hidden font-sans">
              <AnimatedBackground />
              <div className="relative z-10 flex flex-col min-h-screen">
                <CustomCursor />
                {!isAdminRoute && <Navbar />}
                <main className="flex-grow">
                  <AnimatedRoutes splashFinished={splashFinished} />
                </main>
                {!isAdminRoute && <Footer />}
                {!isAdminRoute && <WhatsAppFloatingButton />}
              </div>
            </div>
          </div>
        </LanguageProvider>
      </ThemeProvider>
    </WeatherProvider>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [splashFinished, setSplashFinished] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSplashDone = () => {
    setShowSplash(false);
    setTimeout(() => setSplashFinished(true), 100);
  };

  return (
    <Router>
      <AppContent 
        showSplash={showSplash} 
        handleSplashDone={handleSplashDone} 
        splashFinished={splashFinished} 
      />
    </Router>
  );
}

export default App;
