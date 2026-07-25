import React from 'react';
import { SectionHeader } from '../atoms/SectionHeader';
import { Icon } from '../atoms/Icon';

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
              Inti Jaya Property adalah perusahaan konsultan real estate dan investasi properti premium di Indonesia. Kami melayani seluruh spektrum aset — residensial, komersial, perkantoran, perhotelan, industri, retail, hingga pengembangan lahan strategis.
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
                src="https://lh3.googleusercontent.com/aida/AP1WRLsGdjANP2OpwmNgi1CWyqAl83pkfm5F3xxmbJ5iB3YNVdecxXCQaG9e-wU3KzkThH9Me7RY5nVY9p5E_JPBgh-Y4z66oTrXcyrnsZfWHbGds-ZFCjD6sO2l6d-zyZH5x2fj1YU4mK98z90f_aSspRFj5m8PKcQDN4Lc_Ne-jeWB_5T98oRvnjsCX4wiGM6eT_ib03ko8tbc1pyFPdkn0ZEyUkv57vd7ge6JAbBBWXZQ5ZQVF65jEuEhpA"
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
