import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { getDataSourceConfig, getExternalApiConfig } from '../config/dataSource';
import { normalizeRestaurants } from '../utils/restaurantNormalize';
import { adaptExternalRestaurants } from '../utils/externalRestaurantAdapter';
import type { NormalizedRestaurant } from '../types/restaurant';

interface RestaurantQueryParams {
  category?: string;
  budgetCodes?: string[];
  location?: string;
  latitude?: number | null;
  longitude?: number | null;
}

export function useGetRestaurants(params?: RestaurantQueryParams) {
  const { actor, isFetching } = useActor();
  const dataSourceConfig = getDataSourceConfig();

  return useQuery<NormalizedRestaurant[], Error>({
    queryKey: [
      'restaurants',
      dataSourceConfig.mode,
      params?.category,
      params?.budgetCodes,
      params?.location,
      params?.latitude,
      params?.longitude,
    ],
    queryFn: async () => {
      try {
        if (dataSourceConfig.mode === 'mock') {
          // Mock mode: use backend actor
          if (!actor) return [];
          const restaurants = await actor.getRestaurants(true);
          return normalizeRestaurants(restaurants);
        } else {
          // External mode: fetch from external API
          const externalConfig = getExternalApiConfig();
          
          if (!externalConfig.url || !externalConfig.key) {
            console.warn('External API not configured, returning empty results');
            return [];
          }

          // Build query parameters
          const queryParams = new URLSearchParams();
          
          if (params?.latitude && params?.longitude) {
            queryParams.append('lat', params.latitude.toString());
            queryParams.append('lng', params.longitude.toString());
          }
          
          if (params?.category) {
            queryParams.append('genre', params.category);
          }
          
          if (params?.budgetCodes && params.budgetCodes.length > 0) {
            queryParams.append('budget', params.budgetCodes.join(','));
          }
          
          if (params?.location) {
            queryParams.append('keyword', params.location);
          }

          // Construct URL with query parameters
          const url = queryParams.toString() 
            ? `${externalConfig.url}?${queryParams.toString()}`
            : externalConfig.url;

          // Fetch from external API
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${externalConfig.key}`,
              'X-API-Key': externalConfig.key,
            },
          });

          if (!response.ok) {
            throw new Error(`External API error: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();
          
          // Adapt external data to Restaurant type
          const restaurants = adaptExternalRestaurants(data);
          
          // Normalize to ensure exactly 5 photos each
          return normalizeRestaurants(restaurants);
        }
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
        // Return empty array on error to prevent crash
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: 1,
  });
}

export function useDataSourceWarning() {
  const dataSourceConfig = getDataSourceConfig();
  return dataSourceConfig.warningMessage;
}
