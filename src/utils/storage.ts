import { AppState, UserPreferences, UserProfile, SavedMenuItem, SavedRestaurant, SearchHistoryItem, Notification, RestaurantHistoryItem, PaymentMethod, Reservation, LocationPermission, RewardsData, RewardTier, PointsTransaction, Reward, Deal, SavedCompanion } from '../types';

const STORAGE_KEY = 'greenlight_eats_data';
const PREMIUM_SESSION_KEY = 'greenlight_eats_premium';

const DEFAULT_REWARDS_DATA: RewardsData = {
  totalPoints: 0,
  tier: 'bronze',
  pointsToNextTier: 100,
  rewards: [
    {
      id: 'reward_1',
      title: '$5 Off Your Next Meal',
      description: 'Redeem this reward for $5 off any meal at participating restaurants',
      pointsCost: 50,
      type: 'discount',
      isRedeemed: false
    },
    {
      id: 'reward_2',
      title: 'Free Appetizer',
      description: 'Get a free appetizer at Olive Garden',
      pointsCost: 75,
      type: 'freebie',
      restaurantId: 'olive-garden-1',
      restaurantName: 'Olive Garden',
      isRedeemed: false
    },
    {
      id: 'reward_3',
      title: '$10 Off Your Order',
      description: 'Save $10 on your next order of $30 or more',
      pointsCost: 100,
      type: 'discount',
      isRedeemed: false
    },
    {
      id: 'reward_4',
      title: 'Free Dessert at Carrabba\'s',
      description: 'Enjoy a complimentary dessert at Carrabba\'s Italian Grill',
      pointsCost: 150,
      type: 'freebie',
      restaurantId: 'carrabbas-1',
      restaurantName: 'Carrabba\'s Italian Grill',
      isRedeemed: false
    },
    {
      id: 'reward_5',
      title: 'Priority Reservations',
      description: 'Get priority booking access at all partner restaurants for 30 days',
      pointsCost: 200,
      type: 'special',
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      isRedeemed: false
    }
  ],
  deals: [
    {
      id: 'deal_1',
      title: 'Happy Hour Special',
      description: '20% off all appetizers from 3-6 PM',
      restaurantId: 'olive-garden-1',
      restaurantName: 'Olive Garden',
      discountPercentage: 20,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      termsAndConditions: 'Valid Monday-Friday, 3-6 PM. Cannot be combined with other offers.'
    },
    {
      id: 'deal_2',
      title: 'Date Night Special',
      description: 'Buy one entree, get one 50% off',
      restaurantId: 'carrabbas-1',
      restaurantName: 'Carrabba\'s Italian Grill',
      discountPercentage: 50,
      expiresAt: Date.now() + 14 * 24 * 60 * 60 * 1000,
      termsAndConditions: 'Valid on weekends only. Dine-in only. Lower-priced entree receives discount.'
    }
  ],
  transactions: []
};

const DEFAULT_STATE: AppState = {
  userPreferences: {
    allergens: [],
    dietary: [],
    religious: [],
    customAllergens: [],
    customDietary: [],
    customReligious: [],
    maxSodium: undefined
  },
  userProfile: undefined,
  savedMenuItems: [],
  savedRestaurants: [],
  searchHistory: [],
  restaurantHistory: [],
  notifications: [],
  paymentMethods: [],
  reservations: [],
  rewardsData: DEFAULT_REWARDS_DATA,
  darkMode: false,
  hasPremium: false,
  locationPermission: 'never',
  savedGroups: [],
  savedCompanions: [],
  lastLocation: undefined
};

export function loadAppState(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const state = { ...DEFAULT_STATE, ...JSON.parse(stored) };
      
      // Migration: Convert old 'name' field to firstName/lastName
      if (state.userProfile && 'name' in state.userProfile && !state.userProfile.firstName) {
        const oldProfile = state.userProfile as any;
        const nameParts = (oldProfile.name || '').split(' ');
        state.userProfile = {
          ...state.userProfile,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
        };
        // Remove old name field
        delete (state.userProfile as any).name;
        // Save migrated state
        saveAppState(state);
      }
      
      // Migration: Add custom restriction fields if they don't exist
      if (state.userPreferences) {
        if (!state.userPreferences.customAllergens) {
          state.userPreferences.customAllergens = [];
        }
        if (!state.userPreferences.customDietary) {
          state.userPreferences.customDietary = [];
        }
        if (!state.userPreferences.customReligious) {
          state.userPreferences.customReligious = [];
        }
      }
      
      return state;
    }
  } catch (error) {
    console.error('Error loading app state:', error);
  }
  return DEFAULT_STATE;
}

