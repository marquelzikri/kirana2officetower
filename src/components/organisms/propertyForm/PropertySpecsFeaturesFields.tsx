import React from 'react';

import { Checkbox } from '@/components/atoms/Checkbox';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Textarea } from '@/components/atoms/Textarea';

interface PropertySpecsFeaturesFieldsProps {
  viewType: string;
  setViewType: (val: string) => void;
  electricityCapacity: string;
  setElectricityCapacity: (val: string) => void;
  features: string;
  setFeatures: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  featured: boolean;
  setFeatured: (val: boolean) => void;
}

export const PropertySpecsFeaturesFields: React.FC<PropertySpecsFeaturesFieldsProps> = ({
  viewType,
  setViewType,
  electricityCapacity,
  setElectricityCapacity,
  features,
  setFeatures,
  description,
  setDescription,
  featured,
  setFeatured,
}) => {
  return (
    <div className="space-y-4">
      {/* Specs: View & Electricity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Pemandangan (View)</Label>
          <Input
            type="text"
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            placeholder="City Skyline North & Sea View"
          />
        </div>

        <div>
          <Label>Kapasitas Listrik</Label>
          <Input
            type="text"
            value={electricityCapacity}
            onChange={(e) => setElectricityCapacity(e.target.value)}
            placeholder="45 kVA"
          />
        </div>
      </div>

      <div>
        <Label>Fitur Unit (Satu fitur per baris)</Label>
        <Textarea
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          rows={3}
          placeholder="Akses Lift Penumpang Kecepatan Tinggi&#10;AC VRV Independen&#10;Ruang Rapat Terpisah"
          className="font-mono text-sm"
        />
      </div>

      <div>
        <Label>Deskripsi Lengkap</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Tulis deskripsi mendalam mengenai unit perkantoran ini..."
        />
      </div>

      <div className="pt-2">
        <Checkbox
          id="featured-checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          label={
            <>
              Tampilkan sebagai <strong className="text-heritage-red">Properti Unggulan (Featured)</strong> di Beranda
            </>
          }
        />
      </div>
    </div>
  );
};
