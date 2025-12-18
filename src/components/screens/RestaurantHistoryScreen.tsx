import { ChevronLeft, Clock, MapPin, Utensils, Trash2 } from 'lucide-react';
import { RestaurantHistoryItem } from '../../types';
import { Button } from '../ui/button';
import { realRestaurants } from '../../data/restaurantData';

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

interface RestaurantHistoryScreenProps {
  onBack: () => void;
  onNavigate: (screen: string, data?: any) => void;
  restaurantHistory: RestaurantHistoryItem[];
  onClearHistory: () => void;
}

export function RestaurantHistoryScreen({
  onBack,
  onNavigate,
  restaurantHistory,
  onClearHistory
}: RestaurantHistoryScreenProps) {
  const handleRestaurantClick = (restaurantId: string) => {
    // Find the restaurant in the mock data
    const restaurant = realRestaurants.find(r => r.id === restaurantId);
    if (restaurant) {
      onNavigate('restaurant-detail', { restaurant });
    }
  };

  return (
    <div className="min-h-screen bg-secondary pb-6">
      {/* Header */}
      <div className="bg-card px-6 pt-6 pb-4 border-b border-border sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-secondary hover:bg-accent flex items-center justify-center transition-colors"
          >
            <ChevronLeft size={24} className="text-foreground" />
          </button>
          {restaurantHistory.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-1"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          )}
        </div>
        <h1 className="text-2xl text-card-foreground">Restaurant History</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {restaurantHistory.length === 0
            ? 'No restaurants visited yet'
            : `${restaurantHistory.length} restaurant${restaurantHistory.length === 1 ? '' : 's'} visited`}
        </p>
      </div>

      {/* History List */}
      <div className="px-6 pt-6">
        {restaurantHistory.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={40} className="text-muted-foreground opacity-30" />
            </div>
            <p className="text-muted-foreground mb-2">No restaurant history</p>
            <p className="text-sm text-muted-foreground">
              Restaurants you visit will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {restaurantHistory.map((item) => {
              // Try to get restaurant details from mock data
              const restaurant = realRestaurants.find(r => r.id === item.restaurantId);
              
              return (
                <button
                  key={item.restaurantId}
                  onClick={() => handleRestaurantClick(item.restaurantId)}
                  className="w-full bg-card rounded-xl p-4 border border-border hover:border-[#2D7A46] dark:hover:border-green-700 transition-colors text-left"
                >
                  <div className="flex items-start gap-4">
                    {/* Restaurant Image */}
                    {restaurant?.image && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={restaurant.image}
                          alt={item.restaurantName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {!restaurant?.image && (
                      <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <Utensils size={32} className="text-muted-foreground opacity-30" />
                      </div>
                    )}
                    
                    {/* Restaurant Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-card-foreground mb-1">
                        {item.restaurantName}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Utensils size={14} />
                        <span>{item.cuisine}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock size={12} />
                          <span>{formatTimeAgo(item.visitedAt)}</span>
                        </div>
                        {item.visitCount > 1 && (
                          <div className="bg-[#2D7A46] dark:bg-green-700 text-white text-xs px-2 py-1 rounded-full">
                            {item.visitCount} visit{item.visitCount === 1 ? '' : 's'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
