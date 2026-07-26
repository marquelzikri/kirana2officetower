import React, { useState } from 'react';

import { Icon } from '@/components/atoms/Icon';
import type { Property } from '@/types';

interface PropertyGallerySectionProps {
  property: Property;
}

export const PropertyGallerySection: React.FC<PropertyGallerySectionProps> = ({ property }) => {
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'floorplan'>('photos');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const gallery = property.galleryImages || [property.image];

  return (
    <div className="space-y-4">
      {/* Media Switcher Tabs */}
      <div className="flex gap-4 border-b border-outline-variant/10 pb-3">
        <button
          onClick={() => setActiveMediaTab('photos')}
          className={`flex items-center gap-2 font-label-md py-2 px-4 rounded-lg transition-all text-body-sm ${
            activeMediaTab === 'photos'
              ? 'bg-heritage-red text-white shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface bg-surface-container-low'
          }`}
        >
          <Icon name="photo_camera" className="text-[18px]" />
          Galeri Foto Unit ({gallery.length})
        </button>

        {property.floorPlanImage && (
          <button
            onClick={() => setActiveMediaTab('floorplan')}
            className={`flex items-center gap-2 font-label-md py-2 px-4 rounded-lg transition-all text-body-sm ${
              activeMediaTab === 'floorplan'
                ? 'bg-heritage-red text-white shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface bg-surface-container-low'
            }`}
          >
            <Icon name="architecture" className="text-[18px]" />
            Denah Floor Plan
          </button>
        )}
      </div>

      {/* Main Media Showcase */}
      <div className="relative aspect-[16/10] bg-black rounded-2xl overflow-hidden shadow-md">
        <img
          src={activeMediaTab === 'photos' ? gallery[activeImageIndex] : property.floorPlanImage}
          alt={property.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gallery Thumbnails */}
      {activeMediaTab === 'photos' && gallery.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {gallery.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`relative w-24 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                activeImageIndex === idx ? 'border-heritage-red scale-105' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
