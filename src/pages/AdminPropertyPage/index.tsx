import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';

import { Footer } from '@/components/organisms/Footer';
import { Header } from '@/components/organisms/Header';
import { MobileMenu } from '@/components/organisms/MobileMenu';
import { PropertyFormModal } from '@/components/organisms/PropertyFormModal';
import { UserManagementModal } from '@/components/organisms/UserManagementModal';
import { useAuth } from '@/context/AuthContext';
import { AdminInsightSection } from '@/pages/AdminPropertyPage/components/AdminInsightSection';
import { AdminHeaderBanner } from '@/pages/AdminPropertyPage/components/molecules/AdminHeaderBanner';
import { AdminTabNavigation } from '@/pages/AdminPropertyPage/components/molecules/AdminTabNavigation';
import { NotificationToast } from '@/pages/AdminPropertyPage/components/molecules/NotificationToast';
import { AdminContactTable } from '@/pages/AdminPropertyPage/components/organisms/AdminContactTable';
import { AdminFilterToolbar } from '@/pages/AdminPropertyPage/components/organisms/AdminFilterToolbar';
import { AdminPropertyTable } from '@/pages/AdminPropertyPage/components/organisms/AdminPropertyTable';
import { AdminStatsGrid } from '@/pages/AdminPropertyPage/components/organisms/AdminStatsGrid';
import { ContactDetailModal } from '@/pages/AdminPropertyPage/components/organisms/ContactDetailModal';
import { DeleteConfirmModal } from '@/pages/AdminPropertyPage/components/organisms/DeleteConfirmModal';
import { deleteContact, fetchContacts, updateContactStatus } from '@/services/contactService';
import { createProperty, deleteProperty, fetchProperties, seedProperties, updateProperty } from '@/services/propertyService';
import type { ContactMessage, ContactStatus, Property } from '@/types';

export const AdminPropertyPage: React.FC = () => {
  const { user, isOwner } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'properties' | 'contacts' | 'insights'>('properties');

  const [searchQuery, setSearchQuery] = useState('');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [conditionFilter, setConditionFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);

  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null);
  const [deletingContact, setDeletingContact] = useState<ContactMessage | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const queryClient = useQueryClient();

  const { data: propData, isLoading: isPropLoading, isError: isPropError, error: propError } = useQuery({
    queryKey: ['admin-properties', searchQuery, zoneFilter, conditionFilter, typeFilter],
    queryFn: () => fetchProperties({ searchQuery, zone: zoneFilter, condition: conditionFilter, type: typeFilter }),
  });

  const { data: contactsData, isLoading: isContactsLoading, isError: isContactsError, error: contactsError } = useQuery({
    queryKey: ['admin-contacts'],
    queryFn: () => fetchContacts('all'),
  });

  const unreadContactCount = (contactsData || []).filter((c) => c.status === 'unread').length;

  const createMutation = useMutation({
    mutationFn: (newProp: Partial<Property>) => createProperty(newProp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      setIsFormModalOpen(false);
      showNotification('success', 'Properti baru berhasil ditambahkan ke Cloudflare D1 Database!');
    },
    onError: (err: any) => showNotification('error', err.message || 'Gagal menambahkan properti.'),
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
    onError: (err: any) => showNotification('error', err.message || 'Gagal mengubah properti.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      setDeletingProperty(null);
      showNotification('success', 'Properti berhasil dihapus dari database.');
    },
    onError: (err: any) => showNotification('error', err.message || 'Gagal menghapus properti.'),
  });

  const seedMutation = useMutation({
    mutationFn: () => seedProperties(),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      showNotification('success', `Database D1 berhasil di-seed (${res.seededCount} unit properti).`);
    },
    onError: (err: any) => showNotification('error', err.message || 'Gagal me-reset database.'),
  });

  const updateContactStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContactStatus }) => updateContactStatus(id, status),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
      if (selectedContact && selectedContact.id === res.contact.id) setSelectedContact(res.contact);
      showNotification('success', 'Status pesan kontak berhasil diperbarui.');
    },
    onError: (err: any) => showNotification('error', err.message || 'Gagal memperbarui status pesan.'),
  });

  const deleteContactMutation = useMutation({
    mutationFn: (id: string) => deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
      setSelectedContact(null);
      setDeletingContact(null);
      showNotification('success', 'Pesan kontak berhasil dihapus.');
    },
    onError: (err: any) => showNotification('error', err.message || 'Gagal menghapus pesan kontak.'),
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleFormSubmit = async (formData: Partial<Property>) => {
    if (selectedProperty) {
      await updateMutation.mutateAsync({ id: selectedProperty.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingProperty) deleteMutation.mutate(deletingProperty.id);
    else if (deletingContact) deleteContactMutation.mutate(deletingContact.id);
  };

  const handleViewContact = (contact: ContactMessage) => {
    setSelectedContact(contact);
    if (contact.status === 'unread') updateContactStatusMutation.mutate({ id: contact.id, status: 'read' });
  };

  const properties = propData?.properties || [];
  const totalCount = propData?.totalCount || 0;
  const forRentCount = properties.filter((p) => p.type === 'For Rent').length;
  const forSaleCount = properties.filter((p) => p.type === 'For Sale').length;

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans antialiased">
      <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-container mx-auto px-4 md:px-margin-desktop space-y-6">
          <NotificationToast notification={notification} onClose={() => setNotification(null)} />

          <AdminHeaderBanner user={user} isOwner={isOwner} onOpenUserModal={() => setIsUserModalOpen(true)} />

          <AdminTabNavigation activeTab={activeTab} onTabChange={setActiveTab} unreadContactCount={unreadContactCount} />

          {activeTab === 'properties' && (
            <>
              <AdminStatsGrid totalCount={totalCount} forRentCount={forRentCount} forSaleCount={forSaleCount} />
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
                isLoading={isPropLoading}
                isError={isPropError}
                errorMessage={(propError as any)?.message}
                onRetry={() => queryClient.invalidateQueries({ queryKey: ['admin-properties'] })}
                onSeed={() => seedMutation.mutate()}
                isSeeding={seedMutation.isPending}
                onCreateNew={() => {
                  setSelectedProperty(null);
                  setIsFormModalOpen(true);
                }}
                onEdit={(p) => {
                  setSelectedProperty(p);
                  setIsFormModalOpen(true);
                }}
                onDelete={(prop) => setDeletingProperty(prop)}
              />
            </>
          )}

          {activeTab === 'contacts' && (
            <AdminContactTable
              contacts={contactsData || []}
              isLoading={isContactsLoading}
              isError={isContactsError}
              errorMessage={(contactsError as any)?.message}
              onRefresh={() => queryClient.invalidateQueries({ queryKey: ['admin-contacts'] })}
              onViewContact={handleViewContact}
              onDeleteContact={(c) => setDeletingContact(c)}
            />
          )}

          {activeTab === 'insights' && (
            <AdminInsightSection />
          )}
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
        contact={deletingContact}
        onClose={() => {
          setDeletingProperty(null);
          setDeletingContact(null);
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending || deleteContactMutation.isPending}
      />

      <ContactDetailModal
        contact={selectedContact}
        onClose={() => setSelectedContact(null)}
        onUpdateStatus={(id, status) => updateContactStatusMutation.mutate({ id, status })}
        onDelete={(id) => {
          const c = contactsData?.find((item) => item.id === id);
          if (c) setDeletingContact(c);
        }}
        isUpdating={updateContactStatusMutation.isPending}
      />

      <UserManagementModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} />
      <Footer />
    </div>
  );
};
