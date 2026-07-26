import React from 'react';
import type { Service } from '@/types';
import { Icon } from '@/components/atoms/Icon';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="p-10 border border-outline-variant/20 hover:border-heritage-red/30 transition-all group bg-surface">
      <Icon
        name={service.icon}
        className="text-heritage-red text-[40px] mb-8 block transition-transform group-hover:scale-110"
      />
      <h3 className="font-headline-md text-on-surface mb-4">{service.title}</h3>
      <p className="text-on-surface-variant font-body-md">{service.description}</p>
    </div>
  );
};
