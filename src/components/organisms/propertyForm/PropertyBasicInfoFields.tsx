import React from 'react';
import type { OfficeZone, OfficeCondition, PropertyType } from '@/types';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Label } from '@/components/atoms/Label';
import { FormSectionTitle } from '@/components/atoms/FormSectionTitle';

interface PropertyBasicInfoFieldsProps {
  title: string;
  setTitle: (val: string) => void;
  unitCode: string;
  setUnitCode: (val: string) => void;
  floor: number;
  setFloor: (val: number) => void;
  zone: OfficeZone;
  setZone: (val: OfficeZone) => void;
  condition: OfficeCondition;
  setCondition: (val: OfficeCondition) => void;
  type: PropertyType;
  setType: (val: PropertyType) => void;
  category: string;
  setCategory: (val: string) => void;
}

export const PropertyBasicInfoFields: React.FC<PropertyBasicInfoFieldsProps> = ({
  title,
  setTitle,
  unitCode,
  setUnitCode,
  floor,
  setFloor,
  zone,
  setZone,
  condition,
  setCondition,
  type,
  setType,
  category,
  setCategory,
}) => {
  return (
    <div>
      <FormSectionTitle>Informasi Dasar Unit</FormSectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label required>Judul Properti</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Kirana Two - High Zone Executive Suite"
            required
          />
        </div>

        <div>
          <Label required>Kode Unit</Label>
          <Input
            type="text"
            value={unitCode}
            onChange={(e) => setUnitCode(e.target.value)}
            placeholder="KT-2801"
            required
          />
        </div>

        <div>
          <Label>Lantai</Label>
          <Input
            type="number"
            value={floor}
            onChange={(e) => setFloor(Number(e.target.value))}
            min={1}
            max={50}
          />
        </div>

        <div>
          <Label>Zona Gedung</Label>
          <Select value={zone} onChange={(e) => setZone(e.target.value as OfficeZone)}>
            <option value="Low Zone">Low Zone</option>
            <option value="Mid Zone">Mid Zone</option>
            <option value="High Zone">High Zone</option>
            <option value="Penthouse">Penthouse</option>
          </Select>
        </div>

        <div>
          <Label>Kondisi Fit-Out</Label>
          <Select value={condition} onChange={(e) => setCondition(e.target.value as OfficeCondition)}>
            <option value="Bare Shell">Bare Shell</option>
            <option value="Semi-Fitted">Semi-Fitted</option>
            <option value="Fully Fitted">Fully Fitted</option>
            <option value="Serviced Office">Serviced Office</option>
          </Select>
        </div>

        <div>
          <Label>Tipe Transaksi</Label>
          <Select value={type} onChange={(e) => setType(e.target.value as PropertyType)}>
            <option value="For Rent">Disewakan (For Rent)</option>
            <option value="For Sale">Dijual (For Sale)</option>
          </Select>
        </div>

        <div>
          <Label>Kategori Space</Label>
          <Input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="High Zone Suite"
          />
        </div>
      </div>
    </div>
  );
};
