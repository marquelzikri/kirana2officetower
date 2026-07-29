import React from 'react';

import { FormSectionTitle } from '@/components/atoms/FormSectionTitle';
import { Icon } from '@/components/atoms/Icon';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';

interface PropertyMediaUploadFieldsProps {
  image: string;
  setImage: (val: string) => void;
  floorPlanImage: string;
  setFloorPlanImage: (val: string) => void;
  galleryImages: string[];
  isUploadingMain: boolean;
  isUploadingFloorPlan: boolean;
  isUploadingGallery: boolean;
  handleMainImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleFloorPlanUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleGalleryUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRemoveGalleryImage: (index: number) => void;
}

export const PropertyMediaUploadFields: React.FC<PropertyMediaUploadFieldsProps> = ({
  image,
  setImage,
  floorPlanImage,
  setFloorPlanImage,
  galleryImages,
  isUploadingMain,
  isUploadingFloorPlan,
  isUploadingGallery,
  handleMainImageUpload,
  handleFloorPlanUpload,
  handleGalleryUpload,
  handleRemoveGalleryImage,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4 border-b border-outline-variant/10 pb-2">
        <FormSectionTitle borderBottom={false}>Upload Media</FormSectionTitle>
        <span className="text-xs bg-emerald-500/10 text-emerald-700 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-500/20 flex items-center gap-1">
          <Icon name="cloud_upload" className="text-sm" /> S3 / R2 Bucket Enabled
        </span>
      </div>

      <div className="space-y-5">
        {/* 1. Main Property Image */}
        <div>
          <Label>Gambar Utama Unit (Main Cover Photo)</Label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl border border-outline-variant/30 bg-surface-variant/20">
            {image ? (
              <div className="relative group w-32 h-24 rounded-xl overflow-hidden border border-outline-variant/30 flex-shrink-0 bg-slate-100">
                <img src={image} alt="Preview Main" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-semibold px-2 py-1 bg-black/60 rounded">Preview</span>
                </div>
              </div>
            ) : (
              <div className="w-32 h-24 rounded-xl border-2 border-dashed border-outline-variant/40 flex flex-col items-center justify-center text-on-surface-variant flex-shrink-0">
                <Icon name="image" className="text-3xl text-outline-variant" />
                <span className="text-[11px]">Belum Ada</span>
              </div>
            )}

            <div className="flex-1 space-y-2 w-full">
              <div className="flex items-center space-x-2">
                <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded-xl bg-heritage-red text-white font-label-md font-bold hover:bg-heritage-red/90 transition-colors shadow-sm text-sm">
                  <Icon name={isUploadingMain ? 'sync' : 'cloud_upload'} className={`mr-2 ${isUploadingMain ? 'animate-spin' : ''}`} />
                  {isUploadingMain ? 'Mengunggah ke R2...' : 'Unggah File Gambar'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    disabled={isUploadingMain}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-on-surface-variant font-medium">atau gunakan URL di bawah</span>
              </div>

              <Input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/... atau /api/media/..."
                className="text-sm px-3.5 py-2"
              />
            </div>
          </div>
        </div>

        {/* 2. Gallery Images Upload */}
        <div>
          <Label>Galeri Foto Foto Interior & Eksterior</Label>
          <div className="p-4 rounded-2xl border border-outline-variant/30 bg-surface-variant/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-on-surface-variant font-medium">
                {galleryImages.length} foto tersimpan di galeri unit
              </span>
              <label className="cursor-pointer inline-flex items-center justify-center px-3.5 py-1.5 rounded-xl border border-heritage-red text-heritage-red font-label-md font-semibold hover:bg-heritage-red/10 transition-colors text-xs">
                <Icon name={isUploadingGallery ? 'sync' : 'add_photo_alternate'} className={`mr-1.5 ${isUploadingGallery ? 'animate-spin' : ''}`} />
                {isUploadingGallery ? 'Mengunggah...' : '+ Tambah Foto Galeri'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  disabled={isUploadingGallery}
                  className="hidden"
                />
              </label>
            </div>

            {galleryImages.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-2">
                {galleryImages.map((imgUrl, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-outline-variant/30 aspect-square bg-slate-100">
                    <img src={imgUrl} alt={`Galeri ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                      title="Hapus foto"
                    >
                      <Icon name="close" className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 3. Floor Plan Image Upload */}
        <div>
          <Label>Gambar Denah / Floor Plan</Label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl border border-outline-variant/30 bg-surface-variant/20">
            {floorPlanImage ? (
              <div className="relative group w-32 h-24 rounded-xl overflow-hidden border border-outline-variant/30 flex-shrink-0 bg-slate-100">
                <img src={floorPlanImage} alt="Floor Plan" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-32 h-24 rounded-xl border-2 border-dashed border-outline-variant/40 flex flex-col items-center justify-center text-on-surface-variant flex-shrink-0">
                <Icon name="architecture" className="text-3xl text-outline-variant" />
                <span className="text-[11px]">Tidak Ada</span>
              </div>
            )}

            <div className="flex-1 space-y-2 w-full">
              <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded-xl border border-outline-variant/40 bg-surface text-on-surface font-label-md font-semibold hover:bg-surface-variant/40 transition-colors shadow-sm text-sm">
                <Icon name={isUploadingFloorPlan ? 'sync' : 'upload_file'} className={`mr-2 ${isUploadingFloorPlan ? 'animate-spin' : ''}`} />
                {isUploadingFloorPlan ? 'Mengunggah Floor Plan...' : 'Unggah Floor Plan'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFloorPlanUpload}
                  disabled={isUploadingFloorPlan}
                  className="hidden"
                />
              </label>

              <Input
                type="text"
                value={floorPlanImage}
                onChange={(e) => setFloorPlanImage(e.target.value)}
                placeholder="https://images.unsplash.com/... atau /api/media/..."
                className="text-sm px-3.5 py-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
