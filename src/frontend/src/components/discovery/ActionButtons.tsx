import { X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  onLike: () => void;
  onReject: () => void;
  disabled?: boolean;
}

export function ActionButtons({ onLike, onReject, disabled }: ActionButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-10 mt-8">
      <Button
        size="lg"
        variant="outline"
        onClick={onReject}
        disabled={disabled}
        className="w-16 h-16 rounded-full border-2 border-reject hover:bg-reject/20 hover:border-reject hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
      >
        <X className="w-8 h-8 text-reject" />
      </Button>

      <Button
        size="lg"
        variant="outline"
        onClick={onLike}
        disabled={disabled}
        className="w-20 h-20 rounded-full border-2 border-success hover:bg-success/20 hover:border-success hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
      >
        <Heart className="w-9 h-9 text-success fill-success" />
      </Button>
    </div>
  );
}
