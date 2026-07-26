import React from 'react';

import { SectionHeader } from '@/components/atoms/SectionHeader';
import { ServiceCard } from '@/components/molecules/ServiceCard';
import { advisoryServices } from '@/data/mockData';

export const ServicesSection: React.FC = () => {
  return (
    <section id="layanan" className="py-section-gap-desktop bg-surface-container-low">
      <div className="max-w-container mx-auto px-4 md:px-margin-desktop">
        <div className="mb-16">
          <SectionHeader caption="LAYANAN KAMI" />
          <h2 className="font-headline-lg text-on-surface">
            Layanan konsultasi menyeluruh untuk properti dan investasi.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {advisoryServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};
