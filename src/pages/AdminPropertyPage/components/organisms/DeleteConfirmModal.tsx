import React from 'react';

import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import type { ContactMessage, Property } from '@/types';

interface DeleteConfirmModalProps {
  property?: Property | null;
  contact?: ContactMessage | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  property,
  contact,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  if (!property && !contact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface rounded-2xl border border-outline-variant/20 p-6 shadow-2xl w-full max-w-md">
        <div className="flex items-center space-x-3 text-red-600 mb-4">
          <Icon name="warning" className="text-3xl" />
          <h3 className="font-heading-sm font-bold text-on-surface">Konfirmasi Hapus</h3>
        </div>
        <p className="font-body-md text-on-surface-variant mb-6 text-xs leading-relaxed">
          {property && (
            <>
              Apakah Anda yakin ingin menghapus properti{' '}
              <strong className="text-on-surface">
                {property.unitCode} ({property.title})
              </strong>{' '}
              dari database? Tindakan ini tidak dapat dibatalkan.
            </>
          )}
          {contact && (
            <>
              Apakah Anda yakin ingin menghapus pesan kontak dari{' '}
              <strong className="text-on-surface">{contact.name}</strong> ({contact.subject})? Tindakan ini tidak dapat dibatalkan.
            </>
          )}
        </p>
        <div className="flex items-center justify-end space-x-3">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Batal
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? 'Menghapus...' : 'Hapus Permanent'}
          </Button>
        </div>
      </div>
    </div>
  );
};
