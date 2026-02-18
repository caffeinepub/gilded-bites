import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
}

export function StarRating({ rating, maxStars = 5 }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of ${maxStars} stars`}>
      {Array.from({ length: maxStars }, (_, index) => {
        const isFilled = index < fullStars;
        const isHalf = index === fullStars && hasHalfStar;

        return (
          <Star
            key={index}
            className={`w-5 h-5 ${
              isFilled || isHalf ? 'text-accent fill-accent' : 'text-zinc-700 fill-zinc-700'
            }`}
            style={
              isHalf
                ? {
                    background: 'linear-gradient(90deg, oklch(var(--accent)) 50%, rgb(63, 63, 70) 50%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }
                : undefined
            }
          />
        );
      })}
    </div>
  );
}
