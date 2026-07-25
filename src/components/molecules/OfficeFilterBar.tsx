import React from 'react';
import { Icon } from '../atoms/Icon';
import { Button } from '../atoms/Button';
import { OfficeZone, OfficeCondition, PropertyType } from '../../types';

export interface FilterState {
  searchQuery: string;
  zone: string;
  condition: string;
  type: string;
  sizeRange: string;
  sortBy: string;
}

interface OfficeFilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const OfficeFilterBar: React.FC<OfficeFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
}) => {
  const zones: { label: string; value: string }[] = [
    { label: 'Semua Zone', value: 'all' },
    { label: 'Low Zone (Fl 1-10)', value: 'Low Zone' },
    { label: 'Mid Zone (Fl 11-25)', value: 'Mid Zone' },
    { label: 'High Zone (Fl 26-36)', value: 'High Zone' },
    { label: 'Penthouse (Fl 37+)', value: 'Penthouse' },
  ];

  const conditions: { label: string; value: string }[] = [
    { label: 'Semua Kondisi', value: 'all' },
    { label: 'Fully Fitted', value: 'Fully Fitted' },
    { label: 'Semi-Fitted', value: 'Semi-Fitted' },
    { label: 'Bare Shell', value: 'Bare Shell' },
    { label: 'Serviced Office', value: 'Serviced Office' },
  ];

  const types: { label: string; value: string }[] = [
    { label: 'Semua Status', value: 'all' },
    { label: 'Disewakan (For Rent)', value: 'For Rent' },
    { label: 'Dijual (Strata Title)', value: 'For Sale' },
  ];

  const sizeRanges: { label: string; value: string }[] = [
    { label: 'Semua Ukuran', value: 'all' },
    { label: '< 150 m²', value: 'small' },
    { label: '150 - 300 m²', value: 'medium' },
    { label: '300 - 600 m²', value: 'large' },
    { label: '> 600 m² (Whole Floor)', value: 'whole' },
  ];

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.zone !== 'all' ||
    filters.condition !== 'all' ||
    filters.type !== 'all' ||
    filters.sizeRange !== 'all' ||
    filters.sortBy !== 'default';

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/15 p-6 md:p-8 rounded-xl shadow-sm mb-10">
      {/* Search Input Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Icon
            name="search"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]"
          />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Cari berdasarkan Kode Unit (misal KT-2801), Lantai, atau Spesifikasi..."
            className="w-full pl-12 pr-4 py-3.5 bg-surface border border-outline-variant/20 rounded-lg text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-heritage-red transition-colors text-body-md"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
            >
              <Icon name="close" className="text-[18px]" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="w-full md:w-64">
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value })}
            className="w-full px-4 py-3.5 bg-surface border border-outline-variant/20 rounded-lg text-on-surface focus:outline-none focus:border-heritage-red transition-colors font-label-md cursor-pointer"
          >
            <option value="default">Urutkan: Recomendasi</option>
            <option value="price-asc">Harga: Terendah ke Tertinggi</option>
            <option value="price-desc">Harga: Tertinggi ke Terendah</option>
            <option value="size-desc">Luas: Terluas ke Terkecil</option>
            <option value="size-asc">Luas: Terkecil ke Terluas</option>
            <option value="floor-desc">Lantai: Teratas ke Terbawah</option>
          </select>
        </div>
      </div>

      {/* Filter Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-outline-variant/10">
        {/* Zone Dropdown */}
        <div>
          <label className="block text-[11px] font-metadata uppercase tracking-wider text-on-surface-variant mb-2">
            Zone / Elevasi Lantai
          </label>
          <select
            value={filters.zone}
            onChange={(e) => onFilterChange({ zone: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-surface border border-outline-variant/20 rounded-md text-on-surface focus:outline-none focus:border-heritage-red text-body-sm cursor-pointer"
          >
            {zones.map((z) => (
              <option key={z.value} value={z.value}>
                {z.label}
              </option>
            ))}
          </select>
        </div>

        {/* Condition Dropdown */}
        <div>
          <label className="block text-[11px] font-metadata uppercase tracking-wider text-on-surface-variant mb-2">
            Kondisi Fit-Out
          </label>
          <select
            value={filters.condition}
            onChange={(e) => onFilterChange({ condition: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-surface border border-outline-variant/20 rounded-md text-on-surface focus:outline-none focus:border-heritage-red text-body-sm cursor-pointer"
          >
            {conditions.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Size Range Dropdown */}
        <div>
          <label className="block text-[11px] font-metadata uppercase tracking-wider text-on-surface-variant mb-2">
            Luas Unit (m²)
          </label>
          <select
            value={filters.sizeRange}
            onChange={(e) => onFilterChange({ sizeRange: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-surface border border-outline-variant/20 rounded-md text-on-surface focus:outline-none focus:border-heritage-red text-body-sm cursor-pointer"
          >
            {sizeRanges.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Type / Status Dropdown */}
        <div>
          <label className="block text-[11px] font-metadata uppercase tracking-wider text-on-surface-variant mb-2">
            Status Transaksi
          </label>
          <select
            value={filters.type}
            onChange={(e) => onFilterChange({ type: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-surface border border-outline-variant/20 rounded-md text-on-surface focus:outline-none focus:border-heritage-red text-body-sm cursor-pointer"
          >
            {types.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Bar & Reset Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-outline-variant/10">
        <div className="flex items-center gap-2 text-on-surface-variant text-body-sm">
          <span className="font-semibold text-on-surface">{totalResults}</span> unit kantor ditemukan
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 text-heritage-red hover:underline font-label-md text-body-sm transition-colors cursor-pointer"
          >
            <Icon name="restart_alt" className="text-[16px]" />
            Reset Filter
          </button>
        )}
      </div>
    </div>
  );
};
