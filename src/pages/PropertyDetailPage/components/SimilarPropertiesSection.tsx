import React from 'react';
import { Link } from 'react-router-dom';
import type { Property } from '@/types';
import { Icon } from '@/components/atoms/Icon';
import { OfficePropertyCard } from '@/components/molecules/OfficePropertyCard';

interface SimilarPropertiesSectionProps {
  properties: Property[];
  totalCount: number;
  onScheduleSurvey: (property: Property) => void;
}

export const SimilarPropertiesSection: React.FC<SimilarPropertiesSectionProps> = ({
  properties,
  totalCount,
  onScheduleSurvey,
}) => {
  if (properties.length === 0) return null;

  return (
    <div className="mt-16 pt-12 border-t border-outline-variant/10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="font-metadata text-[11px] uppercase tracking-wider text-heritage-red font-semibold block mb-1">
            REKOMENDASI LAINNYA
          </span>
          <h3 className="font-headline-md text-on-surface text-2xl font-bold">
            Unit Kantor Lainnya di Kirana Two
          </h3>
        </div>
        <Link
          to="/properti"
          className="inline-flex items-center gap-2 text-on-surface hover:text-heritage-red font-label-md transition-colors"
        >
          Lihat Semua ({totalCount})
          <Icon name="arrow_forward" className="text-[16px]" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {properties.map((simProp) => (
          <OfficePropertyCard
            key={simProp.id}
            property={simProp}
            onScheduleSurvey={onScheduleSurvey}
          />
        ))}
      </div>
    </div>
  );
};
