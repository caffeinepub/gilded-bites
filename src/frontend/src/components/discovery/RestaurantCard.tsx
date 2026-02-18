import { useState } from 'react';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { StarRating } from './StarRating';
import type { NormalizedRestaurant } from '../../types/restaurant';

interface RestaurantCardProps {
  restaurant: NormalizedRestaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const photos = restaurant.photoUrls;
  const currentPhoto = photos[currentPhotoIndex];

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
    setImageError(false);
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-zinc-800">
      {/* Photo with navigation zones */}
      <div className="absolute inset-0">
        {imageError ? (
          <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center">
            <div className="text-center px-8">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{restaurant.name}</h3>
              <p className="text-gray-400">Image unavailable</p>
            </div>
          </div>
        ) : (
          <img
            src={currentPhoto}
            alt={`${restaurant.name} - Photo ${currentPhotoIndex + 1}`}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        )}

        {/* Left/Right tap zones for photo navigation */}
        {!imageError && photos.length > 1 && (
          <>
            <button
              onClick={handlePrevPhoto}
              className="absolute left-0 top-0 bottom-0 w-1/2 group cursor-pointer"
              aria-label="Previous photo"
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronLeft className="w-10 h-10 text-white drop-shadow-lg" />
              </div>
            </button>
            <button
              onClick={handleNextPhoto}
              className="absolute right-0 top-0 bottom-0 w-1/2 group cursor-pointer"
              aria-label="Next photo"
            >
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-10 h-10 text-white drop-shadow-lg" />
              </div>
            </button>
          </>
        )}

        {/* Photo indicators */}
        {!imageError && photos.length > 1 && (
          <div className="absolute top-4 left-0 right-0 flex justify-center gap-1.5 px-4">
            {photos.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-all ${
                  index === currentPhotoIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        )}

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 overlay-gradient-dark pointer-events-none" />
      </div>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white pointer-events-none">
        <h2 className="text-3xl font-extrabold mb-2 text-shadow-premium">{restaurant.name}</h2>
        
        <div className="flex items-center gap-3 mb-3">
          <StarRating rating={restaurant.starRating} />
          <span className="text-accent font-semibold text-lg">{restaurant.starRating.toFixed(1)}</span>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium">
          <span className="px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full border border-accent/30 text-accent">
            {restaurant.category}
          </span>
          <span className="px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full border border-accent/30 text-accent">
            {restaurant.priceRange}
          </span>
          {restaurant.distance > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full border border-accent/30">
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-white">{restaurant.distance.toFixed(1)} km</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
