import React, { useMemo,useState } from 'react';

import { Icon } from '@/components/atoms/Icon';
import { type FilterState,OfficeFilterBar } from '@/components/molecules/OfficeFilterBar';
import { OfficePropertyCard } from '@/components/molecules/OfficePropertyCard';
import { ScheduleSurveyModal } from '@/components/molecules/ScheduleSurveyModal';
import { useProperties } from '@/hooks/useProperties';
import type { Property } from '@/types';

const ITEMS_PER_PAGE = 6;

export const PropertyListingSection: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    zone: 'all',
    condition: 'all',
    type: 'all',
    sizeRange: 'all',
    sortBy: 'default',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSurveyProperty, setSelectedSurveyProperty] = useState<Property | null>(null);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);

  // Fetch properties via React Query from native Bun REST API
  const { data, isLoading, isError, error, refetch } = useProperties(filters);

  const properties = data?.properties ?? [];

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // reset to page 1 on filter update
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      zone: 'all',
      condition: 'all',
      type: 'all',
      sizeRange: 'all',
      sortBy: 'default',
    });
    setCurrentPage(1);
  };

  const handleScheduleSurvey = (property: Property) => {
    setSelectedSurveyProperty(property);
    setIsSurveyModalOpen(true);
  };

  // Pagination Logic
  const totalPages = Math.ceil(properties.length / ITEMS_PER_PAGE);
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return properties.slice(start, start + ITEMS_PER_PAGE);
  }, [properties, currentPage]);

  return (
    <section className="py-12 md:py-16 bg-surface min-h-[60vh]">
      <div className="max-w-container mx-auto px-4 md:px-margin-desktop">
        {/* Filter Bar */}
        <OfficeFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          totalResults={properties.length}
        />

        {/* Loading State Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="animate-pulse bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10 h-[420px] flex flex-col justify-between">
                <div className="w-full h-48 bg-surface-container rounded-xl mb-4" />
                <div className="h-6 bg-surface-container rounded w-3/4 mb-2" />
                <div className="h-4 bg-surface-container rounded w-1/2 mb-4" />
                <div className="h-10 bg-surface-container rounded w-full mt-auto" />
              </div>
            ))}
          </div>
        ) : isError ? (
          /* Error State */
          <div className="text-center py-16 bg-surface-container-lowest border border-heritage-red/20 rounded-2xl p-8 max-w-lg mx-auto">
            <div className="w-16 h-16 bg-heritage-red/10 text-heritage-red rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="error_outline" className="text-[32px]" />
            </div>
            <h3 className="font-headline-md text-on-surface mb-2">Gagal Memuat Data Properti</h3>
            <p className="text-on-surface-variant text-body-sm mb-6">
              {error instanceof Error ? error.message : 'Terjadi kesalahan saat menghubungkan ke REST API Bun.'}
            </p>
            <button
              onClick={() => refetch()}
              className="px-6 py-3 rounded-lg bg-heritage-red text-white font-label-md hover:bg-heritage-red-dark transition-colors inline-flex items-center gap-2"
            >
              <Icon name="refresh" className="text-[18px]" />
              Coba Lagi
            </button>
          </div>
        ) : paginatedProperties.length > 0 ? (
          /* Listings Grid */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedProperties.map((property) => (
                <OfficePropertyCard
                  key={property.id}
                  property={property}
                  onScheduleSurvey={handleScheduleSurvey}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12 pt-8 border-t border-outline-variant/10">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-2.5 rounded-lg border border-outline-variant/20 text-on-surface hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous Page"
                >
                  <Icon name="arrow_back" className="text-[18px]" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-label-md transition-all text-body-sm ${
                      currentPage === pageNum
                        ? 'bg-heritage-red text-white font-bold shadow-md'
                        : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-2.5 rounded-lg border border-outline-variant/20 text-on-surface hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next Page"
                >
                  <Icon name="arrow_forward" className="text-[18px]" />
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-8 max-w-lg mx-auto">
            <div className="w-16 h-16 bg-surface-container text-on-surface-variant rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="search_off" className="text-[32px]" />
            </div>
            <h3 className="font-headline-md text-on-surface mb-2">Tidak Ada Unit Ditemukan</h3>
            <p className="text-on-surface-variant text-body-sm mb-6">
              Tidak ada unit ruang kantor yang cocok dengan kriteria filter yang Anda pilih. Coba sesuaikan kata kunci pencarian atau reset filter.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-3 rounded-lg bg-heritage-red text-white font-label-md hover:bg-heritage-red-dark transition-colors inline-flex items-center gap-2"
            >
              <Icon name="restart_alt" className="text-[18px]" />
              Reset Semua Filter
            </button>
          </div>
        )}
      </div>

      {/* Survey Schedule Modal */}
      <ScheduleSurveyModal
        property={selectedSurveyProperty}
        isOpen={isSurveyModalOpen}
        onClose={() => setIsSurveyModalOpen(false)}
      />
    </section>
  );
};

