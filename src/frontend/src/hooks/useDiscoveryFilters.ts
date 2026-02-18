import { useState, useCallback } from 'react';

export interface FilterState {
  category: string;
  peopleCount: number;
  priceRange: [number, number];
  location: string;
}

export function useDiscoveryFilters() {
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    peopleCount: 2,
    priceRange: [1, 5],
    location: '',
  });

  const [appliedFilters, setAppliedFilters] = useState<FilterState>(filters);

  const applyFilters = useCallback(() => {
    setAppliedFilters({ ...filters });
  }, [filters]);

  return {
    filters,
    setFilters,
    appliedFilters,
    applyFilters,
  };
}
