import { useQuery } from '@tanstack/react-query';

import { fetchProperties, fetchPropertyById, type PropertyFilterParams } from '@/services/propertyService';

/**
 * React Query hook to list down available properties via native Bun REST API.
 * Handles caching, loading, refetching on parameter changes.
 */
export function useProperties(filters?: PropertyFilterParams) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: () => fetchProperties(filters),
  });
}

/**
 * React Query hook to fetch a single property details by ID.
 */
export function useProperty(id?: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => (id ? fetchPropertyById(id) : Promise.reject('No property ID provided')),
    enabled: Boolean(id),
  });
}
