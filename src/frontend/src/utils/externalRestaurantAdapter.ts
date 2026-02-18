import type { Restaurant } from '../backend';

/**
 * External API response shape (assumed structure based on common restaurant APIs).
 * Adjust this interface to match your actual external API response format.
 */
interface ExternalRestaurantResponse {
  id?: string | number;
  name?: string;
  category?: string;
  genre?: { name?: string };
  rating?: number | string;
  budget?: { name?: string } | string;
  price_range?: string;
  distance?: number | string;
  photo?: { pc?: { l?: string; m?: string }; mobile?: { l?: string } };
  photos?: Array<{ pc?: { l?: string }; mobile?: { l?: string } }>;
  logo_image?: string;
  [key: string]: any;
}

/**
 * Converts external API restaurant data to the app's Restaurant type.
 * Handles various common API response formats and provides safe defaults.
 */
export function adaptExternalRestaurant(
  external: ExternalRestaurantResponse,
  index: number
): Restaurant {
  // Extract and validate ID
  const id = typeof external.id === 'number' 
    ? BigInt(external.id) 
    : typeof external.id === 'string' 
    ? BigInt(parseInt(external.id, 10) || index) 
    : BigInt(index);

  // Extract name with fallback
  const name = external.name || `Restaurant ${index + 1}`;

  // Extract category from various possible fields
  const category = 
    external.category || 
    external.genre?.name || 
    external.type || 
    'Restaurant';

  // Extract and normalize star rating (0-5 scale)
  let starRating = 0;
  if (typeof external.rating === 'number') {
    starRating = Math.min(5, Math.max(0, external.rating));
  } else if (typeof external.rating === 'string') {
    starRating = Math.min(5, Math.max(0, parseFloat(external.rating) || 0));
  }

  // Extract price range - ensure it's always a string
  let priceRange = '$$';
  if (external.price_range && typeof external.price_range === 'string') {
    priceRange = external.price_range;
  } else if (external.budget) {
    if (typeof external.budget === 'string') {
      priceRange = external.budget;
    } else if (typeof external.budget === 'object' && external.budget.name) {
      priceRange = external.budget.name;
    }
  }

  // Extract distance (in km)
  let distance = 0;
  if (typeof external.distance === 'number') {
    distance = external.distance;
  } else if (typeof external.distance === 'string') {
    distance = parseFloat(external.distance) || 0;
  }

  // Extract photos
  const photos: Array<{ url: string; width: bigint; height: bigint }> = [];
  
  // Try to extract main photo from various possible fields
  const mainPhotoUrl = 
    external.photo?.pc?.l || 
    external.photo?.mobile?.l || 
    external.logo_image || 
    external.image || 
    '';

  const mainPhoto = mainPhotoUrl ? {
    url: mainPhotoUrl,
    width: BigInt(800),
    height: BigInt(600),
  } : undefined;

  // Extract additional photos
  if (external.photos && Array.isArray(external.photos)) {
    external.photos.forEach((photo: any) => {
      const photoUrl = photo?.pc?.l || photo?.mobile?.l || photo?.url || '';
      if (photoUrl && photos.length < 4) {
        photos.push({
          url: photoUrl,
          width: BigInt(400),
          height: BigInt(300),
        });
      }
    });
  }

  return {
    id,
    name,
    category,
    starRating,
    priceRange,
    distance,
    mainPhoto,
    subPhotos: photos,
  };
}

/**
 * Converts an array of external API restaurants to the app's Restaurant type.
 * Filters out invalid entries and provides error handling.
 */
export function adaptExternalRestaurants(
  externalData: any
): Restaurant[] {
  try {
    // Handle various response formats
    let restaurants: ExternalRestaurantResponse[] = [];
    
    if (Array.isArray(externalData)) {
      restaurants = externalData;
    } else if (externalData?.results && Array.isArray(externalData.results)) {
      restaurants = externalData.results;
    } else if (externalData?.data && Array.isArray(externalData.data)) {
      restaurants = externalData.data;
    } else if (externalData?.restaurants && Array.isArray(externalData.restaurants)) {
      restaurants = externalData.restaurants;
    } else if (externalData?.shop && Array.isArray(externalData.shop)) {
      // Hot Pepper API format
      restaurants = externalData.shop;
    }

    // Convert and filter valid restaurants
    return restaurants
      .map((external, index) => adaptExternalRestaurant(external, index))
      .filter(restaurant => restaurant.name && restaurant.name.trim() !== '');
  } catch (error) {
    console.error('Error adapting external restaurants:', error);
    return [];
  }
}
