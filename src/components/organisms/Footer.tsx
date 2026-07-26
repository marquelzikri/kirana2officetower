import React from 'react';

import { Icon } from '@/components/atoms/Icon';
import { Logo } from '@/components/atoms/Logo';
import { ContactItem } from '@/components/molecules/ContactItem';
import { advisoryServices,navItems } from '@/data/mockData';

export const Footer: React.FC = () => {
  return (
    <footer id="kontak" className="bg-surface-container-high pt-section-gap-desktop pb-10">
      <div className="max-w-container mx-auto px-4 md:px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-20">
          {/* Branding */}
          <div className="col-span-1 md:col-span-1">
            <Logo className="h-12 mb-8 object-contain" />
            <p className="text-on-surface-variant font-body-md mb-8">
              Konsultan properti premium dan mitra investasi strategis di Indonesia — melayani sektor residensial, komersial, perhotelan, industri, dan lahan.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 border border-outline-variant/30 flex items-center justify-center hover:border-heritage-red hover:text-heritage-red transition-all text-on-surface-variant"
                aria-label="Website"
              >
                <Icon name="public" className="text-[20px]" />
              </a>
              <a
                href="#"
                className="w-10 h-10 border border-outline-variant/30 flex items-center justify-center hover:border-heritage-red hover:text-heritage-red transition-all text-on-surface-variant"
                aria-label="Share"
              >
                <Icon name="share" className="text-[20px]" />
              </a>
            </div>
          </div>

          {/* Menu */}
          <div className="col-span-1">
            <h4 className="font-label-md text-on-surface mb-8 tracking-widest uppercase">
              MENU
            </h4>
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-on-surface-variant hover:text-heritage-red transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <h4 className="font-label-md text-on-surface mb-8 tracking-widest uppercase">
              LAYANAN
            </h4>
            <ul className="space-y-4">
              {advisoryServices.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <a
                    href="#layanan"
                    className="text-on-surface-variant hover:text-heritage-red transition-colors"
                  >
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Head Office Contact */}
          <div className="col-span-1">
            <h4 className="font-label-md text-on-surface mb-8 tracking-widest uppercase">
              KANTOR PUSAT
            </h4>
            <ul className="space-y-6">
              <ContactItem icon="location_on">
                Menara Jaya, Lt. 24<br />
                Jl. Jend. Sudirman Kav. 21<br />
                Jakarta 12920, Indonesia
              </ContactItem>
              <ContactItem icon="call">
                +62 21 5000 8888
              </ContactItem>
              <ContactItem icon="mail">
                info@intijayaproperty.co.id
              </ContactItem>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-10 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-on-surface-variant text-label-sm">
            © 2026 PT Inti Jaya Property. All rights reserved.
          </p>
          <div className="flex gap-8 text-label-sm font-label-md tracking-widest text-on-surface-variant">
            <span>TRUST</span>
            <span>INVESTMENT</span>
            <span>GROWTH</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
