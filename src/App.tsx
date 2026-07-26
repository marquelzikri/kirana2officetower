import './tailwind.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

import { ProtectedRoute } from './components/organisms/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { AboutPage } from './pages/AboutPage';
import { AdminPropertyPage } from './pages/AdminPropertyPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { PropertyListingPage } from './pages/PropertyListingPage';
import { ServicesPage } from './pages/ServicesPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes cache
      refetchOnWindowFocus: false,
    },
  },
});

// Automatically scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/properti" element={<PropertyListingPage />} />
            <Route path="/properti/:id" element={<PropertyDetailPage />} />
            <Route path="/layanan" element={<ServicesPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/tentang-kami" element={<AboutPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/kontak" element={<ContactPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['owner', 'admin']}>
                  <AdminPropertyPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}


export default App;
