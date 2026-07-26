import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProperty, useProperties } from '@/hooks/useProperties';
import { MainLayout } from '@/components/templates/MainLayout';
import { Badge } from '@/components/atoms/Badge';
import { Icon } from '@/components/atoms/Icon';
import { Button } from '@/components/atoms/Button';
import { ScheduleSurveyModal } from '@/components/molecules/ScheduleSurveyModal';
import { OfficePropertyCard } from '@/components/molecules/OfficePropertyCard';

export const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading, isError } = useProperty(id);
  const { data: allPropertiesData } = useProperties();
  const allPropertiesList = allPropertiesData?.properties ?? [];

  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'floorplan'>('photos');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [selectedRecommendedProperty, setSelectedRecommendedProperty] = useState<any>(null);

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

  const gallery = property.galleryImages || [property.image];
  const isSale = property.type === 'For Sale';
  const similarProperties = allPropertiesList.filter((p) => p.id !== property.id).slice(0, 3);


  // Estimator Calculations
  const rentCost = (property.rentalRateSqm || 0) * property.sizeSqm;
  const serviceChargeCost = (property.serviceChargeSqm || 0) * property.sizeSqm;
  const totalEstimatedMonthly = rentCost + serviceChargeCost;

  return (
    <MainLayout>
      {/* Top Banner & Breadcrumb */}
      <section className="pt-24 pb-8 bg-surface-container-low border-b border-outline-variant/10">
        <div className="max-w-container mx-auto px-4 md:px-margin-desktop">
          <nav className="flex items-center gap-2 text-on-surface-variant text-body-sm mb-4">
            <Link to="/" className="hover:text-heritage-red transition-colors">
              Beranda
            </Link>
            <Icon name="chevron_right" className="text-[14px]" />
            <Link to="/properti" className="hover:text-heritage-red transition-colors">
              Properti
            </Link>
            <Icon name="chevron_right" className="text-[14px]" />
            <span className="text-on-surface font-semibold truncate">{property.unitCode}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge label={property.zone} variant="red" />
                <Badge label={property.condition} variant="white" />
                <span className="bg-black/80 text-white px-3 py-1 rounded-full text-[11px] font-metadata uppercase tracking-wider">
                  {property.type}
                </span>
              </div>
              <h1 className="font-headline-lg text-on-surface text-2xl md:text-4xl font-bold mb-2">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-on-surface-variant text-body-sm">
                <Icon name="location_on" className="text-heritage-red text-[18px]" />
                <span>{property.location}</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant/15 p-4 rounded-xl shadow-sm text-right min-w-[240px]">
              <span className="block text-[11px] font-metadata uppercase tracking-wider text-on-surface-variant mb-1">
                {isSale ? 'HARGA STRATA TITLE' : 'ESTIMASI HARGA SEWA'}
              </span>
              <span className="font-headline-md text-heritage-red text-2xl font-bold block">
                {property.price}
              </span>
              {property.rentalRateSqm && property.rentalRateSqm > 0 && (
                <span className="text-body-sm text-on-surface-variant block mt-1">
                  IDR {property.rentalRateSqm.toLocaleString()} / m² / bulan
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Gallery */}
      <section className="py-10 bg-surface">
        <div className="max-w-container mx-auto px-4 md:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left 2 Columns: Media Gallery & Specs */}
            <div className="lg:col-span-2 space-y-8">
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

              {/* Key Technical Specs Grid */}
              <div className="bg-surface-container-lowest border border-outline-variant/15 p-6 md:p-8 rounded-2xl">
                <h3 className="font-headline-md text-on-surface mb-6 flex items-center gap-2">
                  <Icon name="tune" className="text-heritage-red text-[22px]" />
                  Spesifikasi Teknis Unit & Gedung
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-surface p-4 rounded-xl border border-outline-variant/10">
                    <span className="block text-[11px] font-metadata uppercase text-on-surface-variant mb-1">
                      Luas NLA
                    </span>
                    <span className="font-headline-md text-on-surface text-lg font-bold">
                      {property.sizeSqm} m²
                    </span>
                  </div>

                  <div className="bg-surface p-4 rounded-xl border border-outline-variant/10">
                    <span className="block text-[11px] font-metadata uppercase text-on-surface-variant mb-1">
                      Elevasi Zone
                    </span>
                    <span className="font-headline-md text-on-surface text-lg font-bold">
                      Lantai {property.floor}
                    </span>
                  </div>

                  <div className="bg-surface p-4 rounded-xl border border-outline-variant/10">
                    <span className="block text-[11px] font-metadata uppercase text-on-surface-variant mb-1">
                      Tinggi Plafon
                    </span>
                    <span className="font-headline-md text-on-surface text-lg font-bold">
                      {property.ceilingHeight || '2.80 m'}
                    </span>
                  </div>

                  <div className="bg-surface p-4 rounded-xl border border-outline-variant/10">
                    <span className="block text-[11px] font-metadata uppercase text-on-surface-variant mb-1">
                      Daya Listrik
                    </span>
                    <span className="font-headline-md text-on-surface text-lg font-bold">
                      {property.electricityCapacity || '35 kVA'}
                    </span>
                  </div>

                  <div className="bg-surface p-4 rounded-xl border border-outline-variant/10">
                    <span className="block text-[11px] font-metadata uppercase text-on-surface-variant mb-1">
                      Kondisi Fit-out
                    </span>
                    <span className="font-headline-md text-on-surface text-lg font-bold">
                      {property.condition}
                    </span>
                  </div>

                  <div className="bg-surface p-4 rounded-xl border border-outline-variant/10">
                    <span className="block text-[11px] font-metadata uppercase text-on-surface-variant mb-1">
                      Rasio Parkir
                    </span>
                    <span className="font-headline-md text-on-surface text-lg font-bold">
                      {property.parkingRatio || '1 : 100 m²'}
                    </span>
                  </div>

                  <div className="bg-surface p-4 rounded-xl border border-outline-variant/10">
                    <span className="block text-[11px] font-metadata uppercase text-on-surface-variant mb-1">
                      Service Charge
                    </span>
                    <span className="font-headline-md text-on-surface text-lg font-bold">
                      {property.serviceChargeSqm ? `IDR ${property.serviceChargeSqm.toLocaleString()}/m²` : 'Included'}
                    </span>
                  </div>

                  <div className="bg-surface p-4 rounded-xl border border-outline-variant/10">
                    <span className="block text-[11px] font-metadata uppercase text-on-surface-variant mb-1">
                      Pemandangan
                    </span>
                    <span className="font-headline-md text-on-surface text-body-md font-bold truncate block">
                      {property.viewType || 'City View'}
                    </span>
                  </div>
                </div>
              </div>

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

              {/* Cost Breakdown Widget (for rental units) */}
              {!isSale && property.rentalRateSqm && property.rentalRateSqm > 0 && (
                <div className="bg-surface-container-low border border-outline-variant/15 p-6 md:p-8 rounded-2xl">
                  <h3 className="font-headline-md text-on-surface mb-2 flex items-center gap-2">
                    <Icon name="calculate" className="text-heritage-red text-[22px]" />
                    Simulasi Estimasi Biaya Sewa Bulanan
                  </h3>
                  <p className="text-on-surface-variant text-body-sm mb-6">
                    Estimasi komprehensif berdasarkan tarif sewa dasar dan service charge pengelolaan gedung Kirana Two.
                  </p>

                  <div className="space-y-3 max-w-md bg-surface p-5 rounded-xl border border-outline-variant/10">
                    <div className="flex justify-between text-body-sm">
                      <span className="text-on-surface-variant">Base Rent ({property.sizeSqm} m² x IDR {property.rentalRateSqm.toLocaleString()}):</span>
                      <span className="font-semibold text-on-surface">IDR {rentCost.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-body-sm">
                      <span className="text-on-surface-variant">Service Charge ({property.sizeSqm} m² x IDR {(property.serviceChargeSqm || 0).toLocaleString()}):</span>
                      <span className="font-semibold text-on-surface">IDR {serviceChargeCost.toLocaleString()}</span>
                    </div>

                    <div className="pt-3 border-t border-outline-variant/15 flex justify-between items-center text-body-md">
                      <span className="font-bold text-on-surface">Total Biaya Bulanan (Est.):</span>
                      <span className="font-bold text-heritage-red text-xl">IDR {totalEstimatedMonthly.toLocaleString()} / bln</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Inquiry / Survey Card */}
            <div className="space-y-6">
              <div className="bg-surface-container-lowest border border-outline-variant/20 p-6 md:p-8 rounded-2xl shadow-lg sticky top-28">
                <div className="border-b border-outline-variant/10 pb-4 mb-6">
                  <span className="font-metadata text-[11px] uppercase tracking-wider text-heritage-red block mb-1">
                    TERHUBUNG DENGAN ADVISORY TEAM
                  </span>
                  <h3 className="font-headline-md text-on-surface text-xl font-bold">
                    Tertarik dengan Unit Ini?
                  </h3>
                  <p className="text-on-surface-variant text-body-sm mt-1">
                    Dapatkan penawaran resmi, spesifikasi lengkap PDF, atau jadwalkan survey fisik langsung.
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <button
                    onClick={() => setIsSurveyModalOpen(true)}
                    className="w-full py-3.5 px-4 rounded-xl bg-heritage-red hover:bg-heritage-red-dark text-white font-label-md transition-all shadow-md flex items-center justify-center gap-2 text-body-md"
                  >
                    <Icon name="calendar_month" className="text-[20px]" />
                    Jadwalkan Survey Unit
                  </button>

                  <a
                    href="https://wa.me/6281234567890?text=Halo%20Kirana%20Two%20Office%20Tower,%20saya%20tertarik%20dengan%20unit%20"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl border border-outline-variant/30 text-on-surface font-label-md hover:bg-surface-container transition-all flex items-center justify-center gap-2 text-body-md"
                  >
                    <Icon name="chat" className="text-[20px] text-green-600" />
                    Hubungi via WhatsApp
                  </a>
                </div>

                <div className="pt-4 border-t border-outline-variant/10 space-y-3 text-body-sm text-on-surface-variant">
                  <div className="flex items-center gap-3">
                    <Icon name="call" className="text-heritage-red text-[18px]" />
                    <span>Hotline: +62 21 458 8899</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon name="mail" className="text-heritage-red text-[18px]" />
                    <span>Leasing: leasing@kiranatwo.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon name="schedule" className="text-heritage-red text-[18px]" />
                    <span>Jam Operasional: Sen - Jum (08:30 - 17:30)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Recommended Properties */}
          {similarProperties.length > 0 && (
            <div className="mt-16 pt-12 border-t border-outline-variant/10">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <span className="font-metadata text-[11px] uppercase tracking-wider text-heritage-red font-semibold block mb-1">
                    REKOMENDASI LAINNYA
                  </span>
                  <h3 className="font-headline-md text-on-surface text-2xl font-bold">
                    Unit Kantor Lainnya di Kirana Two
                  </h3>
                </div>
                <Link
                  to="/properti"
                  className="inline-flex items-center gap-2 text-on-surface hover:text-heritage-red font-label-md transition-colors"
                >
                  Lihat Semua ({allPropertiesList.length})
                  <Icon name="arrow_forward" className="text-[16px]" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {similarProperties.map((simProp) => (
                  <OfficePropertyCard
                    key={simProp.id}
                    property={simProp}
                    onScheduleSurvey={(p) => {
                      setSelectedRecommendedProperty(p);
                      setIsSurveyModalOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Survey Schedule Modal */}
      <ScheduleSurveyModal
        property={selectedRecommendedProperty || property}
        isOpen={isSurveyModalOpen}
        onClose={() => setIsSurveyModalOpen(false)}
      />
    </MainLayout>
  );
};

export default PropertyDetailPage;
