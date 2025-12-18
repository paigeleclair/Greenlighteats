import { Leaf, Wheat, Moon } from 'lucide-react';

interface DietaryIconProps {
  tag: string;
  size?: number;
}

export function DietaryIcon({ tag, size = 16 }: DietaryIconProps) {
  const getIcon = () => {
    switch (tag.toLowerCase()) {
      case 'vegan':
        return <Leaf size={size} className="text-green-600" />;
      case 'gf':
      case 'gluten-free':
        return <Wheat size={size} className="text-amber-600" />;
      case 'halal':
      case 'kosher':
        return <Moon size={size} className="text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100">
      {getIcon()}
    </div>
  );
}
