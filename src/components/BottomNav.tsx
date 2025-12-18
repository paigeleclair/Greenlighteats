import React from 'react';
import { Home, Search, Heart, User, Users } from 'lucide-react';

interface BottomNavProps {
  currentScreen: string;
  onNavigate: (screen: any) => void;
}

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  // Don't show BottomNav on onboarding or personalization setup screens
  if (currentScreen === 'onboarding' || currentScreen === 'personalization-setup') {
    return null;
  }

  // Map current screen to active tab
  const getActiveTab = () => {
    if (currentScreen === 'home') return 'home';
    if (currentScreen === 'search' || 
        currentScreen === 'restaurant-detail' || 
        currentScreen === 'menu-item-detail' ||
        currentScreen === 'quick-filters') return 'search';
    if (currentScreen === 'saved') return 'saved';
    if (currentScreen === 'group' || 
        currentScreen === 'group-dining' || 
        currentScreen === 'group-result') return 'group';
    if (currentScreen === 'profile' || 
        currentScreen === 'edit-profile' || 
        currentScreen === 'restaurant-history' || 
        currentScreen === 'payment-methods' || 
        currentScreen === 'add-payment-method' ||
        currentScreen === 'location-settings' ||
        currentScreen === 'personalization-menu' ||
        currentScreen === 'notifications') {
      return 'profile';
    }
    // For other screens, don't highlight any tab
    return null;
  };

  const active = getActiveTab();

  const navItems = [
    { id: 'home' as const, icon: Home, label: 'Home' },
    { id: 'search' as const, icon: Search, label: 'Search' },
    { id: 'saved' as const, icon: Heart, label: 'Saved' },
    { id: 'group' as const, icon: Users, label: 'Group' },
    { id: 'profile' as const, icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-pb">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive ? 'text-[#2D7A46] dark:text-green-400' : 'text-muted-foreground'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}