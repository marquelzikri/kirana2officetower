import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Footer } from '@/components/organisms/Footer';
import { Header } from '@/components/organisms/Header';
import { MobileMenu } from '@/components/organisms/MobileMenu';
import { useAuth } from '@/context/AuthContext';

export const OnboardingPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { onboardOwner, hasUsers, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If system already has users and current user is authenticated, go to /admin. If not authenticated and hasUsers === true, go to /login
  React.useEffect(() => {
    if (hasUsers === true) {
      if (isAuthenticated) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }
  }, [hasUsers, isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !password || !confirmPassword) {
      setErrorMsg('Semua kolom formulir wajib diisi.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password minimal harus 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi password tidak cocok.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      await onboardOwner({
        name: name.trim(),
        username: username.trim(),
        password,
      });
      navigate('/admin', { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mendaftarkan akun Owner.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col font-body-md antialiased text-on-surface">
      <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <main className="flex-grow flex items-center justify-center pt-28 pb-16 px-4 md:px-margin-desktop">
        <div className="w-full max-w-lg">
          {/* Main Theme Onboarding Card */}
          <div className="bg-white border border-outline-variant/30 rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden">
            {/* Top Heritage Red Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-heritage-red"></div>

            <div className="text-center mb-8 pt-2">
              <div className="w-16 h-16 bg-heritage-red/10 border border-heritage-red/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-heritage-red">
                <span className="material-symbols-outlined text-4xl">admin_panel_settings</span>
              </div>
              <span className="inline-block px-3 py-1 bg-heritage-red/10 text-heritage-red text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                Inisialisasi Sistem Pertama
              </span>
              <h1 className="font-headline-md text-2xl md:text-3xl text-on-surface tracking-tight">
                Registrasi Akun Owner Utama
              </h1>
              <p className="text-on-surface-variant text-sm mt-2 font-body-md">
                Sistem belum memiliki pengguna terdaftar. Silakan daftarkan akun <strong>Owner</strong> untuk mengelola seluruh aset properti dan peran administrator.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 bg-error-container/60 border border-error/30 rounded-xl flex items-start space-x-3 text-error text-sm">
                <span className="material-symbols-outlined text-lg shrink-0 mt-0.5">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Nama Lengkap Pemilik (Owner)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-xl">badge</span>
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Bapak Hendra Kirana"
                    className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:border-heritage-red focus:ring-1 focus:ring-heritage-red transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Username Owner
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-xl">person</span>
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Contoh: owner"
                    className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:border-heritage-red focus:ring-1 focus:ring-heritage-red transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 karakter"
                      className="w-full px-3.5 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:border-heritage-red focus:ring-1 focus:ring-heritage-red transition-all text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi password"
                      className="w-full px-3.5 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:border-heritage-red focus:ring-1 focus:ring-heritage-red transition-all text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-on-surface underline font-medium"
                >
                  {showPassword ? 'Sembunyikan Password' : 'Tampilkan Password'}
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-3.5 px-4 bg-heritage-red hover:bg-red-800 text-white font-bold rounded-xl shadow-md focus:outline-none active:scale-[0.99] transition-all disabled:opacity-50 text-sm flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Daftarkan Owner...</span>
                  </>
                ) : (
                  <span>Selesaikan Pendaftaran & Buat Akun Owner</span>
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
