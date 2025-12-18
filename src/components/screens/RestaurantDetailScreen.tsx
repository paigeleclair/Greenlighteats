import { useState } from 'react';
import { ChevronLeft, MapPin, Star, Share2, UserPlus, Info, Heart, MessageSquare, Calendar } from 'lucide-react';
import { SafetyBadge } from '../SafetyBadge';
import { DietaryIcon } from '../DietaryIcon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Restaurant, UserPreferences, SavedMenuItem, SavedRestaurant } from '../../types';
import { restaurantMenus } from '../../data/restaurantData';
import { calculateSafetyLevel, calculateSafePercentage, getSafetyDetails } from '../../utils/safetyCalculator';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { PremiumDialog } from '../PremiumDialog';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { toast } from 'sonner@2.0.3';
import { ShareDialog } from '../ShareDialog';

interface RestaurantDetailScreenProps {
  restaurant: Restaurant;
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
  userPreferences?: UserPreferences;
  savedMenuItems?: SavedMenuItem[];
  savedRestaurants?: SavedRestaurant[];
  onToggleSaveItem?: (item: any, restaurantId: string, restaurantName: string) => void;
  onToggleSaveRestaurant?: (restaurant: Restaurant) => void;
  hasPremium?: boolean;
  onUpgradeToPremium?: () => void;
  onShareWithGroup?: (restaurantId: string, restaurantName: string, memberIds: string[]) => void;
  activeGroupMembers?: Array<{id: string, name: string, restrictions: string[]}>;
}

