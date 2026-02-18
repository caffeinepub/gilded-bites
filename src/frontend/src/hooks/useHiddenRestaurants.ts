import { useState, useCallback } from 'react';

/**
 * Session-only hidden restaurant IDs store.
 * Hidden restaurants are excluded from the deck for the current session only.
 * Does not persist across page reloads.
 */
export function useHiddenRestaurants() {
  const [hiddenIds, setHiddenIds] = useState<Set<bigint>>(new Set());

  const addHidden = useCallback((id: bigint) => {
    setHiddenIds((prev) => new Set(prev).add(id));
  }, []);

  const isHidden = useCallback((id: bigint) => {
    return hiddenIds.has(id);
  }, [hiddenIds]);

  const clearHidden = useCallback(() => {
    setHiddenIds(new Set());
  }, []);

  return {
    hiddenIds,
    addHidden,
    isHidden,
    clearHidden,
  };
}
