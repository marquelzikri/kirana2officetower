import React from 'react';
import type { Property } from '@/types';
import { Icon } from '@/components/atoms/Icon';
import { PropertySpecItem } from '../atoms/PropertySpecItem';

interface PropertySpecsSectionProps {
  property: Property;
}

export const PropertySpecsSection: React.FC<PropertySpecsSectionProps> = ({ property }) => {
  const specs = [
    { label: 'Luas NLA', value: `${property.sizeSqm} m²` },
    { label: 'Elevasi Zone', value: `Lantai ${property.floor}` },
    { label: 'Tinggi Plafon', value: property.ceilingHeight || '2.80 m' },
    { label: 'Daya Listrik', value: property.electricityCapacity || '35 kVA' },
    { label: 'Kondisi Fit-out', value: property.condition },
    { label: 'Rasio Parkir', value: property.parkingRatio || '1 : 100 m²' },
    {
      label: 'Service Charge',
      value: property.serviceChargeSqm ? `IDR ${property.serviceChargeSqm.toLocaleString()}/m²` : 'Included',
    },
    { label: 'Pemandangan', value: property.viewType || 'City View' },
  ];

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/15 p-6 md:p-8 rounded-2xl">
      <h3 className="font-headline-md text-on-surface mb-6 flex items-center gap-2">
        <Icon name="tune" className="text-heritage-red text-[22px]" />
        Spesifikasi Teknis Unit & Gedung
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {specs.map((item, index) => (
          <PropertySpecItem key={index} label={item.label} value={item.value} />
        ))}
      </div>
    </div>
  );
};
