import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isLoading, isAuthenticated, hasUsers } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-heritage-red border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-on-surface-variant font-medium">Memverifikasi sesi keamanan...</p>
        </div>
      </div>
    );
  }

  if (hasUsers === false) {
    return <Navigate to="/onboarding" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl border border-red-100 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            !
          </div>
          <h2 className="text-2xl font-bold text-navy mb-2">Akses Ditolak</h2>
          <p className="text-secondary mb-6 text-sm">
            Peran Anda (<span className="font-semibold capitalize text-navy">{user.role}</span>) tidak memiliki izin untuk menguji halaman ini.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-2.5 bg-navy text-white rounded-xl font-medium hover:bg-navy-light transition-all text-sm"
          >
            Kembali ke Beranda
          </a>
        </div>
      </div>
    );
  }

  return children;
};
