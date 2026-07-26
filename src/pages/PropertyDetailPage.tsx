import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProperty, useProperties } from '@/hooks/useProperties';
import { MainLayout } from '@/components/templates/MainLayout';
import { Icon } from '@/components/atoms/Icon';
import { ScheduleSurveyModal } from '@/components/molecules/ScheduleSurveyModal';
import { PropertyBanner } from './PropertyDetailPage/components/PropertyBanner';
import { PropertyGallerySection } from './PropertyDetailPage/components/PropertyGallerySection';
import { PropertySpecsSection } from './PropertyDetailPage/components/PropertySpecsSection';
import { PropertyCostCalculator } from './PropertyDetailPage/components/PropertyCostCalculator';
import { PropertyInquirySidebar } from './PropertyDetailPage/components/PropertyInquirySidebar';
import { SimilarPropertiesSection } from './PropertyDetailPage/components/SimilarPropertiesSection';
import type { Property } from '@/types';

export const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading, isError } = useProperty(id);
  const { data: allPropertiesData } = useProperties();
  const allPropertiesList = allPropertiesData?.properties ?? [];

  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [selectedRecommendedProperty, setSelectedRecommendedProperty] = useState<Property | null>(null);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="py-32 text-center max-w-md mx-auto animate-pulse">
          <div className="w-16 h-16 bg-surface-container rounded-full mx-auto mb-4" />
          <div className="h-6 bg-surface-container rounded w-3/4 mx-auto mb-2" />
          <div className="h-4 bg-surface-container rounded w-1/2 mx-auto" />
        </div>
      </MainLayout>
    );
  }

  if (isError || !property) {
    return (
      <MainLayout>
        <div className="py-24 text-center max-w-md mx-auto">
          <Icon name="error_outline" className="text-[48px] text-heritage-red mb-4" />
          <h2 className="font-headline-md text-on-surface mb-2">Unit Tidak Ditemukan</h2>
          <p className="text-on-surface-variant text-body-sm mb-6">
            Unit perkantoran yang Anda cari tidak ditemukan atau telah terisi.
          </p>
          <Link
            to="/properti"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-heritage-red text-white font-label-md"
          >
            Lihat Semua Unit Kantor
          </Link>
        </div>
      </MainLayout>
    );
  }

  const similarProperties = allPropertiesList.filter((p) => p.id !== property.id).slice(0, 3);

  return (
    <MainLayout>
      <PropertyBanner property={property} />

      <section className="py-10 bg-surface">
        <div className="max-w-container mx-auto px-4 md:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left 2 Columns: Media Gallery & Specs */}
            <div className="lg:col-span-2 space-y-8">
              <PropertyGallerySection property={property} />
              <PropertySpecsSection property={property} />

              {/* Description & Features */}
              <div className="bg-surface-container-lowest border border-outline-variant/15 p-6 md:p-8 rounded-2xl">
                <h3 className="font-headline-md text-on-surface mb-4">Deskripsi Ruang Kantor</h3>
                <p className="text-on-surface-variant text-body-md leading-relaxed mb-8">
                  {property.description}
                </p>

                {property.features && property.features.length > 0 && (
                  <div>
                    <h4 className="font-headline-md text-on-surface text-lg mb-4">Fasilitas & Keunggulan Utama</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {property.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <Icon name="check_circle" className="text-heritage-red text-[18px] shrink-0 mt-0.5" />
                          <span className="text-on-surface text-body-sm">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <PropertyCostCalculator property={property} />
            </div>

            {/* Right Column: Inquiry / Survey Card */}
            <PropertyInquirySidebar onOpenSurveyModal={() => setIsSurveyModalOpen(true)} />
          </div>

          <SimilarPropertiesSection
            properties={similarProperties}
            totalCount={allPropertiesList.length}
            onScheduleSurvey={(p) => {
              setSelectedRecommendedProperty(p);
              setIsSurveyModalOpen(true);
            }}
          />
        </div>
      </section>

      <ScheduleSurveyModal
        property={selectedRecommendedProperty || property}
        isOpen={isSurveyModalOpen}
        onClose={() => setIsSurveyModalOpen(false)}
      />
    </MainLayout>
  );
};

export default PropertyDetailPage;
