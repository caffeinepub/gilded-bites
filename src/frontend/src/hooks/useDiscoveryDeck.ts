import { useMemo } from 'react';
import type { NormalizedRestaurant } from '../types/restaurant';

export type DeckItem = 
  | { type: 'restaurant'; data: NormalizedRestaurant }
  | { type: 'ad'; id: string };

export function useDiscoveryDeck(restaurants: NormalizedRestaurant[], hiddenIds?: Set<bigint>) {
  const deck = useMemo(() => {
    const items: DeckItem[] = [];
    
    // Filter out hidden restaurants
    const visibleRestaurants = hiddenIds 
      ? restaurants.filter(r => !hiddenIds.has(r.id))
      : restaurants;
    
    visibleRestaurants.forEach((restaurant, index) => {
      items.push({ type: 'restaurant', data: restaurant });
      
      // Insert ad placeholder after every 10 restaurants
      if ((index + 1) % 10 === 0 && index < visibleRestaurants.length - 1) {
        items.push({ type: 'ad', id: `ad-${Math.floor(index / 10)}` });
      }
    });
    
    return items;
  }, [restaurants, hiddenIds]);

  return deck;
}
