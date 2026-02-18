import type { Restaurant } from '../backend';
import type { NormalizedRestaurant } from '../types/restaurant';

/**
 * Converts a NormalizedRestaurant to a backend Restaurant payload.
 * Strips UI-only fields (like photoUrls) to ensure safe Candid transport.
 */
export function createFavoritePayload(normalized: NormalizedRestaurant): Restaurant {
  // Extract only the fields that match the backend Restaurant type
  const payload: Restaurant = {
    id: normalized.id,
    name: normalized.name,
    category: normalized.category,
    starRating: normalized.starRating,
    priceRange: normalized.priceRange,
    distance: normalized.distance,
    mainPhoto: normalized.mainPhoto,
    subPhotos: normalized.subPhotos,
  };

  return payload;
}
