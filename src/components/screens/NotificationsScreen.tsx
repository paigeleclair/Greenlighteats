import { ChevronLeft, Bell, Package, AlertTriangle, Users, X } from 'lucide-react';
import { Notification } from '../../types';
import { Button } from '../ui/button';

interface NotificationsScreenProps {
  notifications: Notification[];
  onBack: () => void;
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  onNavigate: (screen: string, data?: any) => void;
}

export function NotificationsScreen({
  notifications,
  onBack,
  onMarkAsRead,
  onClearAll,
  onNavigate
}: NotificationsScreenProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'new-restaurant':
        return <Package className="w-5 h-5" />;
      case 'menu-update':
        return <Bell className="w-5 h-5" />;
      case 'safety-alert':
        return <AlertTriangle className="w-5 h-5" />;
      case 'group-invite':
        return <Users className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'new-restaurant':
        return 'bg-blue-100 text-blue-600';
      case 'menu-update':
        return 'bg-green-100 text-green-600';
      case 'safety-alert':
        return 'bg-red-100 text-red-600';
      case 'group-invite':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }

    // Navigate to relevant screen if applicable
    if (notification.restaurantId) {
      onNavigate('restaurant-detail', { 
        restaurant: { id: notification.restaurantId } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-600">{unreadCount} unread</p>
              )}
            </div>
          </div>
          
          {notifications.length > 0 && (
            <Button
              onClick={onClearAll}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="pb-6">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Bell size={32} className="text-gray-400" />
            </div>
            <h2 className="text-xl mb-2 text-gray-900">No notifications</h2>
            <p className="text-gray-600">
              When you get notifications, they'll show up here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`px-4 py-4 cursor-pointer transition-colors ${
                  notification.read
                    ? 'bg-white hover:bg-gray-50'
                    : 'bg-blue-50 hover:bg-blue-100'
                }`}
              >
                <div className="flex gap-3">
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationColor(
                      notification.type
                    )}`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTimestamp(notification.timestamp)}
                    </p>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsRead(notification.id);
                    }}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
                  >
                    <X size={16} className="text-gray-500" />
                  </button>
                </div>

                {/* Group invite actions */}
                {notification.type === 'group-invite' && notification.inviteData && (
                  <div className="mt-3 flex gap-2 ml-13">
                    <Button
                      size="sm"
                      className="bg-[#2D7A46] hover:bg-[#236034] text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkAsRead(notification.id);
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkAsRead(notification.id);
                      }}
                    >
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
