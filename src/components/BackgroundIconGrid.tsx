import { 
  Cherry, 
  Milk, 
  Fish, 
  Wheat, 
  Apple, 
  Carrot, 
  Salad, 
  Egg, 
  Beef, 
  Soup, 
  Croissant,
  LucideIcon 
} from 'lucide-react';

// Icon configuration type
interface IconConfig {
  Icon: LucideIcon;
  column: number; // 1-12 column position
  row: number; // 1-6 row position
  size: number;
  rotation: number;
  opacity: number; // 0.1 to 0.2
}

// Reusable food icon library
export const FOOD_ICONS = {
  cherry: Cherry,
  milk: Milk,
  fish: Fish,
  wheat: Wheat,
  apple: Apple,
  carrot: Carrot,
  salad: Salad,
  egg: Egg,
  beef: Beef,
  soup: Soup,
  croissant: Croissant,
} as const;

// 12-column grid configuration with 8px gutters
const GRID_CONFIG = {
  columns: 12,
  gutterSize: 8, // 8px gutters
  verticalSpacing: 100, // 80-120px vertical spacing (average 100px)
  marginBuffer: {
    top: 40, // Reduced buffer to cover top area
    bottom: 180, // Buffer for button area
    left: 40,
    right: 40,
  },
};

// Default icon layout - distributed across 12-column grid
const DEFAULT_ICON_LAYOUT: IconConfig[] = [
  // Row 0 (very top)
  { Icon: Wheat, column: 2, row: 0, size: 68, rotation: -18, opacity: 0.12 },
  { Icon: Fish, column: 4, row: 0, size: 70, rotation: 22, opacity: 0.13 },
  { Icon: Milk, column: 6, row: 0, size: 66, rotation: -15, opacity: 0.11 },
  { Icon: Apple, column: 8, row: 0, size: 72, rotation: 20, opacity: 0.14 },
  { Icon: Soup, column: 10, row: 0, size: 64, rotation: -25, opacity: 0.12 },
  
  // Row 1 (top, outside logo buffer)
  { Icon: Cherry, column: 1, row: 1, size: 70, rotation: -15, opacity: 0.12 },
  { Icon: Milk, column: 3, row: 1, size: 68, rotation: 18, opacity: 0.14 },
  { Icon: Fish, column: 5, row: 1, size: 65, rotation: 20, opacity: 0.11 },
  { Icon: Wheat, column: 7, row: 1, size: 72, rotation: -22, opacity: 0.13 },
  { Icon: Apple, column: 9, row: 1, size: 75, rotation: -25, opacity: 0.15 },
  { Icon: Carrot, column: 11, row: 1, size: 70, rotation: 15, opacity: 0.12 },
  
  // Row 2
  { Icon: Salad, column: 1, row: 2, size: 68, rotation: 12, opacity: 0.13 },
  { Icon: Egg, column: 3, row: 2, size: 62, rotation: -20, opacity: 0.11 },
  { Icon: Beef, column: 5, row: 2, size: 60, rotation: -18, opacity: 0.14 },
  { Icon: Soup, column: 7, row: 2, size: 66, rotation: 16, opacity: 0.12 },
  { Icon: Croissant, column: 9, row: 2, size: 72, rotation: 22, opacity: 0.15 },
  { Icon: Fish, column: 11, row: 2, size: 68, rotation: -12, opacity: 0.13 },
  
  // Row 3
  { Icon: Apple, column: 1, row: 3, size: 70, rotation: -20, opacity: 0.14 },
  { Icon: Wheat, column: 3, row: 3, size: 64, rotation: 28, opacity: 0.12 },
  { Icon: Cherry, column: 5, row: 3, size: 62, rotation: 25, opacity: 0.11 },
  { Icon: Milk, column: 7, row: 3, size: 68, rotation: -24, opacity: 0.13 },
  { Icon: Carrot, column: 9, row: 3, size: 66, rotation: -15, opacity: 0.15 },
  { Icon: Salad, column: 11, row: 3, size: 72, rotation: 18, opacity: 0.12 },
  
  // Row 4
  { Icon: Fish, column: 1, row: 4, size: 70, rotation: 15, opacity: 0.13 },
  { Icon: Soup, column: 3, row: 4, size: 64, rotation: -26, opacity: 0.11 },
  { Icon: Croissant, column: 5, row: 4, size: 65, rotation: -22, opacity: 0.14 },
  { Icon: Egg, column: 7, row: 4, size: 60, rotation: 24, opacity: 0.12 },
  { Icon: Apple, column: 9, row: 4, size: 68, rotation: 20, opacity: 0.15 },
  { Icon: Beef, column: 11, row: 4, size: 64, rotation: -16, opacity: 0.13 },
  
  // Row 5 (bottom, outside button buffer)
  { Icon: Carrot, column: 1, row: 5, size: 72, rotation: 25, opacity: 0.14 },
  { Icon: Wheat, column: 3, row: 5, size: 68, rotation: -16, opacity: 0.12 },
  { Icon: Cherry, column: 5, row: 5, size: 66, rotation: -18, opacity: 0.11 },
  { Icon: Salad, column: 7, row: 5, size: 70, rotation: 14, opacity: 0.13 },
  { Icon: Fish, column: 9, row: 5, size: 70, rotation: 12, opacity: 0.15 },
  { Icon: Milk, column: 11, row: 5, size: 74, rotation: -20, opacity: 0.12 },
];

interface BackgroundIconGridProps {
  layout?: IconConfig[];
  className?: string;
}

export function BackgroundIconGrid({ 
  layout = DEFAULT_ICON_LAYOUT,
  className = ""
}: BackgroundIconGridProps) {
  // Calculate position based on 12-column grid
  const getIconPosition = (column: number, row: number) => {
    // Column: 1-12, map to percentage (with gutters)
    const columnWidth = 100 / GRID_CONFIG.columns;
    const leftPercent = (column - 1) * columnWidth + (GRID_CONFIG.gutterSize / 10);
    
    // Row: calculate from top with vertical spacing and top buffer
    const topPixels = GRID_CONFIG.marginBuffer.top + (row - 1) * GRID_CONFIG.verticalSpacing;
    
    return {
      left: `${leftPercent}%`,
      top: `${topPixels}px`,
    };
  };

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {layout.map((config, index) => {
        const { Icon, column, row, size, rotation, opacity } = config;
        const position = getIconPosition(column, row);
        
        return (
          <div
            key={`icon-${index}`}
            className="absolute"
            style={{
              left: position.left,
              top: position.top,
              opacity: opacity,
              transform: `rotate(${rotation}deg)`,
            }}
          >
            <Icon 
              size={size} 
              className="text-green-600" 
              strokeWidth={1.5}
            />
          </div>
        );
      })}
    </div>
  );
}

// Export grid config for use in other components
export { GRID_CONFIG };