import { useState, useCallback } from 'react';

export type SwipeAction = 'like' | 'reject';

export function useSwipeStack(totalItems: number) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastAction, setLastAction] = useState<SwipeAction | null>(null);

  const handleSwipe = useCallback((action: SwipeAction) => {
    setLastAction(action);
    setCurrentIndex((prev) => Math.min(prev + 1, totalItems - 1));
  }, [totalItems]);

  const handleLike = useCallback(() => {
    handleSwipe('like');
  }, [handleSwipe]);

  const handleReject = useCallback(() => {
    handleSwipe('reject');
  }, [handleSwipe]);

  const isComplete = currentIndex >= totalItems - 1;

  return {
    currentIndex,
    handleLike,
    handleReject,
    lastAction,
    isComplete,
  };
}
