import React from 'react';

import { Icon } from '@/components/atoms/Icon';
import type { Property } from '@/types';

interface AdminPropertyTableRowProps {
  property: Property;
  onEdit: (property: Property) => void;
  onDelete: (property: Property) => void;
}

export const AdminPropertyTableRow: React.FC<AdminPropertyTableRowProps> = ({
  property,
  onEdit,
  onDelete,
}) => {
  return (
    <tr className="hover:bg-surface-variant/20 transition-colors">
      {/* Title & Image */}
      <td className="py-4 px-6">
        <div className="flex items-center space-x-4">
          <img
            src={property.image}
            alt={property.title}
            className="w-16 h-12 object-cover rounded-lg border border-outline-variant/20 flex-shrink-0"
          />
          <div>
            <a
              href={`/properti/${property.id}`}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-on-surface hover:text-heritage-red transition-colors line-clamp-1"
            >
              {property.title}
            </a>
            <div className="flex items-center space-x-2 text-xs text-on-surface-variant mt-0.5">
              <span className="font-mono bg-surface-variant/60 px-1.5 py-0.5 rounded font-semibold text-on-surface">
                {property.unitCode}
              </span>
              <span>•</span>
              <span>{property.category}</span>
            </div>
          </div>
        </div>
      </td>

      {/* Zone & Condition */}
      <td className="py-4 px-4">
        <div className="space-y-1">
          <span className="inline-block bg-heritage-red/10 text-heritage-red font-semibold text-xs px-2.5 py-0.5 rounded-full">
            {property.zone}
          </span>
          <div className="text-xs text-on-surface-variant font-medium">
            {property.condition}
          </div>
        </div>
      </td>

      {/* Floor & Size */}
      <td className="py-4 px-4">
        <div className="font-semibold text-on-surface">
          Lantai {property.floor}
        </div>
        <div className="text-xs text-on-surface-variant">
          {property.sizeSqm} m² ({property.area})
        </div>
      </td>

      {/* Price */}
      <td className="py-4 px-4">
        <div className="font-bold text-heritage-red text-sm">
          {property.price}
        </div>
        <div className="text-[11px] text-on-surface-variant">
          {property.type}
        </div>
      </td>

      {/* Status / Featured */}
      <td className="py-4 px-4">
        {property.featured ? (
          <span className="inline-flex items-center space-x-1 text-amber-600 bg-amber-500/10 border border-amber-500/20 text-xs px-2.5 py-0.5 rounded-full font-bold">
            <Icon name="star" className="text-xs fill-current" />
            <span>Featured</span>
          </span>
        ) : (
          <span className="text-xs text-on-surface-variant/60 font-medium">Standard</span>
        )}
      </td>

      {/* Actions */}
      <td className="py-4 px-6 text-right">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => onEdit(property)}
            className="p-2 text-blue-600 hover:bg-blue-500/10 rounded-xl transition-colors"
            title="Edit Properti"
          >
            <Icon name="edit" className="text-xl" />
          </button>
          <button
            onClick={() => onDelete(property)}
            className="p-2 text-red-600 hover:bg-red-500/10 rounded-xl transition-colors"
            title="Hapus Properti"
          >
            <Icon name="delete" className="text-xl" />
          </button>
        </div>
      </td>
    </tr>
  );
};
