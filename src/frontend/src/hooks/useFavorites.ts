import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { NormalizedRestaurant } from '../types/restaurant';
import { getDataSourceConfig } from '../config/dataSource';
import { createFavoritePayload } from '../utils/favoritePayload';

export function useSaveFavorite() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const dataSourceConfig = getDataSourceConfig();

  return useMutation({
    mutationFn: async (restaurant: NormalizedRestaurant) => {
      if (!actor) {
        throw new Error('Actor not available');
      }
      if (!identity) {
        throw new Error('User not authenticated');
      }

      if (dataSourceConfig.mode === 'mock') {
        // Mock mode: use swipeRight with restaurant ID
        await actor.swipeRight(restaurant.id, true);
      } else {
        // External mode: save full restaurant object
        const payload = createFavoritePayload(restaurant);
        await actor.saveFavoriteRestaurantFromApi(payload);
      }
    },
    onSuccess: () => {
      // Invalidate favorites query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error) => {
      console.error('Failed to save favorite:', error);
    },
  });
}