export function saveAppState(state: Partial<AppState>): void {
  try {
    const current = loadAppState();
    const updated = { ...current, ...state };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving app state:', error);
  }
}

export function saveUserPreferences(preferences: UserPreferences): void {
  saveAppState({ userPreferences: preferences });
}

export function toggleDarkMode(): boolean {
  const current = loadAppState();
  const newDarkMode = !current.darkMode;
  saveAppState({ darkMode: newDarkMode });
  return newDarkMode;
}

export function addSavedMenuItem(item: SavedMenuItem): void {
  const current = loadAppState();
  const exists = current.savedMenuItems.some(
    saved => saved.menuItemId === item.menuItemId && saved.restaurantId === item.restaurantId
  );
  
  if (!exists) {
    saveAppState({
      savedMenuItems: [...current.savedMenuItems, item]
    });
  }
}

export function removeSavedMenuItem(menuItemId: string, restaurantId: string): void {
  const current = loadAppState();
  saveAppState({
    savedMenuItems: current.savedMenuItems.filter(
      item => !(item.menuItemId === menuItemId && item.restaurantId === restaurantId)
    )
  });
}

export function isSavedMenuItem(menuItemId: string, restaurantId: string): boolean {
  const current = loadAppState();
  return current.savedMenuItems.some(
    item => item.menuItemId === menuItemId && item.restaurantId === restaurantId
  );
}

export function addSavedRestaurant(restaurant: SavedRestaurant): void {
  const current = loadAppState();
  const exists = current.savedRestaurants.some(
    saved => saved.restaurantId === restaurant.restaurantId
  );
  
  if (!exists) {
    saveAppState({
      savedRestaurants: [...current.savedRestaurants, restaurant]
    });
  }
}

export function removeSavedRestaurant(restaurantId: string): void {
  const current = loadAppState();
  saveAppState({
    savedRestaurants: current.savedRestaurants.filter(
      item => item.restaurantId !== restaurantId
    )
  });
}

export function isSavedRestaurant(restaurantId: string): boolean {
  const current = loadAppState();
  return current.savedRestaurants.some(
    item => item.restaurantId === restaurantId
  );
}

export function addSearchHistory(query: string): void {
  if (!query.trim()) return;
  
  const current = loadAppState();
  const filtered = current.searchHistory.filter(item => item.query !== query);
  const updated = [
    { query, timestamp: Date.now() },
    ...filtered
  ].slice(0, 10); // Keep last 10 searches
  
  saveAppState({ searchHistory: updated });
}

export function clearSearchHistory(): void {
  saveAppState({ searchHistory: [] });
}

export function addNotification(notification: Omit<Notification, 'id' | 'read' | 'timestamp'>): void {
  const current = loadAppState();
  const newNotification: Notification = {
    ...notification,
    id: `notif_${Date.now()}_${Math.random()}`,
    timestamp: Date.now(),
    read: false
  };
  
  saveAppState({
    notifications: [newNotification, ...current.notifications].slice(0, 50) // Keep last 50
  });
}

export function markNotificationRead(id: string): void {
  const current = loadAppState();
  saveAppState({
    notifications: current.notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    )
  });
}

export function clearAllNotifications(): void {
  saveAppState({ notifications: [] });
}

export function saveUserProfile(profile: UserProfile): void {
  saveAppState({ userProfile: profile });
}

export function getUserProfile(): UserProfile | undefined {
  const current = loadAppState();
  return current.userProfile;
}

// Premium status - stored in sessionStorage (resets each session)
export function loadPremiumStatus(): boolean {
  try {
    const stored = sessionStorage.getItem(PREMIUM_SESSION_KEY);
    return stored === 'true';
  } catch (error) {
    console.error('Error loading premium status:', error);
    return false;
  }
}

