import React, { useState } from 'react';

import { Icon } from '@/components/atoms/Icon';
import { Input } from '@/components/atoms/Input';
import type { ContactMessage, ContactStatus } from '@/types';

interface AdminContactTableProps {
  contacts: ContactMessage[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRefresh: () => void;
  onViewContact: (contact: ContactMessage) => void;
  onDeleteContact: (contact: ContactMessage) => void;
}

export const AdminContactTable: React.FC<AdminContactTableProps> = ({
  contacts,
  isLoading,
  isError,
  errorMessage,
  onRefresh,
  onViewContact,
  onDeleteContact,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusTab, setStatusTab] = useState<'all' | 'unread' | 'read' | 'replied'>('all');

  const filteredContacts = contacts.filter((c) => {
    const matchesStatus = statusTab === 'all' || c.status === statusTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.subject.toLowerCase().includes(q) ||
      (c.company && c.company.toLowerCase().includes(q)) ||
      c.message.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const unreadCount = contacts.filter((c) => c.status === 'unread').length;
  const readCount = contacts.filter((c) => c.status === 'read').length;
  const repliedCount = contacts.filter((c) => c.status === 'replied').length;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(d);
    } catch {
      return dateStr;
    }
  };

  const renderStatusBadge = (status: ContactStatus) => {
    switch (status) {
      case 'unread':
        return (
          <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Belum Dibaca</span>
          </span>
        );
      case 'read':
        return (
          <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 border border-blue-300 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center space-x-1">
            <span>Sudah Dibaca</span>
          </span>
        );
      case 'replied':
        return (
          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center space-x-1">
            <span>Sudah Dibalas</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
      <div className="p-5 bg-surface-container-high/50 border-b border-outline-variant/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setStatusTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusTab === 'all' ? 'bg-white text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Semua ({contacts.length})
          </button>
          <button
            onClick={() => setStatusTab('unread')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
              statusTab === 'unread' ? 'bg-white text-amber-700 shadow-sm' : 'text-on-surface-variant hover:text-amber-700'
            }`}
          >
            <span>Belum Dibaca</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-white text-[10px] rounded-full">{unreadCount}</span>
            )}
          </button>
          <button
            onClick={() => setStatusTab('read')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusTab === 'read' ? 'bg-white text-blue-700 shadow-sm' : 'text-on-surface-variant hover:text-blue-700'
            }`}
          >
            Sudah Dibaca ({readCount})
          </button>
          <button
            onClick={() => setStatusTab('replied')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusTab === 'replied' ? 'bg-white text-emerald-700 shadow-sm' : 'text-on-surface-variant hover:text-emerald-700'
            }`}
          >
            Sudah Dibalas ({repliedCount})
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative flex-grow md:w-64">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, email, perihal..."
              className="pl-9 pr-4 py-2 bg-white text-xs"
            />

            <Icon name="search" className="text-base text-on-surface-variant absolute left-3 top-2.5" />
          </div>
          <button
            onClick={onRefresh}
            className="p-2 bg-white hover:bg-slate-100 border border-outline-variant/40 text-on-surface rounded-xl transition-all"
            title="Refresh Pesan"
          >
            <Icon name="refresh" className="text-lg" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-heritage-red border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-on-surface-variant font-body-md">Memuat daftar pesan kontak...</p>
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-red-600 space-y-2">
            <Icon name="error" className="text-3xl" />
            <p className="text-xs font-bold">{errorMessage || 'Gagal memuat pesan'}</p>
            <button onClick={onRefresh} className="px-4 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-xs font-bold">
              Coba Lagi
            </button>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant space-y-2">
            <Icon name="mail" className="text-4xl text-slate-300" />
            <p className="text-sm font-bold text-on-surface">Tidak Ada Pesan Kontak</p>
            <p className="text-xs max-w-sm mx-auto">
              {searchQuery ? `Tidak ditemukan pesan kontak yang cocok dengan kata kunci "${searchQuery}".` : 'Belum ada inkuiri atau pesan kontak yang masuk.'}
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/20 bg-slate-50 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider font-label-md">
                <th className="py-3.5 px-4">Pengirim</th>
                <th className="py-3.5 px-4">Subjek / Perihal</th>
                <th className="py-3.5 px-4">Kontak</th>
                <th className="py-3.5 px-4">Tanggal Masuk</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-xs font-body-md">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className={`hover:bg-slate-50/80 transition-colors ${contact.status === 'unread' ? 'bg-amber-50/30 font-medium' : ''}`}>
                  <td className="py-4 px-4">
                    <div className="font-bold text-on-surface">{contact.name}</div>
                    {contact.company && <div className="text-[11px] text-on-surface-variant">{contact.company}</div>}
                  </td>
                  <td className="py-4 px-4 max-w-xs">
                    <div className="font-semibold text-on-surface truncate">{contact.subject}</div>
                    <div className="text-[11px] text-on-surface-variant truncate max-w-xs">{contact.message}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-xs text-on-surface">{contact.email}</div>
                    <div className="text-[11px] text-on-surface-variant">{contact.phone}</div>
                  </td>
                  <td className="py-4 px-4 text-on-surface-variant whitespace-nowrap">{formatDate(contact.createdAt)}</td>
                  <td className="py-4 px-4 whitespace-nowrap">{renderStatusBadge(contact.status)}</td>
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onViewContact(contact)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center space-x-1"
                        title="Lihat Detail Pesan"
                      >
                        <Icon name="visibility" className="text-sm" />
                        <span>Detail</span>
                      </button>
                      <button
                        onClick={() => onDeleteContact(contact)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Hapus Pesan"
                      >
                        <Icon name="delete" className="text-base" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
