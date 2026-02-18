import { useState } from 'react';
import { useGetRestaurants, useDataSourceWarning } from '../hooks/useQueries';
import { useDiscoveryFilters } from '../hooks/useDiscoveryFilters';
import { useDiscoveryDeck } from '../hooks/useDiscoveryDeck';
import { useSwipeStack } from '../hooks/useSwipeStack';
import { useGeolocation } from '../hooks/useGeolocation';
import { useHiddenRestaurants } from '../hooks/useHiddenRestaurants';
import { useSaveFavorite } from '../hooks/useFavorites';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { SwipeCardStack } from '../components/discovery/SwipeCardStack';
import { ActionButtons } from '../components/discovery/ActionButtons';
import { FiltersSheet } from '../components/discovery/FiltersSheet';
import { SlidersHorizontal, Heart, AlertCircle, X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getBudgetCodesFromRange } from '../utils/hotPepperBudget';
import type { DeckItem } from '../hooks/useDiscoveryDeck';

export function DiscoveryPage() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dismissedWarning, setDismissedWarning] = useState(false);
  const [dismissedLocationWarning, setDismissedLocationWarning] = useState(false);
  const [dismissedAuthWarning, setDismissedAuthWarning] = useState(false);
  
  const { identity } = useInternetIdentity();
  const { filters, setFilters, appliedFilters, applyFilters } = useDiscoveryFilters();
  const { latitude, longitude, isLoading: geoLoading, error: geoError, isPermissionDenied } = useGeolocation();
  const { hiddenIds, addHidden } = useHiddenRestaurants();
  
  // Build query params from applied filters
  const queryParams = {
    category: appliedFilters.category !== 'all' ? appliedFilters.category : undefined,
    budgetCodes: getBudgetCodesFromRange(appliedFilters.priceRange),
    location: appliedFilters.location || undefined,
    latitude,
    longitude,
  };
  
  const { data: restaurants = [], isLoading, error } = useGetRestaurants(queryParams);
  const dataSourceWarning = useDataSourceWarning();
  const deck = useDiscoveryDeck(restaurants, hiddenIds);
  const { currentIndex, handleLike, handleReject, isComplete } = useSwipeStack(deck.length);
  const saveFavoriteMutation = useSaveFavorite();

  const currentItem = deck[currentIndex];
  const showWarning = dataSourceWarning && !dismissedWarning;
  const showLocationWarning = !geoLoading && (geoError || isPermissionDenied) && !dismissedLocationWarning;
  const isAuthenticated = !!identity;

  // Extract unique categories from restaurants
  const categories = Array.from(new Set(restaurants.map(r => r.category)));

  const handleSwipe = (item: DeckItem, action: 'like' | 'reject') => {
    if (item.type === 'restaurant') {
      if (action === 'like') {
        // Save to favorites if authenticated
        if (isAuthenticated) {
          saveFavoriteMutation.mutate(item.data);
        } else if (!dismissedAuthWarning) {
          // Show non-blocking warning
          setDismissedAuthWarning(true);
        }
      } else {
        // Add to hidden list (session-only)
        addHidden(item.data.id);
      }
    }
    // Ad cards: just advance, no persistence
    
    // Advance the deck
    if (action === 'like') {
      handleLike();
    } else {
      handleReject();
    }
  };

  const handleApplyFilters = () => {
    applyFilters();
    setFiltersOpen(false);
  };

  if (isLoading || geoLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-white text-xl font-medium">
            {geoLoading ? 'Getting your location...' : 'Loading restaurants...'}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-reject mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Unable to Load Restaurants</h2>
          <p className="text-gray-400 mb-6">
            We encountered an error while fetching restaurant data. Please check your connection and try again.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-accent hover:bg-accent/90 text-black font-semibold"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header with DishMatch branding */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-accent/20 backdrop-blur-sm bg-black">
        <div className="flex items-center gap-3">
          <img 
            src="/assets/generated/dishmatch-logo.dim_256x256.png" 
            alt="DishMatch Logo" 
            className="w-10 h-10"
          />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">DishMatch</h1>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setFiltersOpen(true)}
          className="border-accent/50 hover:bg-accent/10 hover:border-accent transition-all duration-200"
        >
          <SlidersHorizontal className="w-5 h-5 text-accent" />
        </Button>
      </header>

      {/* Data source warning banner */}
      {showWarning && (
        <div className="px-4 py-3 bg-black border-b border-accent/20">
          <Alert className="bg-zinc-900/50 border-accent/30">
            <AlertCircle className="h-4 w-4 text-accent" />
            <AlertDescription className="text-sm text-gray-300 flex items-start justify-between gap-2">
              <span>{dataSourceWarning}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 hover:bg-accent/10 flex-shrink-0"
                onClick={() => setDismissedWarning(true)}
              >
                <X className="h-3 w-3 text-accent" />
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Location warning banner */}
      {showLocationWarning && (
        <div className="px-4 py-3 bg-black border-b border-accent/20">
          <Alert className="bg-zinc-900/50 border-accent/30">
            <MapPin className="h-4 w-4 text-accent" />
            <AlertDescription className="text-sm text-gray-300 flex items-start justify-between gap-2">
              <span>
                {isPermissionDenied 
                  ? 'Location access denied. Showing restaurants without distance filtering.'
                  : 'Unable to get your location. Showing restaurants without distance filtering.'}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 hover:bg-accent/10 flex-shrink-0"
                onClick={() => setDismissedLocationWarning(true)}
              >
                <X className="h-3 w-3 text-accent" />
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Auth warning banner (shown once after first swipe-right when not authenticated) */}
      {dismissedAuthWarning && !isAuthenticated && (
        <div className="px-4 py-3 bg-black border-b border-accent/20">
          <Alert className="bg-zinc-900/50 border-accent/30">
            <Heart className="h-4 w-4 text-accent" />
            <AlertDescription className="text-sm text-gray-300 flex items-start justify-between gap-2">
              <span>
                Sign in to save your favorite restaurants and access them later.
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 hover:bg-accent/10 flex-shrink-0"
                onClick={() => setDismissedAuthWarning(false)}
              >
                <X className="h-3 w-3 text-accent" />
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content with improved spacing */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative">
        {isComplete ? (
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-accent fill-accent" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">No More Restaurants</h2>
            <p className="text-gray-400 text-lg">You've seen all available restaurants. Check back later!</p>
          </div>
        ) : (
          <>
            <SwipeCardStack
              items={deck}
              currentIndex={currentIndex}
              onSwipe={(item, action) => handleSwipe(item, action)}
            />
            
            <ActionButtons
              onLike={() => currentItem && handleSwipe(currentItem, 'like')}
              onReject={() => currentItem && handleSwipe(currentItem, 'reject')}
              disabled={isComplete}
            />
          </>
        )}
      </main>

      {/* Footer with improved styling */}
      <footer className="px-6 py-5 border-t border-accent/20 text-center text-sm text-gray-500 backdrop-blur-sm bg-black">
        <p>
          © {new Date().getFullYear()} Built with{' '}
          <Heart className="inline w-4 h-4 text-accent fill-accent" /> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      {/* Filters Sheet */}
      <FiltersSheet
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        filters={filters}
        onFiltersChange={setFilters}
        onApply={handleApplyFilters}
        categories={categories}
      />
    </div>
  );
}
