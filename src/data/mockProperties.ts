import type { Property } from '@/types';

import { additionalProperties } from './mockProperties/additional';
import { featuredProperties } from './mockProperties/featured';

export { additionalProperties,featuredProperties };

export const allProperties: Property[] = [
  ...featuredProperties,
  ...additionalProperties,
];
