import React from 'react';

type AdminTab = 'properties' | 'contacts' | 'insights';

interface AdminTabNavigationProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  unreadContactCount: number;
}

export const AdminTabNavigation: React.FC<AdminTabNavigationProps> = ({
  activeTab,
  onTabChange,
  unreadContactCount,
}) => {
  return (
    <div className="flex border-b border-outline-variant/20 gap-2">
      <button
        onClick={() => onTabChange('properties')}
        className={`px-5 py-3 font-label-md text-xs font-bold transition-all border-b-2 flex items-center space-x-2 ${
          activeTab === 'properties'
            ? 'border-heritage-red text-heritage-red bg-white/60 rounded-t-xl'
            : 'border-transparent text-on-surface-variant hover:text-on-surface'
        }`}
      >
        <span className="material-symbols-outlined text-sm">apartment</span>
        <span>Daftar Properti</span>
      </button>

      <button
        onClick={() => onTabChange('contacts')}
        className={`px-5 py-3 font-label-md text-xs font-bold transition-all border-b-2 flex items-center space-x-2 relative ${
          activeTab === 'contacts'
            ? 'border-heritage-red text-heritage-red bg-white/60 rounded-t-xl'
            : 'border-transparent text-on-surface-variant hover:text-on-surface'
        }`}
      >
        <span className="material-symbols-outlined text-sm">mail</span>
        <span>Pesan Kontak & Inkuiri</span>
        {unreadContactCount > 0 && (
          <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] rounded-full font-bold">
            {unreadContactCount} baru
          </span>
        )}
      </button>

      <button
        onClick={() => onTabChange('insights')}
        className={`px-5 py-3 font-label-md text-xs font-bold transition-all border-b-2 flex items-center space-x-2 ${
          activeTab === 'insights'
            ? 'border-heritage-red text-heritage-red bg-white/60 rounded-t-xl'
            : 'border-transparent text-on-surface-variant hover:text-on-surface'
        }`}
      >
        <span className="material-symbols-outlined text-sm">article</span>
        <span>Insight / Blog</span>
      </button>
    </div>
  );
};
