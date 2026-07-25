import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '../atoms/SectionHeader';
import { OfficePropertyCard } from '../molecules/OfficePropertyCard';
import { ScheduleSurveyModal } from '../molecules/ScheduleSurveyModal';
import { Icon } from '../atoms/Icon';
import { featuredProperties } from '../../data/mockData';
import { Property } from '../../types';

export const FeaturedListingsSection: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);

  const handleScheduleSurvey = (property: Property) => {
    setSelectedProperty(property);
    setIsSurveyModalOpen(true);
  };

  return (
    <section id="properti" className="py-section-gap-desktop bg-surface">
      <div className="max-w-container mx-auto px-4 md:px-margin-desktop">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-16 gap-6">
          <div>
            <SectionHeader caption="FEATURED OFFICE SUITES" />
            <h2 className="font-headline-lg text-on-surface">Unit Kantor Unggulan</h2>
          </div>
          <Link
            to="/properti"
            className="inline-flex items-center gap-2 text-heritage-red font-bold font-label-md group hover:underline"
          >
            LIHAT SEMUA KETERSEDIAAN UNIT{' '}
            <Icon
              name="trending_flat"
              className="text-[18px] group-hover:translate-x-2 transition-transform"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <OfficePropertyCard
              key={property.id}
              property={property}
              onScheduleSurvey={handleScheduleSurvey}
            />
          ))}
        </div>
      </div>

      <ScheduleSurveyModal
        property={selectedProperty}
        isOpen={isSurveyModalOpen}
        onClose={() => setIsSurveyModalOpen(false)}
      />
    </section>
  );
};
