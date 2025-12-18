import { MapPin, Star, Heart, Share2 } from 'lucide-react';
import { BottomNav } from '../BottomNav';
import { SafetyBadge } from '../SafetyBadge';
import { realRestaurants, restaurantMenus } from '../../data/restaurantData';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { SavedMenuItem, SavedRestaurant, UserPreferences } from '../../types';
import { calculateSafetyLevel } from '../../utils/safetyCalculator';
import { Button } from '../ui/button';
import { toast } from 'sonner@2.0.3';

interface SavedScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  savedMenuItems: SavedMenuItem[];
  savedRestaurants: SavedRestaurant[];
  userPreferences?: UserPreferences;
}

export function SavedScreen({ onNavigate, savedMenuItems, savedRestaurants, userPreferences }: SavedScreenProps) {
  console.log('SavedScreen - savedRestaurants:', savedRestaurants);
  console.log('SavedScreen - savedMenuItems:', savedMenuItems);
  
  // Get actual saved restaurant data
  const savedRestaurantsWithDetails = savedRestaurants.map(saved => {
    const restaurant = realRestaurants.find(r => r.id === saved.restaurantId);
    if (!restaurant) {
      console.log('Restaurant not found for ID:', saved.restaurantId);
      return null;
    }
    
    return {
      ...restaurant,
      savedAt: saved.savedAt
    };
  }).filter(Boolean);
  
  console.log('SavedScreen - savedRestaurantsWithDetails:', savedRestaurantsWithDetails);

  // Get actual saved menu items from the savedMenuItems array
  const savedDishesWithDetails = savedMenuItems.map(saved => {
    const restaurant = realRestaurants.find(r => r.id === saved.restaurantId);
    const menuItems = restaurantMenus[saved.restaurantId] || [];
    const menuItem = menuItems.find(item => item.id === saved.menuItemId);
    
    if (!menuItem || !restaurant) return null;
    
    const safetyLevel = userPreferences 
      ? calculateSafetyLevel(menuItem, userPreferences)
      : menuItem.safetyLevel;
    
    return {
      ...menuItem,
      restaurantName: saved.restaurantName,
      restaurantId: saved.restaurantId,
      savedAt: saved.savedAt,
      safetyLevel
    };
  }).filter(Boolean);

  // Handle export for premium users
  const handleExport = () => {
    const exportText = `My Safe Restaurants\n\n${savedRestaurants.map(r => 
      `${r.restaurantName} - ${r.cuisine}`
    ).join('\n')}`;
    
    navigator.clipboard.writeText(exportText);
    toast.success('Restaurant list copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-secondary pb-20">
      {/* Header */}
      <div className="bg-card px-6 pt-6 pb-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">Saved</h1>
          {savedRestaurants.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Share2 size={16} className="mr-2" />
              Export List
            </Button>
          )}
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Saved Restaurants */}
        <div>
          <h2 className="text-xl mb-4">Restaurants</h2>
          {savedRestaurantsWithDetails.length > 0 ? (
            <div className="space-y-4">
              {savedRestaurantsWithDetails.map(restaurant => (
                <button
                  key={restaurant.id}
                  onClick={() => onNavigate('restaurant-detail', { restaurant })}
                  className="w-full bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4 p-4">
                    <ImageWithFallback
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 text-left">
                      <h3 className="text-lg mb-1">{restaurant.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{restaurant.cuisine}</p>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-500 fill-yellow-500" />
                          <span className="text-sm">{restaurant.rating}</span>
                        </div>
                        <span className="text-muted-foreground">•</span>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin size={14} />
                          <span className="text-sm">{restaurant.distance}</span>
                        </div>
                      </div>

                      <SafetyBadge level={restaurant.safetyLevel} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-card rounded-2xl border border-border">
              <Heart size={48} className="text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground mb-2">No saved restaurants yet</p>
              <p className="text-sm text-muted-foreground">Explore and save your favorite places</p>
            </div>
          )}
        </div>

        {/* Saved Menu Items */}
        <div>
          <h2 className="text-xl mb-4">Menu Items</h2>
          {savedDishesWithDetails.length > 0 ? (
            <div className="space-y-4">
              {savedDishesWithDetails.map(item => (
                <button
                  key={`${item.restaurantId}-${item.id}`}
                  onClick={() => onNavigate('menu-item-detail', { 
                    item, 
                    restaurantId: item.restaurantId,
                    restaurantName: item.restaurantName 
                  })}
                  className="w-full bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4 p-4">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 text-left">
                      <h3 className="text-lg mb-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{item.restaurantName}</p>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">${item.price}</span>
                      </div>

                      <SafetyBadge level={item.safetyLevel} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-card rounded-2xl border border-border">
              <Heart size={48} className="text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground mb-2">No saved menu items yet</p>
              <p className="text-sm text-muted-foreground">Save your favorite dishes to find them easily</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}