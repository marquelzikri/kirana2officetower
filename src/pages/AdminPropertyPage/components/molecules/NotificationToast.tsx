import React from 'react';
import { Icon } from '@/components/atoms/Icon';

interface NotificationToastProps {
  notification: { type: 'success' | 'error'; message: string } | null;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
  if (!notification) return null;

  return (
    <div
      className={`p-4 rounded-2xl mb-6 shadow-md flex items-center justify-between transition-all duration-300 ${
        notification.type === 'success'
          ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-700'
          : 'bg-red-500/10 border border-red-500/30 text-red-700'
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon
          name={notification.type === 'success' ? 'check_circle' : 'error'}
          className="text-2xl flex-shrink-0"
        />
        <span className="font-body-md font-semibold">{notification.message}</span>
      </div>
      <button
        onClick={onClose}
        className="text-slate-500 hover:text-slate-800 p-1"
        aria-label="Tutup pemberitahuan"
      >
        <Icon name="close" />
      </button>
    </div>
  );
};
