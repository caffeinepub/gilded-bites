import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FilterState } from '../../hooks/useDiscoveryFilters';
import { getBudgetLabel } from '../../utils/hotPepperBudget';

interface FiltersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApply: () => void;
  categories: string[];
}

export function FiltersSheet({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  onApply,
  categories,
}: FiltersSheetProps) {
  const handleCategoryChange = (value: string) => {
    onFiltersChange({ ...filters, category: value });
  };

  const handlePriceRangeChange = (value: number[]) => {
    onFiltersChange({ ...filters, priceRange: [value[0], value[1]] });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, location: e.target.value });
  };

  const handleReset = () => {
    onFiltersChange({
      category: 'all',
      peopleCount: 2,
      priceRange: [1, 5],
      location: '',
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="bg-black border-t border-accent/30">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold text-white">Filters</SheetTitle>
          <SheetDescription className="text-gray-400">
            Refine your restaurant search
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 pb-6">
          {/* Food Category */}
          <div className="space-y-3">
            <Label htmlFor="category" className="text-base font-semibold text-white">
              Food Category
            </Label>
            <Select value={filters.category} onValueChange={handleCategoryChange}>
              <SelectTrigger 
                id="category"
                className="bg-zinc-900 border-accent/40 text-white hover:border-accent focus:border-accent focus:ring-accent transition-colors"
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-accent/30">
                <SelectItem value="all" className="text-white hover:bg-accent/10 focus:bg-accent/10">
                  All Categories
                </SelectItem>
                {categories.map((category) => (
                  <SelectItem 
                    key={category} 
                    value={category}
                    className="text-white hover:bg-accent/10 focus:bg-accent/10"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Budget Range */}
          <div className="space-y-3">
            <Label htmlFor="budget" className="text-base font-semibold text-white">
              Budget Range
            </Label>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-accent font-medium text-sm">
                {getBudgetLabel(filters.priceRange[0])}
              </span>
              <span className="text-gray-500">to</span>
              <span className="text-accent font-medium text-sm">
                {getBudgetLabel(filters.priceRange[1])}
              </span>
            </div>
            <Slider
              id="budget"
              min={1}
              max={5}
              step={1}
              value={filters.priceRange}
              onValueChange={handlePriceRangeChange}
              className="[&_[role=slider]]:bg-accent [&_[role=slider]]:border-accent [&_.bg-primary]:bg-accent"
            />
          </div>

          {/* Location */}
          <div className="space-y-3">
            <Label htmlFor="location" className="text-base font-semibold text-white">
              Location / Keyword
            </Label>
            <Input
              id="location"
              type="text"
              placeholder="e.g., Tokyo, Shibuya"
              value={filters.location}
              onChange={handleLocationChange}
              className="bg-zinc-900 border-accent/40 text-white placeholder:text-gray-500 hover:border-accent focus:border-accent focus:ring-accent transition-colors"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-4 border-t border-accent/20">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1 border-accent/40 text-white hover:bg-accent/10 hover:border-accent transition-colors"
          >
            Reset
          </Button>
          <Button
            onClick={onApply}
            className="flex-1 bg-accent hover:bg-accent/90 text-black font-semibold transition-colors"
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