export function savePremiumStatus(hasPremium: boolean): void {
  try {
    sessionStorage.setItem(PREMIUM_SESSION_KEY, hasPremium.toString());
  } catch (error) {
    console.error('Error saving premium status:', error);
  }
}

export function upgradeToPremium(): void {
  savePremiumStatus(true);
  
  // Add a premium upgrade notification
  addNotification({
    type: 'new-restaurant',
    title: 'Welcome to Premium!',
    message: 'You now have access to group dining features and can add dining companions.',
    timestamp: Date.now()
  });
}

// Restaurant History
export function addRestaurantToHistory(restaurantId: string, restaurantName: string, cuisine: string): void {
  const current = loadAppState();
  const existing = current.restaurantHistory.find(item => item.restaurantId === restaurantId);
  
  let updated: RestaurantHistoryItem[];
  if (existing) {
    // Update existing entry - increment visit count and update timestamp
    updated = current.restaurantHistory.map(item =>
      item.restaurantId === restaurantId
        ? { ...item, visitedAt: Date.now(), visitCount: item.visitCount + 1 }
        : item
    );
  } else {
    // Add new entry
    const newItem: RestaurantHistoryItem = {
      restaurantId,
      restaurantName,
      cuisine,
      visitedAt: Date.now(),
      visitCount: 1
    };
    updated = [newItem, ...current.restaurantHistory];
  }
  
  // Sort by most recent visit and keep last 50
  updated.sort((a, b) => b.visitedAt - a.visitedAt);
  saveAppState({ restaurantHistory: updated.slice(0, 50) });
}

export function getRestaurantHistory(): RestaurantHistoryItem[] {
  const current = loadAppState();
  return current.restaurantHistory;
}

export function clearRestaurantHistory(): void {
  saveAppState({ restaurantHistory: [] });
}

// Birthday notifications
export function checkAndCreateBirthdayNotification(): boolean {
  const current = loadAppState();
  const profile = current.userProfile;
  
  if (!profile?.birthday) {
    return false;
  }

  const today = new Date();
  const birthdayDate = new Date(profile.birthday);
  
  // Check if today is the user's birthday (month and day match)
  const isBirthday = 
    today.getMonth() === birthdayDate.getMonth() && 
    today.getDate() === birthdayDate.getDate();
  
  if (!isBirthday) {
    return false;
  }

  // Check if we already sent a notification today
  const lastNotification = profile.lastBirthdayNotification;
  if (lastNotification) {
    const lastNotifDate = new Date(lastNotification);
    const isSameDay = 
      lastNotifDate.getFullYear() === today.getFullYear() &&
      lastNotifDate.getMonth() === today.getMonth() &&
      lastNotifDate.getDate() === today.getDate();
    
    if (isSameDay) {
      return false; // Already sent notification today
    }
  }

  // Create birthday notification with restaurant suggestion
  const birthdayRestaurants = [
    { name: "Carrabba's Italian Grill", id: "carrabbas-1", reason: "Italian favorites" },
    { name: "Olive Garden", id: "olive-garden-1", reason: "endless breadsticks" },
    { name: "Panera Bread", id: "panera-1", reason: "fresh and healthy options" },
    { name: "Cheesecake Factory", id: "cheesecake-1", reason: "birthday desserts" }
  ];
  
  const suggestion = birthdayRestaurants[Math.floor(Math.random() * birthdayRestaurants.length)];
  
  addNotification({
    type: 'new-restaurant',
    title: '🎉 Happy Birthday!',
    message: `Wishing you a wonderful birthday! Why not celebrate at ${suggestion.name} with their amazing ${suggestion.reason}?`,
    restaurantId: suggestion.id
  });

  // Update the lastBirthdayNotification timestamp
  saveUserProfile({
    ...profile,
    lastBirthdayNotification: Date.now()
  });

  return true;
}

// Payment Methods
export function getPaymentMethods(): PaymentMethod[] {
  const current = loadAppState();
  return current.paymentMethods;
}