export function RestaurantDetailScreen({ 
  restaurant, 
  onNavigate, 
  onBack, 
  userPreferences,
  savedMenuItems = [],
  savedRestaurants = [],
  onToggleSaveItem,
  onToggleSaveRestaurant,
  hasPremium = false,
  onUpgradeToPremium,
  onShareWithGroup,
  activeGroupMembers = []
}: RestaurantDetailScreenProps) {
  const [activeTab, setActiveTab] = useState('menu');
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showShareDialog, setShowShareDialog] = useState(false);

  // Get menu items for this restaurant
  const menuItems = restaurantMenus[restaurant.id] || [];

  // Get all restrictions from user and active group members
  const getAllRestrictions = () => {
    const allRestrictions = new Set<string>();
    
    // Add user's own restrictions
    if (userPreferences?.allergens) {
      userPreferences.allergens.forEach(a => allRestrictions.add(a.toLowerCase()));
    }
    if (userPreferences?.dietary) {
      userPreferences.dietary.forEach(d => allRestrictions.add(d.toLowerCase()));
    }
    if (userPreferences?.religious) {
      userPreferences.religious.forEach(r => allRestrictions.add(r.toLowerCase()));
    }
    if (userPreferences?.customAllergens) {
      userPreferences.customAllergens.forEach(a => allRestrictions.add(a.toLowerCase()));
    }
    if (userPreferences?.customDietary) {
      userPreferences.customDietary.forEach(d => allRestrictions.add(d.toLowerCase()));
    }
    if (userPreferences?.customReligious) {
      userPreferences.customReligious.forEach(r => allRestrictions.add(r.toLowerCase()));
    }
    
    // Add group members' restrictions
    activeGroupMembers.forEach(member => {
      member.restrictions.forEach(r => allRestrictions.add(r.toLowerCase()));
    });
    
    return Array.from(allRestrictions);
  };

  const allRestrictions = getAllRestrictions();

  // Calculate safety levels based on user preferences AND group members
  const menuItemsWithSafety = userPreferences || activeGroupMembers.length > 0
    ? menuItems.map(item => {
        // Check if item violates any restriction
        const itemTags = item.tags.map(t => t.toLowerCase());
        const hasViolation = allRestrictions.some(restriction => {
          return itemTags.some(tag => 
            tag.includes(restriction) || 
            restriction.includes(tag)
          );
        });

        // For more detailed safety checking
        const safetyLevel = userPreferences 
          ? calculateSafetyLevel(item, userPreferences)
          : (hasViolation ? 'unsafe' as const : 'safe' as const);

        return {
          ...item,
          safetyLevel
        };
      })
    : menuItems;

  // Sort menu items: safe first, then caution, then unsafe
  const sortedMenuItems = [...menuItemsWithSafety].sort((a, b) => {
    const safetyOrder = { safe: 0, caution: 1, unsafe: 2 };
    return safetyOrder[a.safetyLevel] - safetyOrder[b.safetyLevel];
  });

  // Calculate safe percentage
  const safePercentage = userPreferences && menuItems.length > 0
    ? calculateSafePercentage(menuItems, userPreferences)
    : 0;

  // Check if restaurant is saved
  const isRestaurantSaved = savedRestaurants.some(saved => saved.restaurantId === restaurant.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image */}
      <div className="relative">
        <ImageWithFallback
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-64 object-cover"
        />
        <button
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
        >
          <ChevronLeft size={24} className="text-gray-900" />
        </button>
        <div className="absolute top-4 right-4 flex gap-2">
          {onToggleSaveRestaurant && (
            <button
              onClick={() => {
                onToggleSaveRestaurant(restaurant);
                toast.success(isRestaurantSaved ? 'Removed from favorites' : 'Added to favorites');
              }}
              className={`w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md transition-colors ${
                isRestaurantSaved ? 'text-red-600' : 'text-gray-900'
              }`}
            >
              <Heart size={20} fill={isRestaurantSaved ? 'currentColor' : 'none'} />
            </button>
          )}
          <button
            onClick={() => setShowShareDialog(true)}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
          >
            <Share2 size={20} className="text-gray-900" />
          </button>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl mb-2">{restaurant.name}</h1>
        <p className="text-gray-600 mb-3">{restaurant.cuisine}</p>
        
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1">
            <Star size={18} className="text-yellow-500 fill-yellow-500" />
            <span>{restaurant.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin size={16} />
            <span className="text-sm">{restaurant.distance}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <SafetyBadge level={restaurant.safetyLevel} size="md" percentage={safePercentage > 0 ? safePercentage : undefined} />
          {restaurant.dietaryTags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
              {tag}
            </span>
          ))}
        </div>

        {/* Safety Explanation */}
        <Alert className="mt-4 border-l-4 bg-blue-50 border-blue-400">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm text-gray-700 ml-2">
            {restaurant.safetyLevel === 'safe' && (
              <div>
                <span className="font-medium text-green-700">Safe:</span> At least 50% of menu items meet your dietary needs and sodium limits.
              </div>
            )}
            {restaurant.safetyLevel === 'caution' && (
              <div>
                <span className="font-medium text-yellow-700">Caution:</span> 25-50% of items meet your needs. Sodium levels may exceed your limit (between 1x-1.5x your max).
              </div>
            )}
            {restaurant.safetyLevel === 'unsafe' && (
              <div>
                <span className="font-medium text-red-700">Avoid:</span> Less than 25% of items are safe. Many items have sodium levels above 1.5x your maximum limit.
              </div>
            )}
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div className="mt-4 space-y-3">
          <Button
            onClick={() => {
              if (hasPremium) {
                onNavigate('group', { restaurantContext: { restaurantId: restaurant.id, restaurantName: restaurant.name } });
              } else {
                setShowPremiumDialog(true);
              }
            }}
            variant="outline"
            className="w-full border-2 border-dashed border-[#2D7A46] text-[#2D7A46] hover:bg-green-50 rounded-xl h-12 gap-2"
          >
            <UserPlus size={20} />
            Add Dining Companions
            {!hasPremium && (
              <span className="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full ml-1">
                Premium
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Premium Dialog */}
      <PremiumDialog 
        open={showPremiumDialog} 
        onOpenChange={setShowPremiumDialog} 
        onUpgrade={onUpgradeToPremium}
      />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white">
        <TabsList className="w-full justify-start border-b border-gray-200 rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger 
            value="menu" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2D7A46] data-[state=active]:bg-transparent data-[state=active]:text-[#2D7A46] px-6 py-3"
          >
            Menu
          </TabsTrigger>
          <TabsTrigger 
            value="reviews" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2D7A46] data-[state=active]:bg-transparent data-[state=active]:text-[#2D7A46] px-6 py-3"
          >
            Reviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="menu" className="px-6 py-4 mt-0 space-y-3">
          {sortedMenuItems.length > 0 ? sortedMenuItems.map(item => {
            const isSaved = savedMenuItems.some(
              saved => saved.menuItemId === item.id && saved.restaurantId === restaurant.id
            );
            
            // Get safety details with reasons
            const safetyDetails = userPreferences 
              ? getSafetyDetails(item, userPreferences)
              : { safetyLevel: item.safetyLevel, reasons: [] };
            
            // Filter out the "safe" reasons and only show violations
            const violations = safetyDetails.reasons.filter(reason => 
              reason.startsWith('❌') || reason.startsWith('⚠️')
            );
            
            return (
              <div key={item.id} className="relative">
                <div
                  onClick={() => onNavigate('menu-item-detail', { 
                    item, 
                    restaurantId: restaurant.id,
                    restaurantName: restaurant.name 
                  })}
                  className={`w-full rounded-2xl p-4 border-2 text-left transition-all cursor-pointer hover:shadow-md ${
                    item.safetyLevel === 'safe'
                      ? 'bg-green-50 border-[#2D7A46]'
                      : item.safetyLevel === 'caution'
                      ? 'bg-yellow-50 border-[#C79A00]'
                      : 'bg-red-50 border-[#B55454]'
                  }`}
                >
                  <div className="flex gap-4">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="flex-1">{item.name}</h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-gray-900">${item.price}</span>
                          {onToggleSaveItem && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleSaveItem(item, restaurant.id, restaurant.name);
                                toast.success(isSaved ? 'Removed from favorites' : 'Added to favorites');
                              }}
                              className={`p-1 rounded-full transition-colors ${
                                isSaved ? 'text-red-600' : 'text-gray-400 hover:text-red-600'
                              }`}
                            >
                              <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                      
                      {/* Safety violations - show specific reasons */}
                      {violations.length > 0 && (
                        <div className="mb-2 space-y-1">
                          {violations.map((violation, idx) => (
                            <p key={idx} className="text-xs text-gray-700">
                              {violation.replace('❌ ', '').replace('⚠️ ', '')}
                            </p>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <SafetyBadge level={item.safetyLevel} />
                        <span className="text-xs text-gray-600">{item.nutrition.calories} cal</span>
                        <span className="text-xs text-gray-600">{item.nutrition.sodium}mg sodium</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }) : (
            <p className="text-center text-gray-600 py-8">No menu items available</p>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="px-6 py-4 mt-0">
          <div className="space-y-4">
            {/* Feedback Button */}
            <Button
              onClick={() => setShowFeedbackDialog(true)}
              variant="outline"
              className="w-full"
            >
              <MessageSquare size={18} className="mr-2" />
              Report Incorrect Info
            </Button>
            
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full" />
                <div>
                  <p className="text-sm">Sarah M.</p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} size={12} className="text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700">Great options for my dietary needs! Staff was very helpful.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Feedback Dialog */}
      {showFeedbackDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg mb-2">Report Incorrect Information</h3>
            <p className="text-sm text-gray-600 mb-4">
              Help us keep our menu information accurate by reporting any errors you find.
            </p>
            <textarea
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              placeholder="What information is incorrect?"
              className="w-full h-32 p-3 border border-gray-300 rounded-xl resize-none mb-4"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowFeedbackDialog(false);
                  setFeedbackMessage('');
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#2D7A46] hover:bg-[#236034]"
                onClick={() => {
                  toast.success('Thank you! Your feedback has been submitted.');
                  setShowFeedbackDialog(false);
                  setFeedbackMessage('');
                }}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Share Dialog */}
      <ShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        restaurant={restaurant}
        hasPremium={hasPremium}
        onUpgradeToPremium={onUpgradeToPremium}
        onShare={(selectedMemberIds) => {
          if (onShareWithGroup) {
            onShareWithGroup(restaurant.id, restaurant.name, selectedMemberIds);
          }
          toast.success(`Shared ${restaurant.name} with ${selectedMemberIds.length} ${selectedMemberIds.length === 1 ? 'person' : 'people'}!`);
        }}
      />
    </div>
  );
}