import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '../ui/button';

interface QuickFiltersScreenProps {
  onApply: (filters: string[]) => void;
  onBack: () => void;
}

export function QuickFiltersScreen({ onApply, onBack }: QuickFiltersScreenProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filterOptions = [
    { id: 'low-sodium', label: 'Low Sodium', icon: '🧂' },
    { id: 'vegan', label: 'Vegan', icon: '🌱' },
    { id: 'halal', label: 'Halal', icon: '☪️' },
    { id: 'kosher', label: 'Kosher', icon: '✡️' },
    { id: 'kid-friendly', label: 'Kid Friendly', icon: '👶' },
    { id: 'gluten-free', label: 'Gluten Free', icon: '🌾' },
    { id: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
    { id: 'diabetic', label: 'Diabetic', icon: '💉' }
  ];

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={onBack}>
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <h2 className="text-xl">Quick Filters</h2>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-6 pb-24">
        <p className="text-gray-600 mb-6">Select dietary restrictions to filter restaurants</p>
        
        <div className="flex flex-wrap gap-3">
          {filterOptions.map(filter => (
            <button
              key={filter.id}
              onClick={() => toggleFilter(filter.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-full border-2 transition-all ${
                selectedFilters.includes(filter.id)
                  ? 'bg-[#2D7A46] border-[#2D7A46] text-white'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-[#2D7A46]'
              }`}
            >
              <span className="text-lg">{filter.icon}</span>
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 space-y-3">
        <Button 
          onClick={() => onApply(selectedFilters)}
          className="w-full bg-[#2D7A46] hover:bg-[#236034] text-white rounded-xl h-12"
        >
          Apply Filters
        </Button>
        <Button 
          onClick={onBack}
          variant="outline"
          className="w-full border-gray-300 text-gray-700 rounded-xl h-12"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
