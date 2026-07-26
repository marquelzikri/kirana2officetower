import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Icon } from '@/components/atoms/Icon';
import { Logo } from '@/components/atoms/Logo';
import { useAuth } from '@/context/AuthContext';
import { navItems } from '@/data/mockData';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header
      id="top-nav"
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-outline-variant/10 h-20 ${
        isScrolled
          ? 'bg-white shadow-md'
          : 'bg-surface/90 backdrop-blur-md'
      }`}
    >
      <div className="flex justify-between items-center max-w-container mx-auto h-full px-4 md:px-margin-desktop">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => {
            const isActive =
              (item.href === '/' && location.pathname === '/') ||
              (item.href !== '/' && location.pathname.startsWith(item.href));

            return (
              <Link
                key={item.label}
                to={item.href}
                className={`font-label-md transition-colors ${
                  isActive
                    ? 'text-heritage-red border-b-2 border-heritage-red pb-1 font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* User Auth Section */}
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-3 border-l border-slate-200 pl-6">
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-navy truncate max-w-[120px]">{user.name}</span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-white self-end ${
                    user.role === 'owner' ? 'bg-purple-600' : 'bg-blue-600'
                  }`}
                >
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1"
                title="Keluar / Logout"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                <span>Keluar</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-heritage-red hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5"
            >
              <span className="material-symbols-outlined text-sm">login</span>
              <span>Login Admin</span>
            </Link>
          )}
        </nav>

        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden text-on-surface p-2 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <Icon name="menu" className="text-[28px]" />
          </button>
        )}
      </div>
    </header>
  );
};
