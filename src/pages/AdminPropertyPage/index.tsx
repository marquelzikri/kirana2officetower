import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';

import { Footer } from '@/components/organisms/Footer';
import { Header } from '@/components/organisms/Header';
import { MobileMenu } from '@/components/organisms/MobileMenu';
import { PropertyFormModal } from '@/components/organisms/PropertyFormModal';
import { NotificationToast } from '@/pages/AdminPropertyPage/components/molecules/NotificationToast';
import { AdminFilterToolbar } from '@/pages/AdminPropertyPage/components/organisms/AdminFilterToolbar';
import { AdminPropertyTable } from '@/pages/AdminPropertyPage/components/organisms/AdminPropertyTable';
import { AdminStatsGrid } from '@/pages/AdminPropertyPage/components/organisms/AdminStatsGrid';
import { DeleteConfirmModal } from '@/pages/AdminPropertyPage/components/organisms/DeleteConfirmModal';
import {
  createProperty,
  deleteProperty,
  fetchProperties,
  seedProperties,
  updateProperty,
} from '@/services/propertyService';
import type { Property } from '@/types';

export const AdminPropertyPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [conditionFilter, setConditionFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const queryClient = useQueryClient();

  // Fetch properties query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin-properties', searchQuery, zoneFilter, conditionFilter, typeFilter],
    queryFn: () =>
      fetchProperties({
        searchQuery,
        zone: zoneFilter,
        condition: conditionFilter,
        type: typeFilter,
      }),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newProp: Partial<Property>) => createProperty(newProp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      setIsFormModalOpen(false);
      showNotification('success', 'Properti baru berhasil ditambahkan ke Cloudflare D1 Database!');
    },
    onError: (err: any) => {
      showNotification('error', err.message || 'Gagal menambahkan properti.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Property> }) => updateProperty(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      setIsFormModalOpen(false);
      setSelectedProperty(null);
      showNotification('success', 'Perubahan properti berhasil disimpan ke Cloudflare D1 Database!');
    },
    onError: (err: any) => {
      showNotification('error', err.message || 'Gagal mengubah properti.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      setDeletingProperty(null);
      showNotification('success', 'Properti berhasil dihapus dari database.');
    },
    onError: (err: any) => {
      showNotification('error', err.message || 'Gagal menghapus properti.');
    },
  });

  const seedMutation = useMutation({
    mutationFn: () => seedProperties(),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      showNotification('success', `Database D1 berhasil di-seed (${res.seededCount} unit properti).`);
    },
    onError: (err: any) => {
      showNotification('error', err.message || 'Gagal me-reset database.');
    },
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleOpenCreateModal = () => {
    setSelectedProperty(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (property: Property) => {
    setSelectedProperty(property);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (formData: Partial<Property>) => {
    if (selectedProperty) {
      await updateMutation.mutateAsync({ id: selectedProperty.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingProperty) {
      deleteMutation.mutate(deletingProperty.id);
    }
  };

  const properties = data?.properties || [];
  const totalCount = data?.totalCount || 0;
  const forRentCount = properties.filter((p) => p.type === 'For Rent').length;
  const forSaleCount = properties.filter((p) => p.type === 'For Sale').length;

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans antialiased">
      <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-container mx-auto px-4 md:px-margin-desktop">
          <NotificationToast
            notification={notification}
            onClose={() => setNotification(null)}
          />

          <AdminStatsGrid
            totalCount={totalCount}
            forRentCount={forRentCount}
            forSaleCount={forSaleCount}
          />

          <AdminFilterToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            zoneFilter={zoneFilter}
            onZoneChange={setZoneFilter}
            conditionFilter={conditionFilter}
            onConditionChange={setConditionFilter}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
          />

          <AdminPropertyTable
            properties={properties}
            isLoading={isLoading}
            isError={isError}
            errorMessage={(error as any)?.message}
            onRetry={() => queryClient.invalidateQueries({ queryKey: ['admin-properties'] })}
            onSeed={() => seedMutation.mutate()}
            isSeeding={seedMutation.isPending}
            onCreateNew={handleOpenCreateModal}
            onEdit={handleOpenEditModal}
            onDelete={(prop) => setDeletingProperty(prop)}
          />
        </div>
      </main>

      <PropertyFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedProperty}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmModal
        property={deletingProperty}
        onClose={() => setDeletingProperty(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
      />

      <Footer />
    </div>
  );
};
