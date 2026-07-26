import type { Property } from '@/types';
import { featuredProperties } from './mockProperties/featured';
import { additionalProperties } from './mockProperties/additional';

export { featuredProperties, additionalProperties };

export const allProperties: Property[] = [
  ...featuredProperties,
  ...additionalProperties,
];
