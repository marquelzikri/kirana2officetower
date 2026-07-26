import React from 'react';

import { FormSectionTitle } from '@/components/atoms/FormSectionTitle';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';

interface PropertySizePricingFieldsProps {
  sizeSqm: number;
  setSizeSqm: (val: number) => void;
  price: string;
  setPrice: (val: string) => void;
  numericPrice: number;
  setNumericPrice: (val: number) => void;
}

export const PropertySizePricingFields: React.FC<PropertySizePricingFieldsProps> = ({
  sizeSqm,
  setSizeSqm,
  price,
  setPrice,
  numericPrice,
  setNumericPrice,
}) => {
  return (
    <div>
      <FormSectionTitle>Ukuran & Spesifikasi Harga</FormSectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label required>Luas Space (m²)</Label>
          <Input
            type="number"
            value={sizeSqm}
            onChange={(e) => setSizeSqm(Number(e.target.value))}
            min={10}
            required
          />
        </div>

        <div>
          <Label required>Harga Format Teks</Label>
          <Input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="IDR 83.6 Juta / bulan"
            required
          />
        </div>

        <div>
          <Label>Harga Numerik (IDR)</Label>
          <Input
            type="number"
            value={numericPrice}
            onChange={(e) => setNumericPrice(Number(e.target.value))}
            min={0}
            step={1000000}
          />
        </div>
      </div>
    </div>
  );
};
