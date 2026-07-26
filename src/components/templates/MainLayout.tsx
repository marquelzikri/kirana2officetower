import React, { useState } from 'react';
import { Header } from '@/components/organisms/Header';
import { MobileMenu } from '@/components/organisms/MobileMenu';
import { Footer } from '@/components/organisms/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleOpenMobileMenu = () => setIsMobileMenuOpen(true);
  const handleCloseMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md selection:bg-heritage-red/20 flex flex-col">
      <Header onOpenMobileMenu={handleOpenMobileMenu} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={handleCloseMobileMenu} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};
