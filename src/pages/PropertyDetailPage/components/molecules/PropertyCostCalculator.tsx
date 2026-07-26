import React from 'react';
import type { Property } from '@/types';
import { Icon } from '@/components/atoms/Icon';

interface PropertyCostCalculatorProps {
  property: Property;
}

export const PropertyCostCalculator: React.FC<PropertyCostCalculatorProps> = ({ property }) => {
  const isSale = property.type === 'For Sale';

  if (isSale || !property.rentalRateSqm || property.rentalRateSqm <= 0) {
    return null;
  }

  const rentCost = (property.rentalRateSqm || 0) * property.sizeSqm;
  const serviceChargeCost = (property.serviceChargeSqm || 0) * property.sizeSqm;
  const totalEstimatedMonthly = rentCost + serviceChargeCost;

  return (
    <div className="bg-surface-container-low border border-outline-variant/15 p-6 md:p-8 rounded-2xl">
      <h3 className="font-headline-md text-on-surface mb-2 flex items-center gap-2">
        <Icon name="calculate" className="text-heritage-red text-[22px]" />
        Simulasi Estimasi Biaya Sewa Bulanan
      </h3>
      <p className="text-on-surface-variant text-body-sm mb-6">
        Estimasi komprehensif berdasarkan tarif sewa dasar dan service charge pengelolaan gedung Kirana Two.
      </p>

      <div className="space-y-3 max-w-md bg-surface p-5 rounded-xl border border-outline-variant/10">
        <div className="flex justify-between text-body-sm">
          <span className="text-on-surface-variant">
            Base Rent ({property.sizeSqm} m² x IDR {property.rentalRateSqm.toLocaleString()}):
          </span>
          <span className="font-semibold text-on-surface">IDR {rentCost.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-body-sm">
          <span className="text-on-surface-variant">
            Service Charge ({property.sizeSqm} m² x IDR {(property.serviceChargeSqm || 0).toLocaleString()}):
          </span>
          <span className="font-semibold text-on-surface">IDR {serviceChargeCost.toLocaleString()}</span>
        </div>

        <div className="pt-3 border-t border-outline-variant/15 flex justify-between items-center text-body-md">
          <span className="font-bold text-on-surface">Total Biaya Bulanan (Est.):</span>
          <span className="font-bold text-heritage-red text-xl">
            IDR {totalEstimatedMonthly.toLocaleString()} / bln
          </span>
        </div>
      </div>
    </div>
  );
};
