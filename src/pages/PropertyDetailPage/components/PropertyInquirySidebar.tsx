import React from 'react';
import { Icon } from '@/components/atoms/Icon';

interface PropertyInquirySidebarProps {
  onOpenSurveyModal: () => void;
}

export const PropertyInquirySidebar: React.FC<PropertyInquirySidebarProps> = ({ onOpenSurveyModal }) => {
  return (
    <div className="space-y-6">
      <div className="bg-surface-container-lowest border border-outline-variant/20 p-6 md:p-8 rounded-2xl shadow-lg sticky top-28">
        <div className="border-b border-outline-variant/10 pb-4 mb-6">
          <span className="font-metadata text-[11px] uppercase tracking-wider text-heritage-red block mb-1">
            TERHUBUNG DENGAN ADVISORY TEAM
          </span>
          <h3 className="font-headline-md text-on-surface text-xl font-bold">
            Tertarik dengan Unit Ini?
          </h3>
          <p className="text-on-surface-variant text-body-sm mt-1">
            Dapatkan penawaran resmi, spesifikasi lengkap PDF, atau jadwalkan survey fisik langsung.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <button
            onClick={onOpenSurveyModal}
            className="w-full py-3.5 px-4 rounded-xl bg-heritage-red hover:bg-heritage-red-dark text-white font-label-md transition-all shadow-md flex items-center justify-center gap-2 text-body-md"
          >
            <Icon name="calendar_month" className="text-[20px]" />
            Jadwalkan Survey Unit
          </button>

          <a
            href="https://wa.me/6281234567890?text=Halo%20Kirana%20Two%20Office%20Tower,%20saya%20tertarik%20dengan%20unit%20"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl border border-outline-variant/30 text-on-surface font-label-md hover:bg-surface-container transition-all flex items-center justify-center gap-2 text-body-md"
          >
            <Icon name="chat" className="text-[20px] text-green-600" />
            Hubungi via WhatsApp
          </a>
        </div>

        <div className="pt-4 border-t border-outline-variant/10 space-y-3 text-body-sm text-on-surface-variant">
          <div className="flex items-center gap-3">
            <Icon name="call" className="text-heritage-red text-[18px]" />
            <span>Hotline: +62 21 458 8899</span>
          </div>
          <div className="flex items-center gap-3">
            <Icon name="mail" className="text-heritage-red text-[18px]" />
            <span>Leasing: leasing@kiranatwo.com</span>
          </div>
          <div className="flex items-center gap-3">
            <Icon name="schedule" className="text-heritage-red text-[18px]" />
            <span>Jam Operasional: Sen - Jum (08:30 - 17:30)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
