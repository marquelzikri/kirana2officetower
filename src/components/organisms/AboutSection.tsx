import React from 'react';

import boardroomImg from '@/assets/executive-boardroom.jpg';
import { Icon } from '@/components/atoms/Icon';
import { SectionHeader } from '@/components/atoms/SectionHeader';

export const AboutSection: React.FC = () => {
  return (
    <section id="tentang-kami" className="py-section-gap-desktop bg-surface">
      <div className="max-w-container mx-auto px-4 md:px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="order-2 md:order-1">
            <SectionHeader caption="TENTANG KAMI" />
            <h2 className="font-headline-lg text-on-surface mb-8 leading-snug">
              Konsultan properti yang dipercaya oleh investor dan pemilik bisnis Indonesia.
            </h2>
            <p className="font-body-md text-on-surface-variant mb-6">
              Kirana Two Office Marketing adalah perusahaan konsultan real estate dan investasi properti premium di Indonesia. Kami melayani seluruh spektrum aset — residensial, komersial, perkantoran, perhotelan, industri, retail, hingga pengembangan lahan strategis.
            </p>
            <p className="font-body-md text-on-surface-variant mb-10">
              Setiap engagement kami didasari oleh riset pasar mendalam, analisa investasi yang disiplin, dan komitmen jangka panjang kepada klien.
            </p>
            <a
              href="#layanan"
              className="inline-flex items-center gap-3 text-heritage-red font-label-md hover:gap-5 transition-all group"
            >
              SELENGKAPNYA{' '}
              <Icon name="trending_flat" className="text-[18px]" />
            </a>
          </div>

          <div className="order-1 md:order-2 relative">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={boardroomImg}
                alt="Executive Boardroom"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 border-l border-b border-heritage-red hidden lg:block"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
