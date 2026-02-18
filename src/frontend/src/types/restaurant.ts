import type { Restaurant } from '../backend';

/**
 * Normalized restaurant type with photoUrls array.
 * This is the shape used throughout the UI after normalization.
 */
export type NormalizedRestaurant = Restaurant & {
  photoUrls: string[];
};
