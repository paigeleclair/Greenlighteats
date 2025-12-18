import { useState } from 'react';
import { Users, UserPlus, Trash2, Check, ChevronRight, Utensils, AlertCircle, Filter, ArrowRight } from 'lucide-react';
import { BottomNav } from '../BottomNav';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { realRestaurants, restaurantMenus } from '../../data/restaurantData';
import { UserPreferences, Restaurant, MenuItem, SavedGroup, SavedCompanion } from '../../types';
import { calculateSafetyLevel } from '../../utils/safetyCalculator';

interface GroupDiningTabScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  userPreferences: UserPreferences;
  hasPremium: boolean;
  onUpgradeToPremium: () => void;
  savedGroups?: SavedGroup[];
  savedCompanions: SavedCompanion[];
  onDeleteCompanion: (id: string) => void;
  restaurantContext?: {
    restaurantId: string;
    restaurantName: string;
  };
}

interface GroupMember {
  id: string;
  name: string;
  restrictions: string[];
}

export function GroupDiningTabScreen({ 
  onNavigate, 
  userPreferences,
  hasPremium,
  onUpgradeToPremium,
  savedGroups,
  savedCompanions,
  onDeleteCompanion,
  restaurantContext
}: GroupDiningTabScreenProps) {
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [isFilteringByRestaurant, setIsFilteringByRestaurant] = useState(!!restaurantContext);

  // Get the specific restaurant if context is provided
  const contextRestaurant = restaurantContext 
    ? realRestaurants.find(r => r.id === restaurantContext.restaurantId)
    : null;

  const toggleMember = (companion: SavedCompanion) => {
    const exists = groupMembers.some(m => m.id === companion.id);
    if (exists) {
      setGroupMembers(groupMembers.filter(m => m.id !== companion.id));
    } else {
      setGroupMembers([...groupMembers, {
        id: companion.id,
        name: companion.name,
        restrictions: companion.restrictions
      }]);
    }
  };

  const removeMember = (memberId: string) => {
    setGroupMembers(groupMembers.filter(m => m.id !== memberId));
  };

  // Get all unique restrictions from all group members
  const getAllGroupRestrictions = () => {
    const allRestrictions = new Set<string>();
    
    // Add user's own restrictions if they exist
    if (userPreferences?.allergens) {
      userPreferences.allergens.forEach(a => allRestrictions.add(a));
    }
    if (userPreferences?.dietary) {
      userPreferences.dietary.forEach(d => allRestrictions.add(d));
    }
    if (userPreferences?.religious) {
      userPreferences.religious.forEach(r => allRestrictions.add(r));
    }
    if (userPreferences?.customAllergens) {
      userPreferences.customAllergens.forEach(a => allRestrictions.add(a));
    }
    if (userPreferences?.customDietary) {
      userPreferences.customDietary.forEach(d => allRestrictions.add(d));
    }
    if (userPreferences?.customReligious) {
      userPreferences.customReligious.forEach(r => allRestrictions.add(r));
    }
    
    // Add group members' restrictions
    groupMembers.forEach(member => {
      member.restrictions.forEach(r => allRestrictions.add(r));
    });
    
    return Array.from(allRestrictions);
  };

  // Find restaurants safe for everyone in the group
  const getSafeRestaurants = () => {
    if (groupMembers.length === 0) {
      return [];
    }

    const allRestrictions = getAllGroupRestrictions();
    
    return realRestaurants
      .map(restaurant => {
        const safeMenuItems = restaurantMenus[restaurant.id].filter(item => {
          // Check if item is safe for all restrictions
          const itemRestrictions = new Set(item.tags.map(t => t.toLowerCase()));
          
          return !allRestrictions.some(restriction => 
            itemRestrictions.has(restriction.toLowerCase())
          );
        });

        return {
          ...restaurant,
          safeMenuItemsCount: safeMenuItems.length,
          safeMenuItems: safeMenuItems
        };
      })
      .filter(r => r.safeMenuItemsCount > 0)
      .sort((a, b) => b.safeMenuItemsCount - a.safeMenuItemsCount);
  };

  // Get safe menu items across all restaurants
  const getSafeMenuItems = () => {
    if (groupMembers.length === 0) {
      return [];
    }

    const allRestrictions = getAllGroupRestrictions();
    const allItems: Array<{ restaurant: Restaurant; menuItem: MenuItem; isSafe: boolean }> = [];

    // Filter by restaurant context if enabled
    const restaurantsToSearch = isFilteringByRestaurant && contextRestaurant 
      ? [contextRestaurant]
      : realRestaurants;

    restaurantsToSearch.forEach(restaurant => {
      restaurantMenus[restaurant.id].forEach(item => {
        const itemRestrictions = new Set(item.tags.map(t => t.toLowerCase()));
        const isSafe = !allRestrictions.some(restriction => 
          itemRestrictions.has(restriction.toLowerCase())
        );
        
        allItems.push({ restaurant, menuItem: item, isSafe });
      });
    });

    // Sort: safe items first, then unsafe items
    return allItems.sort((a, b) => {
      if (a.isSafe && !b.isSafe) return -1;
      if (!a.isSafe && b.isSafe) return 1;
      return 0;
    });
  };

  const safeRestaurants = getSafeRestaurants();
  const safeMenuItems = getSafeMenuItems();
  const allGroupRestrictions = getAllGroupRestrictions();

  // Premium check for adding members
  if (!hasPremium && showAddMembers) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="px-6 py-6">
          <div className="text-center py-12">
            <Users size={64} className="mx-auto text-[#2D7A46] mb-4" />
            <h2 className="text-xl mb-2">Premium Feature</h2>
            <p className="text-muted-foreground mb-6">
              Group dining compatibility is a premium feature. Upgrade to find restaurants that work for everyone!
            </p>
            <Button 
              onClick={() => onUpgradeToPremium()}
              className="bg-[#2D7A46] hover:bg-[#236034]"
            >
              Upgrade to Premium
            </Button>
            <Button 
              variant="ghost"
              onClick={() => setShowAddMembers(false)}
              className="mt-2 w-full"
            >
              Go Back
            </Button>
          </div>
        </div>
        <BottomNav active="group" onNavigate={(screen) => onNavigate(screen)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#2D7A46] to-[#236035] px-6 pt-6 pb-8 text-white">
        <h1 className="text-2xl mb-2">Group Dining</h1>
        <p className="text-sm text-white/80">
          {groupMembers.length === 0 
            ? "Add members to find restaurants safe for everyone"
            : `Finding options for ${groupMembers.length + 1} ${groupMembers.length === 0 ? 'person' : 'people'}`
          }
        </p>
      </div>

      {showAddMembers ? (
        // Add Members View
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg">Add Group Members</h2>
            <Button 
              variant="ghost" 
              onClick={() => setShowAddMembers(false)}
            >
              Done
            </Button>
          </div>

          <div className="space-y-3">
            {savedCompanions.length === 0 ? (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  No companions added yet
                </p>
                <Button
                  onClick={() => onNavigate('add-companion')}
                  className="bg-[#2D7A46] hover:bg-[#236034]"
                >
                  <UserPlus size={16} className="mr-2" />
                  Create Companion
                </Button>
              </div>
            ) : (
              <>
                {savedCompanions.map(companion => {
                  const isSelected = groupMembers.some(m => m.id === companion.id);
                  return (
                    <div
                      key={companion.id}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'bg-green-50 dark:bg-green-900/20 border-[#2D7A46] dark:border-green-600'
                          : 'bg-card border-border hover:border-[#2D7A46] dark:hover:border-green-600'
                      }`}
                    >
                      <button
                        onClick={() => toggleMember(companion)}
                        className="flex-1 flex items-center gap-4 text-left"
                      >
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-[#2D7A46] flex items-center justify-center text-white">
                            <Users size={24} />
                          </div>
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#2D7A46] dark:bg-green-700 rounded-full flex items-center justify-center">
                              <Check size={14} className="text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="mb-1">{companion.name}</h3>
                          <div className="flex flex-wrap gap-1">
                            {companion.restrictions.map(restriction => (
                              <span
                                key={restriction}
                                className="px-2 py-0.5 bg-secondary rounded-full text-xs text-muted-foreground"
                              >
                                {restriction}
                              </span>
                            ))}
                          </div>
                        </div>
                      </button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Remove ${companion.name} from companions?`)) {
                            onDeleteCompanion(companion.id);
                          }
                        }}
                      >
                        <Trash2 size={16} className="text-destructive" />
                      </Button>
                    </div>
                  );
                })}
                <Button
                  onClick={() => onNavigate('add-companion')}
                  variant="outline"
                  className="w-full border-2 border-dashed border-[#2D7A46] text-[#2D7A46] hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  <UserPlus size={16} className="mr-2" />
                  Create New Companion
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        // Main Group View
        <div className="px-6 py-6">
          {/* Current Group Members */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Group Members</CardTitle>
                  <CardDescription className="text-sm">
                    {groupMembers.length === 0 ? "No members added" : `${groupMembers.length + 1} total (including you)`}
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => {
                    if (!hasPremium) {
                      setShowAddMembers(true); // This will trigger the premium check
                    } else {
                      setShowAddMembers(true);
                    }
                  }}
                  size="sm"
                  className="bg-[#2D7A46] hover:bg-[#236034]"
                >
                  <UserPlus size={16} className="mr-2" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Current User */}
              <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg mb-2">
                <div className="w-10 h-10 rounded-full bg-[#2D7A46] flex items-center justify-center text-white">
                  <Users size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm">You</p>
                  <p className="text-xs text-muted-foreground">
                    {[
                      ...(userPreferences?.allergens || []), 
                      ...(userPreferences?.dietary || []), 
                      ...(userPreferences?.religious || []),
                      ...(userPreferences?.customAllergens || []),
                      ...(userPreferences?.customDietary || []),
                      ...(userPreferences?.customReligious || [])
                    ].length} restrictions
                  </p>
                </div>
              </div>

              {/* Group Members */}
              {groupMembers.length > 0 ? (
                <div className="space-y-2">
                  {groupMembers.map(member => (
                    <div 
                      key={member.id}
                      className="flex items-center gap-3 p-3 bg-secondary rounded-lg"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#2D7A46] flex items-center justify-center text-white">
                        <Users size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.restrictions.length} restrictions
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeMember(member.id)}
                      >
                        <Trash2 size={16} className="text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground">
                    Add friends to find restaurants safe for everyone
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Group Restrictions Overview */}
          {groupMembers.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Filter size={18} />
                  Combined Restrictions
                </CardTitle>
                <CardDescription className="text-sm">
                  All dietary needs across the group
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {allGroupRestrictions.length > 0 ? (
                    allGroupRestrictions.map(restriction => (
                      <Badge key={restriction} variant="secondary">
                        {restriction}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No restrictions</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Restaurant Context Alert */}
          {groupMembers.length > 0 && isFilteringByRestaurant && contextRestaurant && (
            <Alert className="mb-6 border-[#2D7A46] bg-green-50 dark:bg-green-900/20">
              <Utensils className="h-4 w-4 text-[#2D7A46]" />
              <AlertDescription className="flex items-center justify-between">
                <div>
                  <p className="text-sm mb-1">
                    <span className="font-medium">Showing results for {contextRestaurant.name}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Explore compatible menu items at this restaurant
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Explore Other Restaurants Button */}
          {groupMembers.length > 0 && isFilteringByRestaurant && (
            <Button
              onClick={() => setIsFilteringByRestaurant(false)}
              variant="outline"
              className="w-full mb-6 border-2 border-[#2D7A46] text-[#2D7A46] hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              <ArrowRight size={18} className="mr-2" />
              Explore Other Restaurants
            </Button>
          )}

          {/* Results Tabs */}
          {groupMembers.length > 0 && (
            <Tabs defaultValue={isFilteringByRestaurant ? "menu-items" : "restaurants"} className="w-full">
              {isFilteringByRestaurant ? (
                // Show only menu items when filtering by restaurant
                <>
                  <div className="mb-4">
                    <h2 className="text-lg mb-2">Menu Items</h2>
                    <p className="text-sm text-muted-foreground">
                      Safe options listed first
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    {safeMenuItems.length > 0 ? (
                      safeMenuItems.slice(0, 20).map((item, index) => (
                        <Card 
                          key={`${item.restaurant.id}-${item.menuItem.id}-${index}`}
                          className={`cursor-pointer hover:shadow-md transition-shadow ${
                            !item.isSafe ? 'opacity-60' : ''
                          }`}
                          onClick={() => onNavigate('menu-item-detail', {
                            item: item.menuItem,
                            restaurantId: item.restaurant.id,
                            restaurantName: item.restaurant.name
                          })}
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <ImageWithFallback
                                src={item.menuItem.image}
                                alt={item.menuItem.name}
                                className="w-20 h-20 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-1">
                                  <div>
                                    <h3 className="text-sm mb-0.5">{item.menuItem.name}</h3>
                                    <p className="text-xs text-muted-foreground">
                                      {item.restaurant.name}
                                    </p>
                                  </div>
                                  <ChevronRight size={18} className="text-muted-foreground" />
                                </div>
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                  {item.menuItem.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">${item.menuItem.price.toFixed(2)}</span>
                                  {item.isSafe ? (
                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                      <Check size={12} className="mr-1" />
                                      Safe for all
                                    </Badge>
                                  ) : (
                                    <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                      <AlertCircle size={12} className="mr-1" />
                                      Not safe
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          No menu items found at this restaurant.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </>
              ) : (
                // Show both tabs when not filtering by restaurant
                <>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="restaurants">
                      Restaurants
                      {safeRestaurants.length > 0 && (
                        <Badge className="ml-2 bg-[#2D7A46] text-white">
                          {safeRestaurants.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="menu-items">
                      Menu Items
                      {safeMenuItems.length > 0 && (
                        <Badge className="ml-2 bg-[#2D7A46] text-white">
                          {safeMenuItems.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>

                  {/* Safe Restaurants Tab */}
                  <TabsContent value="restaurants" className="space-y-3">
                    {safeRestaurants.length > 0 ? (
                      safeRestaurants.map(restaurant => (
                        <Card 
                          key={restaurant.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => onNavigate('restaurant-detail', { restaurant })}
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <ImageWithFallback
                                src={restaurant.image}
                                alt={restaurant.name}
                                className="w-20 h-20 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="mb-1">{restaurant.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      {restaurant.cuisine}
                                    </p>
                                  </div>
                                  <ChevronRight size={20} className="text-muted-foreground" />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                    {restaurant.safeMenuItemsCount} safe items
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {restaurant.distance}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          No restaurants found that accommodate all dietary restrictions. Try removing some group members or adjusting restrictions.
                        </AlertDescription>
                      </Alert>
                    )}
                  </TabsContent>

                  {/* Safe Menu Items Tab */}
                  <TabsContent value="menu-items" className="space-y-3">
                    {safeMenuItems.length > 0 ? (
                      safeMenuItems.slice(0, 20).map((item, index) => (
                        <Card 
                          key={`${item.restaurant.id}-${item.menuItem.id}-${index}`}
                          className={`cursor-pointer hover:shadow-md transition-shadow ${
                            !item.isSafe ? 'opacity-60' : ''
                          }`}
                          onClick={() => onNavigate('menu-item-detail', {
                            item: item.menuItem,
                            restaurantId: item.restaurant.id,
                            restaurantName: item.restaurant.name
                          })}
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <ImageWithFallback
                                src={item.menuItem.image}
                                alt={item.menuItem.name}
                                className="w-20 h-20 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-1">
                                  <div>
                                    <h3 className="text-sm mb-0.5">{item.menuItem.name}</h3>
                                    <p className="text-xs text-muted-foreground">
                                      {item.restaurant.name}
                                    </p>
                                  </div>
                                  <ChevronRight size={18} className="text-muted-foreground" />
                                </div>
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                  {item.menuItem.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">${item.menuItem.price.toFixed(2)}</span>
                                  {item.isSafe ? (
                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                      <Check size={12} className="mr-1" />
                                      Safe for all
                                    </Badge>
                                  ) : (
                                    <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                      <AlertCircle size={12} className="mr-1" />
                                      Not safe
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          No menu items found that accommodate all dietary restrictions in the group.
                        </AlertDescription>
                      </Alert>
                    )}
                  </TabsContent>
                </>
              )}
            </Tabs>
          )}

          {/* Empty State */}
          {groupMembers.length === 0 && (
            <div className="text-center py-12">
              <Users size={64} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg mb-2">Start a Group</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                Add friends to your group to discover restaurants and menu items that are safe for everyone's dietary needs.
              </p>
              <Button 
                onClick={() => {
                  if (!hasPremium) {
                    setShowAddMembers(true); // This will trigger the premium check
                  } else {
                    setShowAddMembers(true);
                  }
                }}
                className="bg-[#2D7A46] hover:bg-[#236034]"
              >
                <UserPlus size={16} className="mr-2" />
                Add Group Members
              </Button>
            </div>
          )}
        </div>
      )}

      <BottomNav active="group" onNavigate={(screen) => onNavigate(screen)} />
    </div>
  );
}