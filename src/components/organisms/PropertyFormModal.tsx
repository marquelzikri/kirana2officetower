import React from 'react';

import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { PropertyBasicInfoFields } from '@/components/organisms/propertyForm/PropertyBasicInfoFields';
import { PropertyMediaUploadFields } from '@/components/organisms/propertyForm/PropertyMediaUploadFields';
import { PropertySizePricingFields } from '@/components/organisms/propertyForm/PropertySizePricingFields';
import { PropertySpecsFeaturesFields } from '@/components/organisms/propertyForm/PropertySpecsFeaturesFields';
import { usePropertyForm } from '@/hooks/usePropertyForm';
import type { Property } from '@/types';

export interface PropertyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Property>) => Promise<void>;
  initialData?: Property | null;
  isLoading?: boolean;
}

export const PropertyFormModal: React.FC<PropertyFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const { state, setters, handlers } = usePropertyForm({ initialData, isOpen, onSubmit });

  if (!isOpen) return null;

  const isUploading = state.isUploadingMain || state.isUploadingGallery || state.isUploadingFloorPlan;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-surface rounded-2xl border border-outline-variant/20 shadow-2xl w-full max-w-3xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-outline-variant/10 flex items-center justify-between bg-surface-variant/30">
          <div>
            <h3 className="font-heading-md font-bold text-on-surface">
              {initialData ? 'Edit Properti Listing' : 'Tambah Properti Baru'}
            </h3>
            <p className="font-body-sm text-on-surface-variant">
              {initialData ? `Mengubah data unit ${initialData.unitCode}` : 'Isi formulir berikut untuk menambah unit perkantoran.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-outline-variant/10 transition-colors"
          >
            <Icon name="close" className="text-2xl" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handlers.handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          {state.errorMsg && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-sm font-medium">
              {state.errorMsg}
            </div>
          )}

          <PropertyBasicInfoFields
            title={state.title}
            setTitle={setters.setTitle}
            unitCode={state.unitCode}
            setUnitCode={setters.setUnitCode}
            floor={state.floor}
            setFloor={setters.setFloor}
            zone={state.zone}
            setZone={setters.setZone}
            condition={state.condition}
            setCondition={setters.setCondition}
            type={state.type}
            setType={setters.setType}
            category={state.category}
            setCategory={setters.setCategory}
          />

          <PropertySizePricingFields
            sizeSqm={state.sizeSqm}
            setSizeSqm={setters.setSizeSqm}
            price={state.price}
            setPrice={setters.setPrice}
            numericPrice={state.numericPrice}
            setNumericPrice={setters.setNumericPrice}
          />

          <PropertyMediaUploadFields
            image={state.image}
            setImage={setters.setImage}
            floorPlanImage={state.floorPlanImage}
            setFloorPlanImage={setters.setFloorPlanImage}
            galleryImages={state.galleryImages}
            isUploadingMain={state.isUploadingMain}
            isUploadingFloorPlan={state.isUploadingFloorPlan}
            isUploadingGallery={state.isUploadingGallery}
            handleMainImageUpload={handlers.handleMainImageUpload}
            handleFloorPlanUpload={handlers.handleFloorPlanUpload}
            handleGalleryUpload={handlers.handleGalleryUpload}
            handleRemoveGalleryImage={handlers.handleRemoveGalleryImage}
          />

          <PropertySpecsFeaturesFields
            viewType={state.viewType}
            setViewType={setters.setViewType}
            electricityCapacity={state.electricityCapacity}
            setElectricityCapacity={setters.setElectricityCapacity}
            features={state.features}
            setFeatures={setters.setFeatures}
            description={state.description}
            setDescription={setters.setDescription}
            featured={state.featured}
            setFeatured={setters.setFeatured}
          />

          {/* Form Actions */}
          <div className="pt-4 border-t border-outline-variant/10 flex items-center justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading || isUploading}>
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading || isUploading}>
              {isLoading ? (
                <span className="flex items-center space-x-2">
                  <Icon name="sync" className="animate-spin text-lg" />
                  <span>Menyimpan...</span>
                </span>
              ) : (
                <span>{initialData ? 'Simpan Perubahan' : 'Tambah Properti'}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
