import { useState } from 'react';
import type { DeckItem } from '../../hooks/useDiscoveryDeck';
import { SwipeableCard } from './SwipeableCard';
import { RestaurantCard } from './RestaurantCard';
import { AdPlaceholderCard } from './AdPlaceholderCard';
import type { SwipeAction } from '../../hooks/useSwipeStack';

interface SwipeCardStackProps {
  items: DeckItem[];
  currentIndex: number;
  onSwipe: (item: DeckItem, action: SwipeAction) => void;
}

export function SwipeCardStack({ items, currentIndex, onSwipe }: SwipeCardStackProps) {
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const handleSwipeComplete = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    const action: SwipeAction = direction === 'right' ? 'like' : 'reject';
    const currentItem = items[currentIndex];
    
    setTimeout(() => {
      onSwipe(currentItem, action);
      setSwipeDirection(null);
    }, 300);
  };

  const visibleItems = items.slice(currentIndex, currentIndex + 3);

  return (
    <div className="relative w-full max-w-md h-[600px] mb-8">
      {visibleItems.map((item, index) => {
        const isTop = index === 0;
        const zIndex = visibleItems.length - index;
        const scale = 1 - index * 0.05;
        const translateY = index * 10;

        return (
          <div
            key={item.type === 'restaurant' ? item.data.id.toString() : item.id}
            className="absolute inset-0 transition-all duration-300"
            style={{
              zIndex,
              transform: `scale(${scale}) translateY(${translateY}px)`,
              opacity: index < 2 ? 1 : 0,
            }}
          >
            {isTop ? (
              <SwipeableCard onSwipeComplete={handleSwipeComplete}>
                {item.type === 'restaurant' ? (
                  <RestaurantCard restaurant={item.data} />
                ) : (
                  <AdPlaceholderCard />
                )}
              </SwipeableCard>
            ) : (
              <div className="w-full h-full pointer-events-none">
                {item.type === 'restaurant' ? (
                  <RestaurantCard restaurant={item.data} />
                ) : (
                  <AdPlaceholderCard />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