export function addPaymentMethod(paymentMethod: Omit<PaymentMethod, 'id' | 'addedAt'>): PaymentMethod {
  const current = loadAppState();
  
  // If this is the first payment method or marked as default, make it default
  const isDefault = current.paymentMethods.length === 0 || paymentMethod.isDefault;
  
  // If setting as default, unset other defaults
  let updatedMethods = current.paymentMethods;
  if (isDefault) {
    updatedMethods = updatedMethods.map(pm => ({ ...pm, isDefault: false }));
  }
  
  const newPaymentMethod: PaymentMethod = {
    ...paymentMethod,
    id: `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    addedAt: Date.now(),
    isDefault
  };
  
  saveAppState({ 
    paymentMethods: [...updatedMethods, newPaymentMethod] 
  });
  
  return newPaymentMethod;
}

export function updatePaymentMethod(id: string, updates: Partial<PaymentMethod>): void {
  const current = loadAppState();
  let updatedMethods = current.paymentMethods.map(pm =>
    pm.id === id ? { ...pm, ...updates } : pm
  );
  
  // If setting a new default, unset others
  if (updates.isDefault) {
    updatedMethods = updatedMethods.map(pm =>
      pm.id === id ? pm : { ...pm, isDefault: false }
    );
  }
  
  saveAppState({ paymentMethods: updatedMethods });
}

export function deletePaymentMethod(id: string): void {
  const current = loadAppState();
  const filtered = current.paymentMethods.filter(pm => pm.id !== id);
  
  // If we deleted the default and there are others, make the first one default
  const deletedWasDefault = current.paymentMethods.find(pm => pm.id === id)?.isDefault;
  if (deletedWasDefault && filtered.length > 0) {
    filtered[0].isDefault = true;
  }
  
  saveAppState({ paymentMethods: filtered });
}

export function getDefaultPaymentMethod(): PaymentMethod | undefined {
  const current = loadAppState();
  return current.paymentMethods.find(pm => pm.isDefault);
}

// Reservations
export function getReservations(): Reservation[] {
  const current = loadAppState();
  return current.reservations.sort((a, b) => {
    // Sort by date/time, most recent first
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateB.getTime() - dateA.getTime();
  });
}

export function addReservation(reservation: Omit<Reservation, 'id' | 'createdAt' | 'status'>): Reservation {
  const current = loadAppState();
  
  const newReservation: Reservation = {
    ...reservation,
    id: `rsv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    status: 'confirmed',
    createdAt: Date.now()
  };
  
  saveAppState({ 
    reservations: [newReservation, ...current.reservations] 
  });
  
  // Add a notification
  addNotification({
    type: 'new-restaurant',
    title: 'Reservation Confirmed! 🎉',
    message: `Your table for ${reservation.partySize} at ${reservation.restaurantName} on ${reservation.date} at ${reservation.time} is confirmed.`,
    restaurantId: reservation.restaurantId
  });
  
  return newReservation;
}

export function cancelReservation(id: string): void {
  const current = loadAppState();
  const updated = current.reservations.map(r =>
    r.id === id ? { ...r, status: 'cancelled' as const } : r
  );
  
  const reservation = current.reservations.find(r => r.id === id);
  if (reservation) {
    addNotification({
      type: 'new-restaurant',
      title: 'Reservation Cancelled',
      message: `Your reservation at ${reservation.restaurantName} has been cancelled.`,
      restaurantId: reservation.restaurantId
    });
  }
  
  saveAppState({ reservations: updated });
}

