import React from 'react';
import { Icon } from '@/components/atoms/Icon';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';

interface AdminFilterToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  zoneFilter: string;
  onZoneChange: (value: string) => void;
  conditionFilter: string;
  onConditionChange: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
}

export const AdminFilterToolbar: React.FC<AdminFilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  zoneFilter,
  onZoneChange,
  conditionFilter,
  onConditionChange,
  typeFilter,
  onTypeChange,
}) => {
  return (
    <div className="bg-surface border border-outline-variant/20 p-4 md:p-6 rounded-2xl shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="relative w-full md:w-80">
        <Icon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant z-10" />
        <Input
          type="text"
          placeholder="Cari judul, unit, lantai, lokasi..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 font-body-md"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <Select
          value={zoneFilter}
          onChange={(e) => onZoneChange(e.target.value)}
          className="w-auto font-body-sm"
        >
          <option value="all">Semua Zona Gedung</option>
          <option value="Low Zone">Low Zone</option>
          <option value="Mid Zone">Mid Zone</option>
          <option value="High Zone">High Zone</option>
          <option value="Penthouse">Penthouse</option>
        </Select>

        <Select
          value={conditionFilter}
          onChange={(e) => onConditionChange(e.target.value)}
          className="w-auto font-body-sm"
        >
          <option value="all">Semua Kondisi Fit-Out</option>
          <option value="Bare Shell">Bare Shell</option>
          <option value="Semi-Fitted">Semi-Fitted</option>
          <option value="Fully Fitted">Fully Fitted</option>
          <option value="Serviced Office">Serviced Office</option>
        </Select>

        <Select
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value)}
          className="w-auto font-body-sm"
        >
          <option value="all">Semua Tipe Transaksi</option>
          <option value="For Rent">Disewakan</option>
          <option value="For Sale">Dijual</option>
        </Select>
      </div>
    </div>
  );
};
