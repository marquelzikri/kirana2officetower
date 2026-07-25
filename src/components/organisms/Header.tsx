import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../atoms/Logo';
import { Icon } from '../atoms/Icon';
import { Button } from '../atoms/Button';
import { navItems } from '../../data/mockData';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

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

        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => {
            const isActive =
              (item.href === '/' && location.pathname === '/') ||
              (item.href === '/properti' && location.pathname.startsWith('/properti'));

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
        </nav>

        <Button
          asAnchor
          href="/#kontak"
          variant="primary"
          className="hidden md:flex"
        >
          Hubungi Kami
        </Button>

        <button
          onClick={onOpenMobileMenu}
          className="md:hidden text-on-surface p-2 focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          <Icon name="menu" className="text-[28px]" />
        </button>
      </div>
    </header>
  );
};
