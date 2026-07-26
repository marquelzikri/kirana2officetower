import React from 'react';
import { SectionHeader } from '@/components/atoms/SectionHeader';
import { CategoryCard } from '@/components/molecules/CategoryCard';
import { propertyCategories } from '@/data/mockData';

export const CategoriesSection: React.FC = () => {
  return (
    <section className="py-section-gap-desktop bg-surface-container-low border-y border-outline-variant/10">
      <div className="max-w-container mx-auto px-4 md:px-margin-desktop">
        <div className="mb-16">
          <SectionHeader caption="KATEGORI PROPERTI" />
          <h2 className="font-headline-lg text-on-surface">
            Portofolio lengkap untuk setiap kebutuhan investasi.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-outline-variant/20">
          {propertyCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};
