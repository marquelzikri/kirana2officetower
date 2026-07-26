import React from 'react';

import { Icon } from '@/components/atoms/Icon';

interface ContactItemProps {
  icon: string;
  children: React.ReactNode;
}

export const ContactItem: React.FC<ContactItemProps> = ({ icon, children }) => {
  return (
    <li className="flex gap-4">
      <Icon name={icon} className="text-heritage-red shrink-0 mt-0.5" />
      <span className="text-on-surface-variant font-body-md">{children}</span>
    </li>
  );
};
