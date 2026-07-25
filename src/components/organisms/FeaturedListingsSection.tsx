import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '../atoms/SectionHeader';
import { OfficePropertyCard } from '../molecules/OfficePropertyCard';
import { ScheduleSurveyModal } from '../molecules/ScheduleSurveyModal';
import { Icon } from '../atoms/Icon';
import { useProperties } from '../../hooks/useProperties';
import { Property } from '../../types';

export const FeaturedListingsSection: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);

  const { data, isLoading } = useProperties();
  const properties = data?.properties ?? [];
  const featured = properties.filter((p) => p.featured).concat(properties.filter((p) => !p.featured)).slice(0, 3);

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

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="animate-pulse bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10 h-[420px] flex flex-col justify-between">
                <div className="w-full h-48 bg-surface-container rounded-xl mb-4" />
                <div className="h-6 bg-surface-container rounded w-3/4 mb-2" />
                <div className="h-4 bg-surface-container rounded w-1/2 mb-4" />
                <div className="h-10 bg-surface-container rounded w-full mt-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((property) => (
              <OfficePropertyCard
                key={property.id}
                property={property}
                onScheduleSurvey={handleScheduleSurvey}
              />
            ))}
          </div>
        )}
      </div>

      <ScheduleSurveyModal
        property={selectedProperty}
        isOpen={isSurveyModalOpen}
        onClose={() => setIsSurveyModalOpen(false)}
      />
    </section>
  );
};

