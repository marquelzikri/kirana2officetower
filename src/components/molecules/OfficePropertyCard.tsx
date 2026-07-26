import React from 'react';
import { Link } from 'react-router-dom';
import type { Property } from '@/types';
import { Badge } from '@/components/atoms/Badge';
import { Icon } from '@/components/atoms/Icon';

interface OfficePropertyCardProps {
  property: Property;
  onScheduleSurvey?: (property: Property) => void;
}

export const OfficePropertyCard: React.FC<OfficePropertyCardProps> = ({
  property,
  onScheduleSurvey,
}) => {
  const isSale = property.type === 'For Sale';

  return (
    <div className="group border border-outline-variant/15 overflow-hidden bg-surface-container-lowest transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full rounded-xl">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-container">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <Badge label={property.zone} variant="red" />
          <Badge label={property.condition} variant="white" />
        </div>

        {/* Status Tag */}
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-metadata uppercase tracking-wider">
          {property.type}
        </div>

        {/* Unit Code Tag */}
        <div className="absolute bottom-3 left-4 text-white font-metadata text-[12px] tracking-wide flex items-center gap-2">
          <Icon name="corporate_fare" className="text-[16px] text-heritage-red-light" />
          <span>Lantai {property.floor} • Unit {property.unitCode}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="font-headline-md text-on-surface mb-2 line-clamp-2 group-hover:text-heritage-red transition-colors">
          <Link to={`/properti/${property.id}`}>
            {property.title}
          </Link>
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-on-surface-variant text-[13px] mb-4">
          <Icon name="location_on" className="text-[15px] text-heritage-red shrink-0" />
          <span className="truncate">{property.location}</span>
        </div>

        {/* Key Specs Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 px-3 mb-5 bg-surface rounded-lg border border-outline-variant/10 text-center">
          <div>
            <span className="block text-[10px] font-metadata uppercase text-on-surface-variant/80">Luas NLA</span>
            <span className="font-semibold text-on-surface text-body-sm">{property.sizeSqm} m²</span>
          </div>
          <div>
            <span className="block text-[10px] font-metadata uppercase text-on-surface-variant/80">Plafon</span>
            <span className="font-semibold text-on-surface text-body-sm">{property.ceilingHeight || '2.80 m'}</span>
          </div>
          <div>
            <span className="block text-[10px] font-metadata uppercase text-on-surface-variant/80">View</span>
            <span className="font-semibold text-on-surface text-body-sm truncate block px-1" title={property.viewType}>
              {property.viewType ? property.viewType.split(' ')[0] : 'City'}
            </span>
          </div>
        </div>

        {/* Price Section */}
        <div className="mt-auto pt-4 border-t border-outline-variant/10 flex justify-between items-end mb-5">
          <div>
            <span className="block text-[10px] font-metadata uppercase tracking-wider text-on-surface-variant">
              {isSale ? 'HARGA STRATA TITLE' : 'BIAYA SEWA ESTIMA'}
            </span>
            <span className="font-headline-md text-heritage-red text-lg md:text-xl font-bold">
              {property.price}
            </span>
          </div>
          {property.rentalRateSqm && property.rentalRateSqm > 0 && (
            <div className="text-right">
              <span className="block text-[10px] font-metadata text-on-surface-variant">
                IDR {property.rentalRateSqm.toLocaleString()}/m²/bln
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            to={`/properti/${property.id}`}
            className="w-full text-center py-2.5 px-3 rounded-lg border border-outline-variant/30 text-on-surface font-label-md hover:bg-surface-container-high hover:border-on-surface/30 transition-all text-body-sm flex items-center justify-center gap-1.5"
          >
            <Icon name="visibility" className="text-[16px]" />
            Detail Unit
          </Link>

          <button
            onClick={() => onScheduleSurvey && onScheduleSurvey(property)}
            className="w-full text-center py-2.5 px-3 rounded-lg bg-heritage-red hover:bg-heritage-red-dark text-white font-label-md transition-all text-body-sm flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Icon name="calendar_month" className="text-[16px]" />
            Survey
          </button>
        </div>
      </div>
    </div>
  );
};
