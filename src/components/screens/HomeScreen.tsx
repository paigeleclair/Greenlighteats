import { Search, MapPin, Bell, Moon, Sun, Sparkles } from 'lucide-react';
import { BottomNav } from '../BottomNav';
import { Input } from '../ui/input';
import { UserPreferences, Notification } from '../../types';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
  userPreferences?: UserPreferences;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  notifications: Notification[];
  onMarkNotificationRead: (id: string) => void;
}

export function HomeScreen({ onNavigate, userPreferences, darkMode, onToggleDarkMode, notifications, onMarkNotificationRead }: HomeScreenProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-secondary pb-20">
      {/* Header */}
      <div className="bg-[#2D7A46] px-6 pt-6 pb-4 border-b border-[#236035]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl text-white">GreenLight Eats</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={onToggleDarkMode}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              {darkMode ? <Sun size={20} className="text-white" /> : <Moon size={20} className="text-white" />}
            </button>
            <button 
              onClick={() => onNavigate('notifications')}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors relative"
            >
              <Bell size={20} className="text-white" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-600 text-white text-xs">
                  {unreadCount}
                </Badge>
              )}
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <Input
            type="text"
            placeholder="Search restaurants or dishes..."
            className="pl-10 pr-4 h-12 rounded-xl bg-white text-gray-900 border-white placeholder:text-gray-500"
            onClick={() => onNavigate('search')}
            readOnly
          />
        </div>
      </div>

      {/* Hero Section with Background Image */}
      <div className="relative mx-6 my-6 h-56 rounded-2xl overflow-hidden shadow-lg">
        {/* Background Image */}
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1605034298551-baacf17591d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZnJlc2glMjBzYWxhZCUyMGJvd2x8ZW58MXx8fHwxNzYyMTE0MzM2fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Healthy fresh food"
          className="w-full h-full object-cover"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center px-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#2D7A46] flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="text-sm text-white/90 tracking-wide">SAFE DINING</span>
          </div>
          <h2 className="text-3xl text-white mb-3">
            The Green Light to<br />Eat With Confidence
          </h2>
          <p className="text-base text-white/90 max-w-sm">
            Discover restaurants that match your dietary needs and preferences
          </p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="px-6 pb-6 space-y-4">
        <button
          onClick={() => onNavigate('search')}
          className="w-full bg-card rounded-2xl p-6 shadow-md border border-border hover:shadow-lg transition-all hover:scale-[1.02]"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
              <MapPin size={28} className="text-[#2D7A46] dark:text-green-400" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-xl mb-1 text-card-foreground">Nearby Restaurants</h3>
              <p className="text-base text-muted-foreground">Find safe dining options near you with real menus</p>
            </div>
          </div>
        </button>
      </div>

      {/* Recent Activity Section */}
      <div className="px-6 py-6">
        <h3 className="text-xl mb-4 text-foreground">Recent Activity</h3>
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          <p className="text-base text-muted-foreground text-center">You haven't visited any restaurants yet</p>
        </div>
      </div>
    </div>
  );
}