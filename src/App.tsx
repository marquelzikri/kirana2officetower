import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HomePage } from './pages/HomePage';
import { PropertyListingPage } from './pages/PropertyListingPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import './tailwind.css';

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
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/properti" element={<PropertyListingPage />} />
          <Route path="/properti/:id" element={<PropertyDetailPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

