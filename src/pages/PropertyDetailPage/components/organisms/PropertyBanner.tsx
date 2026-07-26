import React from 'react';
import { Link } from 'react-router-dom';

import { Badge } from '@/components/atoms/Badge';
import { Icon } from '@/components/atoms/Icon';
import type { Property } from '@/types';

interface PropertyBannerProps {
  property: Property;
}

export const PropertyBanner: React.FC<PropertyBannerProps> = ({ property }) => {
  const isSale = property.type === 'For Sale';

  return (
    <section className="pt-24 pb-8 bg-surface-container-low border-b border-outline-variant/10">
      <div className="max-w-container mx-auto px-4 md:px-margin-desktop">
        <nav className="flex items-center gap-2 text-on-surface-variant text-body-sm mb-4">
          <Link to="/" className="hover:text-heritage-red transition-colors">
            Beranda
          </Link>
          <Icon name="chevron_right" className="text-[14px]" />
          <Link to="/properti" className="hover:text-heritage-red transition-colors">
            Properti
          </Link>
          <Icon name="chevron_right" className="text-[14px]" />
          <span className="text-on-surface font-semibold truncate">{property.unitCode}</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge label={property.zone} variant="red" />
              <Badge label={property.condition} variant="white" />
              <span className="bg-black/80 text-white px-3 py-1 rounded-full text-[11px] font-metadata uppercase tracking-wider">
                {property.type}
              </span>
            </div>
            <h1 className="font-headline-lg text-on-surface text-2xl md:text-4xl font-bold mb-2">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-on-surface-variant text-body-sm">
              <Icon name="location_on" className="text-heritage-red text-[18px]" />
              <span>{property.location}</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/15 p-4 rounded-xl shadow-sm text-right min-w-[240px]">
            <span className="block text-[11px] font-metadata uppercase tracking-wider text-on-surface-variant mb-1">
              {isSale ? 'HARGA STRATA TITLE' : 'ESTIMASI HARGA SEWA'}
            </span>
            <span className="font-headline-md text-heritage-red text-2xl font-bold block">
              {property.price}
            </span>
            {property.rentalRateSqm && property.rentalRateSqm > 0 && (
              <span className="text-body-sm text-on-surface-variant block mt-1">
                IDR {property.rentalRateSqm.toLocaleString()} / m² / bulan
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
