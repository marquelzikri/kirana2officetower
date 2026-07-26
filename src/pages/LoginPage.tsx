import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Footer } from '@/components/organisms/Footer';
import { Header } from '@/components/organisms/Header';
import { MobileMenu } from '@/components/organisms/MobileMenu';
import { useAuth } from '@/context/AuthContext';

export const LoginPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, hasUsers } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin';

  // Redirect to /onboarding if no users exist, or to /admin if already authenticated
  React.useEffect(() => {
    if (hasUsers === false) {
      navigate('/onboarding', { replace: true });
    } else if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [hasUsers, isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMsg('Username dan password tidak boleh kosong.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      await login(username.trim(), password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal masuk. Periksa kembali credential Anda.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col font-body-md antialiased text-on-surface">
      <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <main className="flex-grow flex items-center justify-center pt-28 pb-16 px-4 md:px-margin-desktop">
        <div className="w-full max-w-md">
          {/* Main Theme Auth Card */}
          <div className="bg-white border border-outline-variant/30 rounded-2xl p-8 shadow-xl relative overflow-hidden">
            {/* Top Heritage Red Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-heritage-red"></div>

            <div className="text-center mb-8 pt-2">
              <div className="w-14 h-14 bg-heritage-red/10 border border-heritage-red/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-heritage-red">
                <span className="material-symbols-outlined text-3xl">lock</span>
              </div>
              <h1 className="font-headline-md text-2xl text-on-surface tracking-tight">Portal Log In Admin</h1>
              <p className="text-on-surface-variant text-sm mt-1 font-label-md">Kirana Two Office Tower Management</p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 bg-error-container/60 border border-error/30 rounded-xl flex items-start space-x-3 text-error text-sm">
                <span className="material-symbols-outlined text-lg shrink-0 mt-0.5">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-xl">person</span>
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username"
                    className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:border-heritage-red focus:ring-1 focus:ring-heritage-red transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-xl">key</span>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="w-full pl-11 pr-11 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:border-heritage-red focus:ring-1 focus:ring-heritage-red transition-all text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-heritage-red hover:bg-red-800 text-white font-bold rounded-xl shadow-md focus:outline-none active:scale-[0.99] transition-all disabled:opacity-50 text-sm flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  <span>Masuk ke Dashboard</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
