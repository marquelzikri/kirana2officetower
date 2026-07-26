import React from 'react';

import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { AdminPropertyTableRow } from '@/pages/AdminPropertyPage/components/molecules/AdminPropertyTableRow';
import type { Property } from '@/types';

interface AdminPropertyTableProps {
  properties: Property[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry: () => void;
  onSeed: () => void;
  isSeeding: boolean;
  onCreateNew: () => void;
  onEdit: (property: Property) => void;
  onDelete: (property: Property) => void;
}

export const AdminPropertyTable: React.FC<AdminPropertyTableProps> = ({
  properties,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  onSeed,
  isSeeding,
  onCreateNew,
  onEdit,
  onDelete,
}) => {
  return (
    <>
      <Button
        variant="primary"
        onClick={onCreateNew}
        className="mb-1"
      >
        <Icon name="add" className="mr-2 text-lg" />
        Tambah Properti Baru
      </Button>

      <div className="bg-surface border border-outline-variant/20 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-on-surface-variant">
            <Icon name="sync" className="animate-spin text-4xl mb-3 text-heritage-red inline-block" />
            <p className="font-body-md font-medium">Memuat data...</p>
          </div>
        ) : isError ? (
          <div className="py-16 text-center text-red-600 p-6">
            <Icon name="error" className="text-5xl mb-3 inline-block" />
            <h3 className="font-heading-sm font-bold mb-1">Gagal Mengambil Data</h3>
            <p className="font-body-sm text-red-500 mb-4">{errorMessage}</p>
            <Button variant="outline" onClick={onRetry}>
              Coba Lagi
            </Button>
          </div>
        ) : properties.length === 0 ? (
          <div className="py-20 text-center text-on-surface-variant p-6">
            <Icon name="domain_disabled" className="text-6xl text-outline-variant mb-4 inline-block" />
            <h3 className="font-heading-sm font-bold text-on-surface mb-1">Tidak Ada Properti Ditemukan</h3>
            <p className="font-body-sm max-w-md mx-auto mb-6">
              Tidak ada listing properti yang sesuai dengan filter pencarian Anda atau database masih kosong.
            </p>
            <div className="flex items-center justify-center space-x-3">
              <Button variant="outline" onClick={onSeed} disabled={isSeeding}>
                Seed Default Data
              </Button>
              <Button variant="primary" onClick={onCreateNew}>
                Tambah Properti Baru
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-variant/40 border-b border-outline-variant/20 text-on-surface-variant font-label-md uppercase tracking-wider text-xs">
                  <th className="py-4 px-6 font-bold">Properti & Unit</th>
                  <th className="py-4 px-4 font-bold">Zona & Fit-Out</th>
                  <th className="py-4 px-4 font-bold">Lantai & Luas</th>
                  <th className="py-4 px-4 font-bold">Harga</th>
                  <th className="py-4 px-4 font-bold">Status</th>
                  <th className="py-4 px-6 font-bold text-right">Aksi (CRUD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 font-body-md text-on-surface">
                {properties.map((property) => (
                  <AdminPropertyTableRow
                    key={property.id}
                    property={property}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};
