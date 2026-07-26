import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';

export const ContactHeaderSection: React.FC = () => {
  return (
    <section className="bg-surface-container-high py-12 md:py-16 border-b border-outline-variant/10 mb-12">
      <div className="max-w-container mx-auto px-4 md:px-margin-desktop">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-xs text-on-surface-variant font-label-md uppercase tracking-wider mb-3">
              <Link to="/" className="hover:text-heritage-red transition-colors">
                Beranda
              </Link>
              <span>/</span>
              <span className="text-heritage-red font-bold">Kontak</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold font-headline-md text-on-surface tracking-tight mb-4">
              Hubungi Kami
            </h1>
            <p className="text-on-surface-variant text-base max-w-2xl font-body-md">
              Punya pertanyaan seputar sewa unit kantor, ruang usaha, atau kerjasama investasi di Kirana Two Office Tower? Tim profesional kami siap membantu Anda.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Button
              asAnchor
              href="https://wa.me/6281188882938?text=Halo%20Kirana%20Two%20Office%20Tower%2C%20saya%20ingin%20bertanya%20informasi%20sewa"
              target="_blank"
              rel="noopener noreferrer"
              className="!bg-[#25D366] hover:!bg-[#128C7E] !text-white rounded-xl text-xs font-bold shadow-md flex items-center space-x-2 border-none px-5 py-3 transition-all cursor-pointer"
            >
              <Icon name="chat" className="text-lg" />
              <span>Chat WhatsApp Fast Response</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
