import React from 'react';
import { SectionHeader } from '../atoms/SectionHeader';
import { PropertyCard } from '../molecules/PropertyCard';
import { Icon } from '../atoms/Icon';
import { featuredProperties } from '../../data/mockData';

export const FeaturedListingsSection: React.FC = () => {
  return (
    <section id="properti" className="py-section-gap-desktop bg-surface">
      <div className="max-w-container mx-auto px-4 md:px-margin-desktop">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-16 gap-6">
          <div>
            <SectionHeader caption="FEATURED LISTING" />
            <h2 className="font-headline-lg text-on-surface">Properti Unggulan</h2>
          </div>
          <a
            href="#properti"
            className="inline-flex items-center gap-2 text-on-surface font-label-md group"
          >
            SEMUA PROPERTI{' '}
            <Icon
              name="trending_flat"
              className="text-[18px] group-hover:translate-x-2 transition-transform"
            />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
};
