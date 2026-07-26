import React from 'react';

import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { Select } from '@/components/atoms/Select';
import type { ContactMessage, ContactStatus } from '@/types';

interface ContactDetailModalProps {
  contact: ContactMessage | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: ContactStatus) => void;
  onDelete: (id: string) => void;
  isUpdating?: boolean;
}

export const ContactDetailModal: React.FC<ContactDetailModalProps> = ({
  contact,
  onClose,
  onUpdateStatus,
  onDelete,
  isUpdating = false,
}) => {
  if (!contact) return null;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'full',
        timeStyle: 'short',
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status: ContactStatus) => {
    switch (status) {
      case 'unread':
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-full text-xs font-bold uppercase tracking-wider flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Belum Dibaca</span>
          </span>
        );
      case 'read':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 border border-blue-300 rounded-full text-xs font-bold uppercase tracking-wider flex items-center space-x-1">
            <Icon name="visibility" className="text-sm" />
            <span>Sudah Dibaca</span>
          </span>
        );
      case 'replied':
        return (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider flex items-center space-x-1">
            <Icon name="check_circle" className="text-sm" />
            <span>Sudah Dibalas</span>
          </span>
        );
    }
  };

  const cleanPhone = contact.phone.replace(/[^0-9]/g, '');
  const waPhone = cleanPhone.startsWith('0') ? `62${cleanPhone.slice(1)}` : cleanPhone;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-outline-variant/30 animate-fade-in flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 bg-surface-container-high border-b border-outline-variant/20 flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center space-x-3 mb-1">
              <span className="text-xs font-bold text-heritage-red uppercase tracking-wider font-label-md">
                Detail Pesan Kontak
              </span>
              {getStatusBadge(contact.status)}
            </div>
            <h2 className="text-xl font-bold font-headline-md text-on-surface">
              {contact.subject}
            </h2>
            <p className="text-xs text-on-surface-variant">
              Diterima pada {formatDate(contact.createdAt)}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-2 rounded-full hover:bg-surface-container transition-colors"
          >
            <Icon name="close" className="text-2xl" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow">
          {/* Sender Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-surface/80 p-4 rounded-2xl border border-outline-variant/20">
            <div>
              <span className="text-[11px] text-on-surface-variant uppercase font-bold tracking-wider block mb-0.5">
                Pengirim
              </span>
              <p className="text-sm font-bold text-on-surface">{contact.name}</p>
              {contact.company && (
                <p className="text-xs text-on-surface-variant">{contact.company}</p>
              )}
            </div>

            <div>
              <span className="text-[11px] text-on-surface-variant uppercase font-bold tracking-wider block mb-0.5">
                Kontak
              </span>
              <p className="text-xs font-semibold text-on-surface flex items-center space-x-1.5">
                <Icon name="mail" className="text-sm text-heritage-red" />
                <a href={`mailto:${contact.email}`} className="hover:underline">{contact.email}</a>
              </p>
              <p className="text-xs font-semibold text-on-surface flex items-center space-x-1.5 mt-1">
                <Icon name="call" className="text-sm text-emerald-600" />
                <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {contact.phone}
                </a>
              </p>
            </div>
          </div>

          {/* Message Content */}
          <div>
            <span className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-2 font-label-md">
              Isi Pesan / Pertanyaan
            </span>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-body-md whitespace-pre-wrap">
              {contact.message}
            </div>
          </div>

          {/* Direct Response Options */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3">
            <Button
              asAnchor
              href={`mailto:${contact.email}?subject=Re: ${encodeURIComponent(contact.subject)}&body=Halo ${encodeURIComponent(contact.name)},%0D%0A%0D%0ATerima kasih telah menghubungi Kirana Two Office Tower.%0D%0A%0D%0A`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onUpdateStatus(contact.id, 'replied')}
              className="px-4 py-2 !bg-blue-600 hover:!bg-blue-700 !text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-2 border-none"
            >
              <Icon name="reply" className="text-base" />
              <span>Balas via Email</span>
            </Button>

            <Button
              asAnchor
              href={`https://wa.me/${waPhone}?text=Halo%20${encodeURIComponent(contact.name)}%2C%20terima%20kasih%20telah%20menghubungi%20Kirana%20Two%20Office%20Tower%20mengenai%20${encodeURIComponent(contact.subject)}.`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onUpdateStatus(contact.id, 'replied')}
              className="px-4 py-2 !bg-[#25D366] hover:!bg-[#128C7E] !text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-2 border-none"
            >
              <Icon name="chat" className="text-base" />
              <span>Balas via WhatsApp</span>
            </Button>
          </div>

        </div>

        {/* Modal Footer / Status Controls */}
        <div className="p-5 bg-surface-container-high border-t border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-on-surface-variant shrink-0">Ubah Status:</span>
            <Select
              value={contact.status}
              disabled={isUpdating}
              onChange={(e) => onUpdateStatus(contact.id, e.target.value as ContactStatus)}
              className="py-1 px-3 text-xs w-auto"
            >
              <option value="unread">Belum Dibaca (Unread)</option>
              <option value="read">Sudah Dibaca (Read)</option>
              <option value="replied">Sudah Dibalas (Replied)</option>
            </Select>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              onClick={() => onDelete(contact.id)}
              className="px-3 py-1.5 border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold"
            >
              <span className="flex items-center space-x-1">
                <Icon name="delete" className="text-base" />
                <span>Hapus Pesan</span>
              </span>
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-bold"
            >
              Tutup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
