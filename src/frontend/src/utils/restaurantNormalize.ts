import type { Restaurant } from '../backend';
import type { NormalizedRestaurant } from '../types/restaurant';

/**
 * Converts backend Photo objects to URL strings and ensures exactly 5 photo URLs.
 */
export function normalizeRestaurantPhotos(restaurant: Restaurant): NormalizedRestaurant {
  const photoUrls: string[] = [];
  
  // Add main photo if available
  if (restaurant.mainPhoto) {
    photoUrls.push(restaurant.mainPhoto.url);
  }
  
  // Add sub photos
  restaurant.subPhotos.forEach(photo => {
    if (photoUrls.length < 5) {
      photoUrls.push(photo.url);
    }
  });
  
  // If no photos, create 5 empty placeholder URLs
  if (photoUrls.length === 0) {
    return {
      ...restaurant,
      photoUrls: Array(5).fill(''),
    };
  }
  
  // If fewer than 5 photos, repeat existing photos to reach 5
  while (photoUrls.length < 5) {
    const index = photoUrls.length % (restaurant.mainPhoto ? 1 + restaurant.subPhotos.length : restaurant.subPhotos.length);
    if (restaurant.mainPhoto && index === 0) {
      photoUrls.push(restaurant.mainPhoto.url);
    } else {
      const subIndex = restaurant.mainPhoto ? index - 1 : index;
      if (restaurant.subPhotos[subIndex]) {
        photoUrls.push(restaurant.subPhotos[subIndex].url);
      }
    }
  }
  
  // If more than 5 photos, take only the first 5
  if (photoUrls.length > 5) {
    photoUrls.splice(5);
  }
  
  return {
    ...restaurant,
    photoUrls,
  };
}

/**
 * Normalizes an array of restaurants to ensure consistent data structure.
 */
export function normalizeRestaurants(restaurants: Restaurant[]): NormalizedRestaurant[] {
  return restaurants.map(normalizeRestaurantPhotos);
}

/**
 * Generates a fallback placeholder image URL for a restaurant.
 */
export function getRestaurantPlaceholder(restaurant: Restaurant, index: number): string {
  const colors = ['1a1a1a', '2a2a2a', '3a3a3a', '252525', '303030'];
  const color = colors[index % colors.length];
  return `https://placehold.co/600x800/${color}/d4af37?text=${encodeURIComponent(restaurant.name)}`;
}
