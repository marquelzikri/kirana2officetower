import { Property } from '../types';

export interface PropertyFilterParams {
  searchQuery?: string;
  zone?: string;
  condition?: string;
  type?: string;
  sizeRange?: string;
  sortBy?: string;
}

export interface PropertiesApiResponse {
  properties: Property[];
  totalCount: number;
}

export async function fetchProperties(filters?: PropertyFilterParams): Promise<PropertiesApiResponse> {
  const params = new URLSearchParams();
  if (filters?.searchQuery) params.append('search', filters.searchQuery);
  if (filters?.zone && filters.zone !== 'all') params.append('zone', filters.zone);
  if (filters?.condition && filters.condition !== 'all') params.append('condition', filters.condition);
  if (filters?.type && filters.type !== 'all') params.append('type', filters.type);
  if (filters?.sizeRange && filters.sizeRange !== 'all') params.append('sizeRange', filters.sizeRange);
  if (filters?.sortBy && filters.sortBy !== 'default') params.append('sortBy', filters.sortBy);

  const queryString = params.toString();
  const url = `/api/properties${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch properties: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchPropertyById(id: string): Promise<Property> {
  const response = await fetch(`/api/properties/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch property details: ${response.statusText}`);
  }

  return response.json();
}
