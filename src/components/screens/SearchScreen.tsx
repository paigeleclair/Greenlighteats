import { useState, useEffect } from 'react';
import { Search, MapPin, List, Map, X, Clock, Filter, Crown } from 'lucide-react';
import { BottomNav } from '../BottomNav';
import { SafetyBadge } from '../SafetyBadge';
import { DietaryIcon } from '../DietaryIcon';
import { Input } from '../ui/input';
import { realRestaurants } from '../../data/restaurantData';
import { restaurantMenus } from '../../data/restaurantData';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { UserPreferences, SearchHistoryItem, SafetyLevel, Restaurant } from '../../types';
import { calculateSafePercentage, scoreRestaurant } from '../../utils/safetyCalculator';
import { RestaurantCardSkeletonList } from '../RestaurantCardSkeleton';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { PremiumDialog } from '../PremiumDialog';
import { searchRestaurantsByLocation } from '../../utils/documenuApi';
import { calculateDistance } from '../../utils/distance';

interface SearchScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  userPreferences?: UserPreferences;
  searchHistory: SearchHistoryItem[];
  onAddSearchHistory: (query: string) => void;
  onClearSearchHistory: () => void;
}

export function SearchScreen({ 
  onNavigate, 
  userPreferences,
  searchHistory,
  onAddSearchHistory,
  onClearSearchHistory 
}: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [safetyFilter, setSafetyFilter] = useState<SafetyLevel | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(true);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [hasPremium] = useState(false); // Set to true to simulate premium user
  const [realDataRestaurants, setRealDataRestaurants] = useState<Restaurant[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'loading' | 'granted' | 'denied'>('loading');
  const [locationError, setLocationError] = useState<string | null>(null);

  // Fetch real restaurants from Documenu on component mount
  useEffect(() => {
    fetchRealRestaurants();
  }, []);

  // Retry location when user changes permission
  const retryLocation = () => {
    setLocationStatus('loading');
    setLocationError(null);
    fetchRealRestaurants();
  };

  const fetchRealRestaurants = async () => {
    setIsLoading(true);
    
    // Check for HTTPS (required for geolocation on most browsers)
    if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
      setLocationError('Geolocation requires HTTPS');
      setLocationStatus('denied');
      setIsLoading(false);
      return;
    }
    
    // Try to get user's location first
    if (navigator.geolocation) {
      // Silently attempt geolocation - we'll handle errors gracefully
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lon: longitude });
            setLocationStatus('granted');
            
            // Fetch restaurants from Documenu API
            try {
              const results = await searchRestaurantsByLocation(latitude, longitude, 10, { size: 100 });
              
              if (results.restaurants.length > 0) {
                // Calculate distance for each restaurant and update the distance field
                const restaurantsWithDistance = results.restaurants.map(restaurant => {
                  if (restaurant.geo) {
                    const distanceNum = calculateDistance(latitude, longitude, restaurant.geo.lat, restaurant.geo.lng);
                    return {
                      ...restaurant,
                      distance: `${distanceNum} mi`,
                    };
                  }
                  return restaurant;
                });

                // Sort by distance (closest first)
                restaurantsWithDistance.sort((a, b) => {
                  const distA = parseFloat(a.distance);
                  const distB = parseFloat(b.distance);
                  return distA - distB;
                });
                
                setRealDataRestaurants(restaurantsWithDistance);
                console.log(`✅ Found ${restaurantsWithDistance.length} restaurants near you`);
              } else {
                setRealDataRestaurants([]);
              }
            } catch (apiError) {
              console.log('ℹ️ Could not fetch restaurants, using mock data');
              setRealDataRestaurants([]);
            }
          } catch (error) {
            setRealDataRestaurants([]);
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          // Location denied or error
          let errorMsg = 'Location access denied';
          
          // Check for specific permissions policy error (expected in Figma Make)
          if (error.message && error.message.includes('permissions policy')) {
            errorMsg = 'Location blocked by browser policy';
            console.log('ℹ️ Geolocation unavailable (Figma Make hosting limitation). Using mock data.');
            // Set to 'denied' but don't retry as this is a hosting issue
            setLocationError(errorMsg);
            setLocationStatus('denied');
            setIsLoading(false);
            setRealDataRestaurants([]);
            return;
          }
          
          // For other location errors, log more details
          console.log(`📍 Location error: ${error.message} (code: ${error.code})`);
          
          switch (error.code) {
            case 1: // PERMISSION_DENIED
              errorMsg = 'Location permission denied';
              break;
            case 2: // POSITION_UNAVAILABLE
              errorMsg = 'Location unavailable';
              break;
            case 3: // TIMEOUT
              errorMsg = 'Location request timed out';
              break;
            default:
              errorMsg = `Location error (code: ${error.code})`;
          }
          
          setLocationError(errorMsg);
          setLocationStatus('denied');
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true, // Try to get accurate position
          timeout: 10000, // 10 seconds timeout
          maximumAge: 60000 // Cache position for 1 minute
        }
      );
    } else {
      console.log('ℹ️ Geolocation not supported, using mock data');
      setLocationError('Geolocation not supported by browser');
      setLocationStatus('denied');
      setIsLoading(false);
    }
  };

  // Merge real restaurants from Documenu with mock restaurants
  const mergedRestaurants = [...realRestaurants, ...realDataRestaurants];

  // Remove duplicates based on restaurant name similarity (in case same restaurant exists in both)
  const uniqueRestaurants = mergedRestaurants.filter((restaurant, index, self) => 
    index === self.findIndex((r) => r.name.toLowerCase() === restaurant.name.toLowerCase())
  );

  // Calculate safety percentages for restaurants with user preferences
  const restaurantsWithPercentages = uniqueRestaurants.map(restaurant => {
    const menuItems = restaurantMenus[restaurant.id] || [];
    const safePercentage = userPreferences && menuItems.length > 0
      ? calculateSafePercentage(menuItems, userPreferences)
      : 0;
    
    const calculatedSafetyLevel = userPreferences && menuItems.length > 0
      ? scoreRestaurant(menuItems, userPreferences)
      : (restaurant.safetyLevel || 'caution');

    return {
      ...restaurant,
      safePercentage,
      safetyLevel: calculatedSafetyLevel
    };
  });

  const filteredRestaurants = restaurantsWithPercentages.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSafety = safetyFilter === 'all' || restaurant.safetyLevel === safetyFilter;
    
    return matchesSearch && matchesSafety;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setShowHistory(false);
      onAddSearchHistory(query);
    } else {
      setShowHistory(true);
    }
  };

  const handleHistoryClick = (query: string) => {
    setSearchQuery(query);
    setShowHistory(false);
  };

  const handleMapToggle = () => {
    setViewMode('map');
  };

  return (
    <div className="min-h-screen bg-secondary pb-20">
      {/* Premium Dialog */}
      <PremiumDialog 
        open={showPremiumDialog} 
        onOpenChange={setShowPremiumDialog}
        onUpgrade={() => {
          setShowPremiumDialog(false);
          onNavigate('premium-upgrade');
        }}
      />

      {/* Header */}
      <div className="bg-card px-6 pt-6 pb-4 border-b border-border">
        <h2 className="text-xl mb-4">Search Restaurants</h2>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            type="text"
            placeholder="Search restaurants or dishes..."
            className="pl-10 pr-10 h-12 rounded-xl"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setShowHistory(true);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Search History */}
        {showHistory && searchHistory.length > 0 && !searchQuery && (
          <div className="mb-4 bg-secondary rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Recent Searches</span>
              </div>
              <button
                onClick={onClearSearchHistory}
                className="text-xs text-[#2D7A46] hover:text-[#236034] dark:text-green-400 dark:hover:text-green-300"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.slice(0, 5).map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleHistoryClick(item.query)}
                  className="px-3 py-1 bg-card rounded-full text-sm text-foreground hover:bg-accent border border-border"
                >
                  {item.query}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Safety Filter */}
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Safety Filter:</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => setSafetyFilter('all')}
            variant={safetyFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            className={safetyFilter === 'all' 
              ? 'bg-[#2D7A46] hover:bg-[#236034]' 
              : ''}
          >
            All
          </Button>
          <Button
            onClick={() => setSafetyFilter('safe')}
            variant={safetyFilter === 'safe' ? 'default' : 'outline'}
            size="sm"
            className={safetyFilter === 'safe' 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30'}
          >
            <div className="w-3 h-3 bg-green-600 rounded mr-1.5"></div>
            Safe
          </Button>
          <Button
            onClick={() => setSafetyFilter('caution')}
            variant={safetyFilter === 'caution' ? 'default' : 'outline'}
            size="sm"
            className={safetyFilter === 'caution' 
              ? 'bg-yellow-600 hover:bg-yellow-700' 
              : 'border-yellow-600 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950/30'}
          >
            <div className="w-3 h-3 bg-yellow-500 rounded mr-1.5"></div>
            Caution
          </Button>
          <Button
            onClick={() => setSafetyFilter('unsafe')}
            variant={safetyFilter === 'unsafe' ? 'default' : 'outline'}
            size="sm"
            className={safetyFilter === 'unsafe' 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30'}
          >
            <div className="w-3 h-3 bg-red-600 rounded mr-1.5"></div>
            Avoid
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="px-6 py-4 space-y-4">
        {isLoading ? (
          <RestaurantCardSkeletonList count={3} />
        ) : filteredRestaurants.length > 0 ? (
          filteredRestaurants.map(restaurant => (
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
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm">{restaurant.rating}</span>
                    </div>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin size={14} />
                      <span className="text-sm">{restaurant.distance}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <SafetyBadge level={restaurant.safetyLevel} />
                    {userPreferences && restaurant.safePercentage > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {restaurant.safePercentage}% safe
                      </Badge>
                    )}
                    {restaurant.dietaryTags.slice(0, 2).map(tag => (
                      <DietaryIcon key={tag} tag={tag} />
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center py-12">
            <Search size={48} className="text-muted-foreground/50 mx-auto mb-3" />
            <h3 className="text-lg mb-2">No restaurants found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      <BottomNav active="search" onNavigate={(screen) => onNavigate(screen)} />
    </div>
  );
}