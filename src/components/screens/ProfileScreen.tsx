import { ChevronLeft, Bell, Moon, Sun, Trash2, Settings, User, Crown, Edit, LogOut, Clock, CreditCard, Calendar, MapPin, Gift, Crosshair } from 'lucide-react';
import { BottomNav } from '../BottomNav';
import { Notification, UserProfile } from '../../types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  notifications: Notification[];
  onClearNotifications: () => void;
  userProfile?: UserProfile;
  onLogout: () => void;
  hasPremium?: boolean;
  onUpgradeToPremium?: () => void;
}

export function ProfileScreen({ 
  onNavigate, 
  darkMode, 
  onToggleDarkMode,
  notifications,
  onClearNotifications,
  userProfile,
  onLogout,
  hasPremium = false,
  onUpgradeToPremium
}: ProfileScreenProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-secondary pb-20">
      {/* Header */}
      <div className="bg-card px-6 pt-6 pb-4 border-b border-border">
        <h2 className="text-xl mb-4 text-card-foreground">Profile & Settings</h2>
      </div>

      {/* Profile Section */}
      <div className="bg-card px-6 py-6 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-[#2D7A46] dark:bg-green-700 rounded-full flex items-center justify-center overflow-hidden">
            {userProfile?.photoUrl ? (
              <img src={userProfile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={32} className="text-white" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg text-card-foreground">
              {userProfile?.firstName && userProfile?.lastName 
                ? `${userProfile.firstName} ${userProfile.lastName}` 
                : 'Guest User'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {userProfile?.email || 'Free Plan'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('edit-profile')}
            className="w-10 h-10 rounded-full bg-secondary hover:bg-accent flex items-center justify-center transition-colors"
          >
            <Edit size={18} className="text-foreground" />
          </button>
        </div>
        {!hasPremium && (
          <Button 
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
            onClick={() => onNavigate('premium-upgrade')}
          >
            <Crown size={18} className="mr-2" />
            Upgrade to Premium
          </Button>
        )}
        {hasPremium && (
          <div className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2">
            <Crown size={18} />
            <span>Premium Member</span>
          </div>
        )}
      </div>

      {/* Settings Section */}
      <div className="bg-card px-6 py-4 mb-4">
        <h3 className="text-lg mb-4 text-card-foreground">Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon size={20} className="text-foreground" /> : <Sun size={20} className="text-foreground" />}
              <div>
                <p className="font-medium text-card-foreground">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Toggle dark theme</p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={onToggleDarkMode} />
          </div>

          <Separator />

          <button
            onClick={() => onNavigate('personalization-menu')}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-3">
              <Settings size={20} className="text-foreground" />
              <div className="text-left">
                <p className="font-medium text-card-foreground">Dietary Restrictions</p>
                <p className="text-sm text-muted-foreground">Manage your restrictions</p>
              </div>
            </div>
            <span className="text-muted-foreground">›</span>
          </button>

          <Separator />

          <button
            onClick={() => onNavigate('payment-methods')}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-3">
              <CreditCard size={20} className="text-foreground" />
              <div className="text-left">
                <p className="font-medium text-card-foreground">Payment Methods</p>
                <p className="text-sm text-muted-foreground">Manage cards & gift cards</p>
              </div>
            </div>
            <span className="text-muted-foreground">›</span>
          </button>

          <Separator />

          <button
            onClick={() => onNavigate('location-settings')}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-foreground" />
              <div className="text-left">
                <p className="font-medium text-card-foreground">Location Settings</p>
                <p className="text-sm text-muted-foreground">Manage location permissions</p>
              </div>
            </div>
            <span className="text-muted-foreground">›</span>
          </button>

          <Separator />

          <button
            onClick={() => onNavigate('location-diagnostic')}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-3">
              <Crosshair size={20} className="text-foreground" />
              <div className="text-left">
                <p className="font-medium text-card-foreground">Location Diagnostic</p>
                <p className="text-sm text-muted-foreground">Test location access</p>
              </div>
            </div>
            <span className="text-muted-foreground">›</span>
          </button>

          <Separator />

          <button
            onClick={() => onNavigate('restaurant-history')}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-foreground" />
              <div className="text-left">
                <p className="font-medium text-card-foreground">Restaurant History</p>
                <p className="text-sm text-muted-foreground">View visited restaurants</p>
              </div>
            </div>
            <span className="text-muted-foreground">›</span>
          </button>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-card px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-foreground" />
            <h3 className="text-lg text-card-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <Badge className="bg-red-600 text-white">{unreadCount}</Badge>
            )}
          </div>
          {notifications.length > 0 && (
            <button
              onClick={onClearNotifications}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              Clear all
            </button>
          )}
        </div>

        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.slice(0, 10).map((notification) => {
              const isBirthday = notification.title.includes('Birthday') || notification.title.includes('🎉');
              return (
                <div
                  key={notification.id}
                  className={`p-4 rounded-xl border ${
                    isBirthday && !notification.read
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-300 dark:border-yellow-700'
                      : notification.read 
                      ? 'bg-muted border-border' 
                      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      isBirthday && !notification.read
                        ? 'bg-yellow-600 dark:bg-yellow-400'
                        : notification.read 
                        ? 'bg-muted-foreground' 
                        : 'bg-blue-600 dark:bg-blue-400'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium mb-1 text-card-foreground">{notification.title}</p>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Bell size={48} className="text-muted-foreground mx-auto mb-3 opacity-30" />
            <p className="text-muted-foreground">No notifications</p>
            <p className="text-sm text-muted-foreground">You'll see updates about new restaurants here</p>
          </div>
        )}
      </div>

      {/* Logout Section */}
      <div className="bg-card px-6 py-4 mb-4">
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full border-2 border-red-600 text-red-600 hover:bg-red-50 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-950/20 h-12 gap-2"
        >
          <LogOut size={20} />
          Log Out
        </Button>
      </div>

      <BottomNav active="profile" onNavigate={(screen) => onNavigate(screen)} />
    </div>
  );
}
