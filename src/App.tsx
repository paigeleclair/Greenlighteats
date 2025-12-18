import { useState, useEffect } from 'react';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { PersonalizationSetupScreen } from './components/screens/PersonalizationSetupScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { QuickFiltersScreen } from './components/screens/QuickFiltersScreen';
import { SearchScreen } from './components/screens/SearchScreen';
import { RestaurantDetailScreen } from './components/screens/RestaurantDetailScreen';
import { MenuItemDetailScreen } from './components/screens/MenuItemDetailScreen';
import { SavedScreen } from './components/screens/SavedScreen';
import { PersonalizationMenuScreen } from './components/screens/PersonalizationMenuScreen';
import { GroupResultScreen } from './components/screens/GroupResultScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { EditProfileScreen } from './components/screens/EditProfileScreen';
import { RestaurantHistoryScreen } from './components/screens/RestaurantHistoryScreen';
import { PaymentMethodsScreen } from './components/screens/PaymentMethodsScreen';
import { AddPaymentMethodScreen } from './components/screens/AddPaymentMethodScreen';
import { LocationSettingsScreen } from './components/screens/LocationSettingsScreen';
import { LocationDiagnostic } from './components/LocationDiagnostic';
import { GroupDiningScreen } from './components/screens/GroupDiningScreen';
import { GroupDiningTabScreen } from './components/screens/GroupDiningTabScreen';
import { AddCompanionScreen } from './components/screens/AddCompanionScreen';
import { PremiumUpgradeScreen } from './components/screens/PremiumUpgradeScreen';
import { PremiumPaymentScreen } from './components/screens/PremiumPaymentScreen';
import { RewardsScreen } from './components/screens/RewardsScreen';
import { NotificationsScreen } from './components/screens/NotificationsScreen';
import { BottomNav } from './components/BottomNav';
import { UserPreferences, UserProfile, SavedMenuItem, SavedRestaurant, SavedGroup, SavedCompanion, SearchHistoryItem, Notification, RestaurantHistoryItem, PaymentMethod, LocationPermission, RewardsData } from './types';
import { loadAppState, saveAppState, saveUserPreferences, saveUserProfile, loadPremiumStatus, savePremiumStatus, addRestaurantToHistory, clearRestaurantHistory, checkAndCreateBirthdayNotification, getPaymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod, getRewardsData, redeemReward, awardRestaurantVisitPoints, awardDailyCheckInPoints, getSavedCompanions, addSavedCompanion, deleteSavedCompanion } from './utils/storage';
import { mockFriends } from './data/mockData';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

