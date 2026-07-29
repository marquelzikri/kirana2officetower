import React from 'react';

import ctaBg from '@/assets/cta-bg.jpg';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { SectionHeader } from '@/components/atoms/SectionHeader';

export const CTASection: React.FC = () => {
  return (
    <section className="relative h-[600px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 luxury-overlay z-10"></div>
        <img
          src={ctaBg}
          alt="Corporate Boardroom"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-20 max-w-container mx-auto w-full px-4 md:px-margin-desktop">
        <div className="max-w-2xl">
          <SectionHeader caption="INVESTMENT ADVISORY" />
          <h2 className="font-headline-lg text-on-surface mb-8">
            Siap Menemukan Properti Terbaik untuk Investasi Anda?
          </h2>
          <p className="font-body-lg text-on-surface-variant mb-12">
            Diskusikan tujuan investasi Anda dengan konsultan senior kami. Kami akan menghubungi Anda dalam satu hari kerja.
          </p>
          <Button
            asAnchor
            href="kontak"
            variant="primary"
            size="lg"
            className="group gap-4"
          >
            HUBUNGI KONSULTAN{' '}
            <Icon
              name="trending_flat"
              className="group-hover:translate-x-2 transition-transform"
            />
          </Button>
        </div>
      </div>
    </section>
  );
};
