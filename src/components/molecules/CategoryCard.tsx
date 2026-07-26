import React from 'react';

import { Icon } from '@/components/atoms/Icon';
import { type Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <a
      href={category.href || '#'}
      className="group bg-surface p-10 hover:bg-surface-container transition-colors block"
    >
      <Icon
        name={category.icon}
        className="text-heritage-red mb-6 text-[32px] group-hover:scale-110 transition-transform block"
      />
      <h3 className="text-headline-md-mobile md:text-headline-md text-on-surface mb-2">
        {category.title}
      </h3>
      <p className="font-metadata text-on-surface-variant">
        {category.count} listings
      </p>
    </a>
  );
};