type Screen = 
  | 'onboarding'
  | 'personalization-setup'
  | 'home'
  | 'quick-filters'
  | 'search'
  | 'restaurant-detail'
  | 'menu-item-detail'
  | 'group-dining'
  | 'group-result'
  | 'saved'
  | 'group'
  | 'add-companion'
  | 'personalization-menu'
  | 'profile'
  | 'edit-profile'
  | 'restaurant-history'
  | 'payment-methods'
  | 'add-payment-method'
  | 'rewards'
  | 'location-settings'
  | 'location-diagnostic'
  | 'premium-upgrade'
  | 'premium-payment'
  | 'notifications';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [screenData, setScreenData] = useState<any>(null);
  const [navigationHistory, setNavigationHistory] = useState<Array<{ screen: Screen; data?: any }>>([]);
  const [selectedGroupFriends, setSelectedGroupFriends] = useState<string[]>([]);
  const [activeGroupMembers, setActiveGroupMembers] = useState<Array<{id: string, name: string, restrictions: string[]}>>([]);
  
  // Load state from localStorage on mount
  const [appState, setAppState] = useState(() => loadAppState());
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(appState.userPreferences);
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>(appState.userProfile);
  const [savedMenuItems, setSavedMenuItems] = useState<SavedMenuItem[]>(appState.savedMenuItems);
  const [savedRestaurants, setSavedRestaurants] = useState<SavedRestaurant[]>(appState.savedRestaurants);
  const [savedGroups, setSavedGroups] = useState<SavedGroup[]>(appState.savedGroups || []);
  const [savedCompanions, setSavedCompanions] = useState<SavedCompanion[]>(appState.savedCompanions || []);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(appState.searchHistory);
  const [restaurantHistory, setRestaurantHistory] = useState<RestaurantHistoryItem[]>(appState.restaurantHistory);
  const [notifications, setNotifications] = useState<Notification[]>(appState.notifications);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(appState.paymentMethods || []);
  const [rewardsData, setRewardsData] = useState<RewardsData>(appState.rewardsData);
  const [darkMode, setDarkMode] = useState<boolean>(appState.darkMode);
  const [locationPermission, setLocationPermission] = useState<LocationPermission>(appState.locationPermission || 'never');
  const [hasPremium, setHasPremium] = useState<boolean>(loadPremiumStatus());

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Sync state to localStorage
  useEffect(() => {
    saveAppState({
      userPreferences,
      userProfile,
      savedMenuItems,
      savedRestaurants,
      savedGroups,
      searchHistory,
      restaurantHistory,
      notifications,
      paymentMethods,
      rewardsData,
      darkMode,
      locationPermission
      // hasPremium is NOT synced to localStorage - it uses sessionStorage
    });
  }, [userPreferences, userProfile, savedMenuItems, savedRestaurants, savedGroups, searchHistory, restaurantHistory, notifications, paymentMethods, rewardsData, darkMode, locationPermission]);

  // Sync premium status to sessionStorage separately
  useEffect(() => {
    savePremiumStatus(hasPremium);
  }, [hasPremium]);

  // Track restaurant visits and award points
  useEffect(() => {
    if (currentScreen === 'restaurant-detail' && screenData?.restaurant) {
      const restaurant = screenData.restaurant;
      addRestaurantToHistory(restaurant.id, restaurant.name, restaurant.cuisine);
      
      // Award points for visiting restaurant (only once per session per restaurant)
      const visitKey = `visited_${restaurant.id}_${Date.now()}`;
      const lastVisit = sessionStorage.getItem(`last_visit_${restaurant.id}`);
      const now = Date.now();
      
      // Award points if haven't visited this restaurant in the last hour
      if (!lastVisit || now - parseInt(lastVisit) > 60 * 60 * 1000) {
        awardRestaurantVisitPoints(restaurant.id, restaurant.name);
        sessionStorage.setItem(`last_visit_${restaurant.id}`, now.toString());
      }
      
      // Reload the state
      const updatedState = loadAppState();
      setRestaurantHistory(updatedState.restaurantHistory);
      setRewardsData(updatedState.rewardsData);
    }
  }, [currentScreen, screenData]);

  // Check for birthday notifications and daily check-in
  useEffect(() => {
    if (currentScreen === 'home') {
      const birthdayNotificationCreated = checkAndCreateBirthdayNotification();
      if (birthdayNotificationCreated) {
        // Reload notifications to show the birthday message
        const updatedState = loadAppState();
        setNotifications(updatedState.notifications);
      }
      
      // Award daily check-in points
      awardDailyCheckInPoints();
      const updatedState = loadAppState();
      setRewardsData(updatedState.rewardsData);
      setNotifications(updatedState.notifications);
    }
  }, [currentScreen]);

  // Simulate new restaurant notification (for demo purposes)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentScreen === 'home' && notifications.length === 0) {
        const newNotification: Notification = {
          id: `notif_${Date.now()}`,
          type: 'new-restaurant',
          title: 'New Restaurant Added!',
          message: "Panera Bread just joined GreenLight Eats with 85% safe menu items for your diet.",
          restaurantId: 'panera',
          timestamp: Date.now(),
          read: false
        };
        setNotifications([newNotification, ...notifications]);
      }
    }, 5000); // Show after 5 seconds on home screen

    return () => clearTimeout(timer);
  }, [currentScreen]);

  const navigate = (screen: Screen, data?: any) => {
    setNavigationHistory([...navigationHistory, { screen: currentScreen, data: screenData }]);
    setCurrentScreen(screen);
    setScreenData(data);
  };

  const goBack = () => {
    if (navigationHistory.length > 0) {
      const previous = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(navigationHistory.slice(0, -1));
      setCurrentScreen(previous.screen);
      setScreenData(previous.data);
    }
  };

  const handlePreferencesComplete = (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    saveUserPreferences(preferences);
    navigate('home');
  };

  const handlePreferencesUpdate = (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    saveUserPreferences(preferences);
  };

  const handleProfileUpdate = (profile: UserProfile) => {
    setUserProfile(profile);
    saveUserProfile(profile);
    
    // Check if birthday notification should be created
    checkAndCreateBirthdayNotification();
    const updatedState = loadAppState();
    setNotifications(updatedState.notifications);
    setUserProfile(updatedState.userProfile);
    
    goBack();
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const handleSkipPersonalization = () => {
    // Use default preferences when skipping
    navigate('home');
  };

  const handleSaveMenuItem = (menuItem: SavedMenuItem) => {
    setSavedMenuItems([...savedMenuItems, menuItem]);
    saveAppState({ userPreferences, savedMenuItems, searchHistory, notifications });
  };

  const handleRemoveSavedMenuItem = (menuItem: SavedMenuItem) => {
    setSavedMenuItems(savedMenuItems.filter(item => item.id !== menuItem.id));
    saveAppState({ userPreferences, savedMenuItems, searchHistory, notifications });
  };

  const handleAddSearchHistoryItem = (searchHistoryItem: SearchHistoryItem) => {
    setSearchHistory([...searchHistory, searchHistoryItem]);
    saveAppState({ userPreferences, savedMenuItems, searchHistory, notifications });
  };

  const handleAddNotification = (notification: Notification) => {
    setNotifications([...notifications, notification]);
    saveAppState({ userPreferences, savedMenuItems, searchHistory, notifications });
  };

  const handleSendGroupInvites = (friendIds: string[]) => {
    // Create group invite notifications (simulated)
    const inviteId = `invite_${Date.now()}`;
    const fromUser = userProfile?.firstName && userProfile?.lastName 
      ? `${userProfile.firstName} ${userProfile.lastName}` 
      : 'Someone';
    
    friendIds.forEach(friendId => {
      const friend = mockFriends.find(f => f.id === friendId);
      if (friend) {
        const inviteNotification: Notification = {
          id: `notif_${Date.now()}_${friendId}`,
          type: 'group-invite',
          title: 'Group Dining Invite',
          message: `${fromUser} invited you to join a group dining session on GreenLight Eats`,
          timestamp: Date.now(),
          read: false,
          inviteData: {
            fromUser,
            friendIds,
            inviteId
          }
        };
        
        // In a real app, this would send to the friend's notification system
        // For demo, we'll add it to current user's notifications as "sent"
        setTimeout(() => {
          const sentNotification: Notification = {
            id: `sent_${Date.now()}_${friendId}`,
            type: 'new-restaurant',
            title: 'Invite Sent',
            message: `Group invite sent to ${friend.name}`,
            timestamp: Date.now(),
            read: false
          };
          setNotifications(prev => [sentNotification, ...prev]);
        }, 1000);
      }
    });
  };

  const handleUpgradeToPremium = () => {
    setHasPremium(true);
    savePremiumStatus(true);
    
    // Add a premium upgrade notification
    const newNotification: Notification = {
      id: `notif_${Date.now()}`,
      type: 'new-restaurant',
      title: 'Welcome to Premium! 🎉',
      message: 'You now have access to group dining features and can add dining companions.',
      timestamp: Date.now(),
      read: false
    };
    setNotifications([newNotification, ...notifications]);
  };

  const handleRedeemReward = (rewardId: string) => {
    const success = redeemReward(rewardId);
    if (success) {
      const updatedState = loadAppState();
      setRewardsData(updatedState.rewardsData);
      setNotifications(updatedState.notifications);
    }
  };

  const handleLogout = () => {
    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    
    // Reset all state to initial values
    const defaultAppState = {
      userPreferences: { allergens: [], dietary: [], religious: [], customAllergens: [], customDietary: [], customReligious: [] },
      userProfile: undefined,
      savedMenuItems: [],
      savedRestaurants: [],
      savedGroups: [],
      searchHistory: [],
      restaurantHistory: [],
      notifications: [],
      paymentMethods: [],
      darkMode: false
    };
    
    setUserPreferences(defaultAppState.userPreferences);
    setUserProfile(defaultAppState.userProfile);
    setSavedMenuItems(defaultAppState.savedMenuItems);
    setSavedRestaurants(defaultAppState.savedRestaurants);
    setSavedGroups(defaultAppState.savedGroups);
    setSearchHistory(defaultAppState.searchHistory);
    setRestaurantHistory(defaultAppState.restaurantHistory);
    setNotifications(defaultAppState.notifications);
    setPaymentMethods(defaultAppState.paymentMethods);
    setDarkMode(defaultAppState.darkMode);
    setLocationPermission('never');
    setHasPremium(false);
    setSelectedGroupFriends([]);
    
    // Reload rewards data from default state
    const freshState = loadAppState();
    setRewardsData(freshState.rewardsData);
    
    // Clear navigation history and go to onboarding
    setNavigationHistory([]);
    setCurrentScreen('onboarding');
    setScreenData(null);
  };

  return (
    <div className="h-screen max-w-md mx-auto bg-background relative overflow-auto pb-20">
      {currentScreen === 'onboarding' && (
        <OnboardingScreen
          onSignUp={() => navigate('personalization-setup')}
          onLogin={() => navigate('home')}
        />
      )}

      {currentScreen === 'personalization-setup' && (
        <PersonalizationSetupScreen
          onComplete={handlePreferencesComplete}
          onBack={goBack}
          onSkip={handleSkipPersonalization}
        />
      )}

      {currentScreen === 'home' && (
        <HomeScreen 
          onNavigate={navigate}
          userPreferences={userPreferences}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          notifications={notifications}
          onMarkNotificationRead={(id) => {
            setNotifications(notifications.map(n => 
              n.id === id ? { ...n, read: true } : n
            ));
          }}
        />
      )}

      {currentScreen === 'quick-filters' && (
        <QuickFiltersScreen
          onApply={(filters) => {
            console.log('Applied filters:', filters);
            goBack();
          }}
          onBack={goBack}
        />
      )}

      {currentScreen === 'search' && (
        <SearchScreen 
          onNavigate={navigate} 
          userPreferences={userPreferences}
          searchHistory={searchHistory}
          onAddSearchHistory={(query) => {
            const filtered = searchHistory.filter(item => item.query !== query);
            setSearchHistory([
              { query, timestamp: Date.now() },
              ...filtered
            ].slice(0, 10));
          }}
          onClearSearchHistory={() => setSearchHistory([])}
        />
      )}

      {currentScreen === 'restaurant-detail' && screenData?.restaurant && (
        <RestaurantDetailScreen
          restaurant={screenData.restaurant}
          onNavigate={navigate}
          onBack={goBack}
          userPreferences={userPreferences}
          savedMenuItems={savedMenuItems}
          savedRestaurants={savedRestaurants}
          hasPremium={hasPremium}
          onUpgradeToPremium={handleUpgradeToPremium}
          activeGroupMembers={activeGroupMembers}
          onToggleSaveItem={(item, restaurantId, restaurantName) => {
            console.log('Toggle save item called:', {item: item.id, restaurantId, restaurantName});
            const exists = savedMenuItems.some(
              saved => saved.menuItemId === item.id && saved.restaurantId === restaurantId
            );
            console.log('Item exists?', exists);
            console.log('Current savedMenuItems:', savedMenuItems);
            if (exists) {
              setSavedMenuItems(savedMenuItems.filter(
                saved => !(saved.menuItemId === item.id && saved.restaurantId === restaurantId)
              ));
            } else {
              const newItem = {
                menuItemId: item.id,
                restaurantId,
                restaurantName,
                savedAt: Date.now()
              };
              console.log('Adding new item:', newItem);
              setSavedMenuItems([...savedMenuItems, newItem]);
            }
          }}
          onToggleSaveRestaurant={(restaurant) => {
            console.log('Toggle save restaurant called:', restaurant.id);
            const exists = savedRestaurants.some(
              saved => saved.restaurantId === restaurant.id
            );
            console.log('Restaurant exists?', exists);
            console.log('Current savedRestaurants:', savedRestaurants);
            if (exists) {
              setSavedRestaurants(savedRestaurants.filter(
                saved => saved.restaurantId !== restaurant.id
              ));
            } else {
              const newRestaurant = {
                restaurantId: restaurant.id,
                restaurantName: restaurant.name,
                cuisine: restaurant.cuisine,
                savedAt: Date.now()
              };
              console.log('Adding new restaurant:', newRestaurant);
              setSavedRestaurants([...savedRestaurants, newRestaurant]);
            }
          }}
          onShareWithGroup={(restaurantId, restaurantName, memberIds) => {
            // Create notifications for each selected member
            const newNotifications = memberIds.map(memberId => {
              const member = mockFriends.find(f => f.id === memberId);
              return {
                id: `notif_${Date.now()}_${Math.random()}`,
                type: 'new-restaurant' as const,
                title: 'Restaurant Shared with You',
                message: `Check out ${restaurantName}! Someone thought you'd like it.`,
                restaurantId: restaurantId,
                timestamp: Date.now(),
                read: false
              };
            });
            
            setNotifications([...notifications, ...newNotifications]);
          }}
        />
      )}

      {currentScreen === 'menu-item-detail' && screenData?.item && (
        <MenuItemDetailScreen
          item={screenData.item}
          onNavigate={navigate}
          onBack={goBack}
          userPreferences={userPreferences}
          restaurantId={screenData.restaurantId}
          restaurantName={screenData.restaurantName}
          savedMenuItems={savedMenuItems}
          onToggleSave={(item, restaurantId, restaurantName) => {
            const exists = savedMenuItems.some(
              saved => saved.menuItemId === item.id && saved.restaurantId === restaurantId
            );
            if (exists) {
              setSavedMenuItems(savedMenuItems.filter(
                saved => !(saved.menuItemId === item.id && saved.restaurantId === restaurantId)
              ));
            } else {
              setSavedMenuItems([...savedMenuItems, {
                menuItemId: item.id,
                restaurantId,
                restaurantName,
                savedAt: Date.now()
              }]);
            }
          }}
        />
      )}

      {currentScreen === 'group-dining' && (
        <GroupDiningScreen
          onApply={(friends) => {
            console.log('Selected friends:', friends);
            setSelectedGroupFriends(friends);
            navigate('group-result');
          }}
          onDone={(friendIds, friendNames) => {
            console.log('onDone called with:', friendIds, friendNames);
            // Set the active group members with full data
            const members = mockFriends
              .filter(f => friendIds.includes(f.id))
              .map(f => ({
                id: f.id,
                name: f.name,
                restrictions: f.restrictions
              }));
            
            setActiveGroupMembers(members);
            
            // Save the group with the restaurant context
            if (screenData?.restaurantContext) {
              console.log('Restaurant context exists:', screenData.restaurantContext);
              const newGroup: SavedGroup = {
                id: `group_${Date.now()}`,
                name: `Dining at ${screenData.restaurantContext.restaurantName}`,
                memberIds: friendIds,
                memberNames: friendNames,
                restaurantId: screenData.restaurantContext.restaurantId,
                restaurantName: screenData.restaurantContext.restaurantName,
                createdAt: Date.now()
              };
              setSavedGroups([...savedGroups, newGroup]);
              toast.success(`Filtering menu for ${members.length} member(s)!`);
              
              // Go back to restaurant detail with the active group members
              goBack();
            } else {
              console.error('No restaurant context found in screenData:', screenData);
            }
          }}
          restaurantContext={screenData?.restaurantContext}
          onBack={goBack}
        />
      )}

      {currentScreen === 'group-result' && (
        <GroupResultScreen 
          onBack={goBack}
          selectedFriendIds={selectedGroupFriends}
          onSendInvites={() => handleSendGroupInvites(selectedGroupFriends)}
        />
      )}

      {currentScreen === 'saved' && (
        <SavedScreen 
          onNavigate={navigate}
          savedMenuItems={savedMenuItems}
          savedRestaurants={savedRestaurants}
          userPreferences={userPreferences}
        />
      )}

      {currentScreen === 'group' && (
        <GroupDiningTabScreen
          onNavigate={navigate}
          userPreferences={userPreferences}
          hasPremium={hasPremium}
          onUpgradeToPremium={handleUpgradeToPremium}
          savedGroups={savedGroups}
          savedCompanions={savedCompanions}
          onDeleteCompanion={(id) => {
            deleteSavedCompanion(id);
            setSavedCompanions(getSavedCompanions());
            toast.success('Companion removed');
          }}
          restaurantContext={screenData?.restaurantContext}
        />
      )}

      {currentScreen === 'rewards' && (
        <RewardsScreen
          onBack={goBack}
          rewardsData={rewardsData}
        />
      )}

      {currentScreen === 'personalization-menu' && (
        <PersonalizationMenuScreen
          initialPreferences={userPreferences}
          onSave={handlePreferencesUpdate}
          onBack={goBack}
        />
      )}

      {currentScreen === 'profile' && (
        <ProfileScreen 
          onNavigate={navigate}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          notifications={notifications}
          onClearNotifications={() => setNotifications([])}
          userProfile={userProfile}
          onLogout={handleLogout}
          hasPremium={hasPremium}
          onUpgradeToPremium={handleUpgradeToPremium}
        />
      )}

      {currentScreen === 'edit-profile' && (
        <EditProfileScreen
          initialProfile={userProfile}
          onSave={handleProfileUpdate}
          onBack={goBack}
        />
      )}

      {currentScreen === 'restaurant-history' && (
        <RestaurantHistoryScreen
          onBack={goBack}
          onNavigate={navigate}
          restaurantHistory={restaurantHistory}
          onClearHistory={() => {
            clearRestaurantHistory();
            setRestaurantHistory([]);
          }}
        />
      )}

      {currentScreen === 'payment-methods' && (
        <PaymentMethodsScreen
          paymentMethods={paymentMethods}
          onBack={goBack}
          onAddPaymentMethod={() => navigate('add-payment-method')}
          onSetDefault={(id) => {
            updatePaymentMethod(id, { isDefault: true });
            setPaymentMethods(getPaymentMethods());
          }}
          onDelete={(id) => {
            deletePaymentMethod(id);
            setPaymentMethods(getPaymentMethods());
          }}
        />
      )}

      {currentScreen === 'add-payment-method' && (
        <AddPaymentMethodScreen
          onBack={goBack}
          onSave={(paymentMethod) => {
            addPaymentMethod(paymentMethod);
            setPaymentMethods(getPaymentMethods());
            goBack();
          }}
        />
      )}

      {currentScreen === 'location-settings' && (
        <LocationSettingsScreen
          initialPermission={locationPermission}
          onSave={(permission) => {
            setLocationPermission(permission);
          }}
          onBack={goBack}
        />
      )}

      {currentScreen === 'location-diagnostic' && (
        <div className="min-h-screen bg-secondary">
          <div className="bg-card px-6 pt-6 pb-4 border-b border-border">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors mb-4"
            >
              <span>←</span>
              <span>Back</span>
            </button>
          </div>
          <LocationDiagnostic />
        </div>
      )}

      {currentScreen === 'premium-upgrade' && (
        <PremiumUpgradeScreen
          onSelectPlan={(planType) => navigate('premium-payment', { planType })}
          onBack={goBack}
        />
      )}

      {currentScreen === 'premium-payment' && (
        <PremiumPaymentScreen
          planType={screenData?.planType || 'yearly'}
          onComplete={() => {
            handleUpgradeToPremium();
            // Navigate back to the screen that triggered the upgrade
            goBack();
            goBack();
          }}
          onBack={goBack}
        />
      )}

      {currentScreen === 'notifications' && (
        <NotificationsScreen
          notifications={notifications}
          onBack={goBack}
          onMarkAsRead={(id) => {
            setNotifications(notifications.map(n => 
              n.id === id ? { ...n, read: true } : n
            ));
          }}
          onClearAll={() => setNotifications([])}
          onNavigate={navigate}
        />
      )}

      {currentScreen === 'add-companion' && (
        <AddCompanionScreen
          onBack={goBack}
          onSave={(name, restrictions) => {
            const newCompanion = addSavedCompanion(name, restrictions);
            setSavedCompanions(getSavedCompanions());
            toast.success(`${name} added to companions!`);
            goBack();
          }}
        />
      )}

      <Toaster />
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={navigate}
      />
    </div>
  );
}