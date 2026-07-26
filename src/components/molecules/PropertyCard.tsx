import React from 'react';
import type { Property } from '@/types';
import { Badge } from '@/components/atoms/Badge';
import { Icon } from '@/components/atoms/Icon';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <div className="group border border-outline-variant/10 overflow-hidden bg-surface-container-lowest transition-all hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge label={property.category} variant="red" />
          <Badge label={property.type} variant="white" />
        </div>
      </div>
      <div className="p-8">
        <div className="flex items-center gap-2 text-on-surface-variant mb-3">
          <Icon name="location_on" className="text-[14px]" />
          <span className="font-metadata text-[12px] uppercase tracking-wide">
            {property.location}
          </span>
        </div>
        <h3 className="font-headline-md text-on-surface mb-4 group-hover:text-heritage-red transition-colors">
          {property.title}
        </h3>
        <div className="mb-6">
          <p className="font-metadata text-on-surface-variant text-[12px] mb-1">
            STARTING FROM
          </p>
          <p className="font-headline-md text-heritage-red">{property.price}</p>
        </div>
        <div className="flex gap-6 border-t border-outline-variant/10 pt-6">
          {property.bathrooms !== undefined && (
            <div className="flex items-center gap-2">
              <Icon name="bathtub" className="text-[18px] text-on-surface-variant" />
              <span className="font-metadata text-on-surface-variant text-[12px]">
                {property.bathrooms} BA
              </span>
            </div>
          )}
          {property.bedrooms !== undefined && (
            <div className="flex items-center gap-2">
              <Icon name="bed" className="text-[18px] text-on-surface-variant" />
              <span className="font-metadata text-on-surface-variant text-[12px]">
                {property.bedrooms} BR
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Icon name="straighten" className="text-[18px] text-on-surface-variant" />
            <span className="font-metadata text-on-surface-variant text-[12px]">
              {property.area}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
