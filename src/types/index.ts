export type Allergen = 'gluten' | 'peanuts' | 'dairy' | 'shellfish' | 'soy' | 'eggs' | 'tree-nuts' | 'wheat' | 'fish';
export type DietaryRestriction = 'low-sodium' | 'diabetic' | 'vegetarian' | 'vegan' | 'keto' | 'low-carb';
export type ReligiousRestriction = 'halal' | 'kosher' | 'none';

export type SafetyLevel = 'safe' | 'caution' | 'unsafe';

export interface UserPreferences {
  allergens: Allergen[];
  dietary: DietaryRestriction[];
  religious: ReligiousRestriction[];
  customAllergens: string[]; // User-defined allergens
  customDietary: string[]; // User-defined dietary restrictions
  customReligious: string[]; // User-defined religious restrictions
  maxSodium?: number; // in mg, undefined means use default
  maxSugar?: number; // in g, undefined means use default
}

// Default max sodium for low-sodium diet (mg per meal)
export const DEFAULT_MAX_SODIUM = 600;

// Default max sugar for diabetic-friendly diet (g per meal)
export const DEFAULT_MAX_SUGAR = 25;

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  distance: string;
  rating: number;
  safetyLevel: SafetyLevel;
  dietaryTags: string[];
  image: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  safetyLevel: SafetyLevel;
  tags: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    sodium: number;
    sugar: number; // in grams
  };
  image: string;
  // Detailed restriction information
  allergens?: Allergen[]; // Allergens present in this item
  notHalal?: boolean; // Contains pork or alcohol
  notKosher?: boolean; // Not kosher certified or contains non-kosher ingredients
  notVegetarian?: boolean; // Contains meat
  notVegan?: boolean; // Contains animal products
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  restrictions: string[];
}

export interface SavedMenuItem {
  menuItemId: string;
  restaurantId: string;
  restaurantName: string;
  savedAt: number;
}

export interface SavedRestaurant {
  restaurantId: string;
  restaurantName: string;
  cuisine: string;
  savedAt: number;
}

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

export interface RestaurantHistoryItem {
  restaurantId: string;
  restaurantName: string;
  cuisine: string;
  visitedAt: number;
  visitCount: number;
}

export interface Notification {
  id: string;
  type: 'new-restaurant' | 'menu-update' | 'safety-alert' | 'group-invite';
  title: string;
  message: string;
  restaurantId?: string;
  timestamp: number;
  read: boolean;
  inviteData?: {
    fromUser: string;
    friendIds: string[];
    inviteId: string;
  };
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  birthday?: string; // ISO date string (YYYY-MM-DD)
  photoUrl?: string;
  lastBirthdayNotification?: number; // timestamp of last birthday notification
}

export type PaymentMethodType = 'credit-card' | 'debit-card' | 'gift-card';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  cardholderName: string;
  last4Digits: string;
  expiryMonth?: string;
  expiryYear?: string;
  cardBrand?: 'visa' | 'mastercard' | 'amex' | 'discover'; // For credit/debit cards
  balance?: number; // For gift cards
  isDefault: boolean;
  addedAt: number;
}

export interface Reservation {
  id: string;
  restaurantId: string;
  restaurantName: string;
  date: string; // ISO date string
  time: string; // HH:mm format
  partySize: number;
  specialRequests?: string;
  paymentMethodId: string;
  depositAmount: number; // Amount charged for reservation
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: number;
}

export type LocationPermission = 'while-using' | 'always' | 'never';

export type RewardTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'freebie' | 'special';
  restaurantId?: string;
  restaurantName?: string;
  expiresAt?: number;
  isRedeemed: boolean;
  redeemedAt?: number;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  restaurantId: string;
  restaurantName: string;
  discountPercentage?: number;
  expiresAt: number;
  termsAndConditions: string;
}

export interface PointsTransaction {
  id: string;
  type: 'earned' | 'redeemed';
  points: number;
  reason: string;
  restaurantId?: string;
  restaurantName?: string;
  timestamp: number;
}

export interface RewardsData {
  totalPoints: number;
  tier: RewardTier;
  pointsToNextTier: number;
  rewards: Reward[];
  deals: Deal[];
  transactions: PointsTransaction[];
}

export interface SavedGroup {
  id: string;
  name: string;
  memberIds: string[];
  memberNames: string[];
  restaurantId?: string;
  restaurantName?: string;
  createdAt: number;
}

export interface SavedCompanion {
  id: string;
  name: string;
  restrictions: string[]; // All restrictions (allergens, dietary, religious, custom)
  createdAt: number;
}

export interface AppState {
  userPreferences: UserPreferences;
  userProfile?: UserProfile;
  savedMenuItems: SavedMenuItem[];
  savedRestaurants: SavedRestaurant[];
  searchHistory: SearchHistoryItem[];
  restaurantHistory: RestaurantHistoryItem[];
  notifications: Notification[];
  paymentMethods: PaymentMethod[];
  reservations: Reservation[];
  rewardsData: RewardsData;
  darkMode: boolean;
  hasPremium: boolean;
  locationPermission: LocationPermission;
  savedGroups: SavedGroup[];
  savedCompanions: SavedCompanion[];
  lastLocation?: {
    latitude: number;
    longitude: number;
  };
}