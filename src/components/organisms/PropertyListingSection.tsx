import React, { useState, useMemo } from 'react';
import { Property } from '../../types';
import { allProperties } from '../../data/mockData';
import { OfficeFilterBar, FilterState } from '../molecules/OfficeFilterBar';
import { OfficePropertyCard } from '../molecules/OfficePropertyCard';
import { ScheduleSurveyModal } from '../molecules/ScheduleSurveyModal';
import { Icon } from '../atoms/Icon';

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

  // Filter & Sort Logic
  const filteredProperties = useMemo(() => {
    return allProperties.filter((property) => {
      // Search query filter (matches title, unitCode, location, or floor)
      if (filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase();
        const matchesQuery =
          property.title.toLowerCase().includes(query) ||
          property.unitCode.toLowerCase().includes(query) ||
          property.location.toLowerCase().includes(query) ||
          property.floor.toString().includes(query) ||
          (property.description && property.description.toLowerCase().includes(query));

        if (!matchesQuery) return false;
      }

      // Zone Filter
      if (filters.zone !== 'all' && property.zone !== filters.zone) {
        return false;
      }

      // Condition Filter
      if (filters.condition !== 'all' && property.condition !== filters.condition) {
        return false;
      }

      // Type Filter
      if (filters.type !== 'all' && property.type !== filters.type) {
        return false;
      }

      // Size Range Filter
      if (filters.sizeRange !== 'all') {
        const size = property.sizeSqm;
        if (filters.sizeRange === 'small' && size >= 150) return false;
        if (filters.sizeRange === 'medium' && (size < 150 || size > 300)) return false;
        if (filters.sizeRange === 'large' && (size <= 300 || size > 600)) return false;
        if (filters.sizeRange === 'whole' && size <= 600) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') {
        return a.numericPrice - b.numericPrice;
      }
      if (filters.sortBy === 'price-desc') {
        return b.numericPrice - a.numericPrice;
      }
      if (filters.sortBy === 'size-desc') {
        return b.sizeSqm - a.sizeSqm;
      }
      if (filters.sortBy === 'size-asc') {
        return a.sizeSqm - b.sizeSqm;
      }
      if (filters.sortBy === 'floor-desc') {
        return b.floor - a.floor;
      }
      return 0;
    });
  }, [filters]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProperties.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProperties, currentPage]);

  return (
    <section className="py-12 md:py-16 bg-surface min-h-[60vh]">
      <div className="max-w-container mx-auto px-4 md:px-margin-desktop">
        {/* Filter Bar */}
        <OfficeFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          totalResults={filteredProperties.length}
        />

        {/* Listings Grid */}
        {paginatedProperties.length > 0 ? (
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
