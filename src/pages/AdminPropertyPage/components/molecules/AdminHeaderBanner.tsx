import React from 'react';

import type { User } from '@/types';

interface AdminHeaderBannerProps {
  user: User | null;
  isOwner: boolean;
  onOpenUserModal: () => void;
}

export const AdminHeaderBanner: React.FC<AdminHeaderBannerProps> = ({
  user,
  isOwner,
  onOpenUserModal,
}) => {
  return (
    <div className="bg-white text-on-surface rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center space-x-3 mb-1">
          <h1 className="text-xl font-bold font-headline-md text-on-surface">Dashboard Pengelola Gedung</h1>
          <span
            className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              isOwner
                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}
          >
            Peran: {user?.role}
          </span>
        </div>
        <p className="text-on-surface-variant text-xs font-body-md">
          Selamat datang kembali, <span className="text-on-surface font-semibold">{user?.name}</span> ({user?.username}).
        </p>
      </div>

      {isOwner && (
        <button
          onClick={onOpenUserModal}
          className="px-4 py-2.5 bg-heritage-red hover:bg-red-800 text-white font-bold rounded-xl text-xs shadow-sm transition-all flex items-center space-x-2 shrink-0 self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-sm">manage_accounts</span>
          <span>Kelola Pengguna (Owner Only)</span>
        </button>
      )}
    </div>
  );
};
