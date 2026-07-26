import React from 'react';

import { AdminStatCard } from '@/pages/AdminPropertyPage/components/atoms/AdminStatCard';

interface AdminStatsGridProps {
  totalCount: number;
  forRentCount: number;
  forSaleCount: number;
}

export const AdminStatsGrid: React.FC<AdminStatsGridProps> = ({
  totalCount,
  forRentCount,
  forSaleCount,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <AdminStatCard
        title="Total Unit Listing"
        value={totalCount}
        subtext="Tersimpan di D1 Database"
        iconName="apartment"
        iconColorClass="text-heritage-red"
      />
      <AdminStatCard
        title="Disewakan"
        value={forRentCount}
        subtext="For Rent Category"
        iconName="key"
        iconColorClass="text-blue-600"
      />
      <AdminStatCard
        title="Dijual"
        value={forSaleCount}
        subtext="For Sale Category"
        iconName="sell"
        iconColorClass="text-amber-600"
      />
    </div>
  );
};
