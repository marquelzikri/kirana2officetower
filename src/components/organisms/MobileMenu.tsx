import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { Logo } from '@/components/atoms/Logo';
import { navItems } from '@/data/mockData';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-surface transition-transform duration-500 ease-in-out md:hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full p-6">
        <div className="flex justify-between items-center mb-12">
          <Logo className="h-8 w-auto object-contain" />
          <button
            onClick={onClose}
            className="text-on-surface p-2 hover:bg-surface-container-low transition-colors rounded-full focus:outline-none"
            aria-label="Close Mobile Menu"
          >
            <Icon name="close" className="text-[32px]" />
          </button>
        </div>

        <nav className="flex flex-col gap-8">
          {navItems.map((item) => {
            const isActive =
              (item.href === '/' && location.pathname === '/') ||
              (item.href === '/properti' && location.pathname.startsWith('/properti'));

            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={onClose}
                className={`font-headline-md transition-colors ${
                  isActive ? 'text-heritage-red font-bold' : 'text-on-surface hover:text-heritage-red'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6">
          <Button
            asAnchor
            href="/kontak"
            variant="primary"
            className="w-full text-center justify-center py-5"
            onClick={onClose}
          >
            HUBUNGI KAMI
          </Button>
        </div>

      </div>
    </div>
  );
};