export function getUpcomingReservations(): Reservation[] {
  const current = loadAppState();
  const now = new Date();
  
  return current.reservations
    .filter(r => {
      if (r.status !== 'confirmed') return false;
      const reservationDate = new Date(`${r.date}T${r.time}`);
      return reservationDate >= now;
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
}

// Location Settings
export function getLocationPermission(): LocationPermission {
  const current = loadAppState();
  return current.locationPermission;
}

export function setLocationPermission(permission: LocationPermission): void {
  saveAppState({ locationPermission: permission });
}

// Rewards System
export function getRewardsData(): RewardsData {
  const current = loadAppState();
  return current.rewardsData;
}

function calculateTier(points: number): { tier: RewardTier; pointsToNextTier: number } {
  if (points >= 1000) return { tier: 'platinum', pointsToNextTier: 0 };
  if (points >= 500) return { tier: 'gold', pointsToNextTier: 1000 - points };
  if (points >= 100) return { tier: 'silver', pointsToNextTier: 500 - points };
  return { tier: 'bronze', pointsToNextTier: 100 - points };
}

export function addPoints(points: number, reason: string, restaurantId?: string, restaurantName?: string): void {
  const current = loadAppState();
  const rewardsData = current.rewardsData;
  
  const newTotalPoints = rewardsData.totalPoints + points;
  const { tier, pointsToNextTier } = calculateTier(newTotalPoints);
  
  const transaction: PointsTransaction = {
    id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'earned',
    points,
    reason,
    restaurantId,
    restaurantName,
    timestamp: Date.now()
  };
  
  const updatedRewardsData: RewardsData = {
    ...rewardsData,
    totalPoints: newTotalPoints,
    tier,
    pointsToNextTier,
    transactions: [transaction, ...rewardsData.transactions]
  };
  
  saveAppState({ rewardsData: updatedRewardsData });
}

export function redeemReward(rewardId: string): boolean {
  const current = loadAppState();
  const rewardsData = current.rewardsData;
  
  const reward = rewardsData.rewards.find(r => r.id === rewardId);
  if (!reward || reward.isRedeemed) return false;
  
  if (rewardsData.totalPoints < reward.pointsCost) return false;
  
  const newTotalPoints = rewardsData.totalPoints - reward.pointsCost;
  const { tier, pointsToNextTier } = calculateTier(newTotalPoints);
  
  const transaction: PointsTransaction = {
    id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'redeemed',
    points: reward.pointsCost,
    reason: `Redeemed: ${reward.title}`,
    restaurantId: reward.restaurantId,
    restaurantName: reward.restaurantName,
    timestamp: Date.now()
  };
  
  const updatedRewards = rewardsData.rewards.map(r =>
    r.id === rewardId ? { ...r, isRedeemed: true, redeemedAt: Date.now() } : r
  );
  
  const updatedRewardsData: RewardsData = {
    ...rewardsData,
    totalPoints: newTotalPoints,
    tier,
    pointsToNextTier,
    rewards: updatedRewards,
    transactions: [transaction, ...rewardsData.transactions]
  };
  
  saveAppState({ rewardsData: updatedRewardsData });
  
  // Add notification
  addNotification({
    type: 'new-restaurant',
    title: '🎁 Reward Redeemed!',
    message: `You've redeemed: ${reward.title}`,
    restaurantId: reward.restaurantId
  });
  
  return true;
}

export function awardRestaurantVisitPoints(restaurantId: string, restaurantName: string): void {
  // Award 10-50 points based on random variation (simulating different restaurant point values)
  const points = Math.floor(Math.random() * 41) + 10; // 10-50 points
  addPoints(points, `Visited ${restaurantName}`, restaurantId, restaurantName);
}

export function awardReservationPoints(restaurantName: string, restaurantId: string): void {
  addPoints(25, `Made reservation at ${restaurantName}`, restaurantId, restaurantName);
}

export function awardDailyCheckInPoints(): void {
  const current = loadAppState();
  const today = new Date().toDateString();
  const lastCheckIn = localStorage.getItem('last_daily_checkin');
  
  if (lastCheckIn !== today) {
    addPoints(5, 'Daily check-in bonus');
    localStorage.setItem('last_daily_checkin', today);
  }
}

// Saved Companions
export function getSavedCompanions(): SavedCompanion[] {
  const current = loadAppState();
  return current.savedCompanions || [];
}

export function addSavedCompanion(name: string, restrictions: string[]): SavedCompanion {
  const current = loadAppState();
  
  const newCompanion: SavedCompanion = {
    id: `companion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    restrictions,
    createdAt: Date.now()
  };
  
  saveAppState({ 
    savedCompanions: [...current.savedCompanions, newCompanion] 
  });
  
  return newCompanion;
}

export function deleteSavedCompanion(id: string): void {
  const current = loadAppState();
  saveAppState({
    savedCompanions: current.savedCompanions.filter(c => c.id !== id)
  });
}

export function updateSavedCompanion(id: string, name: string, restrictions: string[]): void {
  const current = loadAppState();
  saveAppState({
    savedCompanions: current.savedCompanions.map(c =>
      c.id === id ? { ...c, name, restrictions } : c
    )
  });
}