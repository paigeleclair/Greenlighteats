import { useState } from 'react';
import { ChevronLeft, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { mockFriends } from '../../data/mockData';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface GroupDiningScreenProps {
  onApply: (selectedFriends: string[]) => void;
  onBack: () => void;
  onDone?: (selectedFriends: string[], friendNames: string[]) => void;
  restaurantContext?: {
    restaurantId: string;
    restaurantName: string;
  };
}

export function GroupDiningScreen({ onApply, onBack, onDone, restaurantContext }: GroupDiningScreenProps) {
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  // Debug: log the restaurantContext
  console.log('GroupDiningScreen restaurantContext:', restaurantContext);
  console.log('GroupDiningScreen onDone:', onDone);

  const toggleFriend = (friendId: string) => {
    setSelectedFriends(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const selectedFriendsData = mockFriends.filter(f => selectedFriends.includes(f.id));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border px-4 py-4">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={onBack}>
            <ChevronLeft size={24} className="text-foreground" />
          </button>
          <h2 className="text-xl text-card-foreground">Who's Eating?</h2>
        </div>
        <p className="text-sm text-muted-foreground pl-9">Select dining companions to find safe options for everyone</p>
      </div>

      {/* Friends List */}
      <div className="px-6 py-4 space-y-3">
        {mockFriends.map(friend => (
          <button
            key={friend.id}
            onClick={() => toggleFriend(friend.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
              selectedFriends.includes(friend.id)
                ? 'bg-green-50 dark:bg-green-900/20 border-[#2D7A46] dark:border-green-600'
                : 'bg-card border-border hover:border-[#2D7A46] dark:hover:border-green-600'
            }`}
          >
            <div className="relative flex-shrink-0">
              <ImageWithFallback
                src={friend.avatar}
                alt={friend.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              {selectedFriends.includes(friend.id) && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#2D7A46] dark:bg-green-700 rounded-full flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1 text-left">
              <h3 className="mb-1 text-card-foreground">{friend.name}</h3>
              <div className="flex flex-wrap gap-1">
                {friend.restrictions.map(restriction => (
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
        ))}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-4 space-y-2">
        {restaurantContext && onDone ? (
          <Button 
            onClick={() => {
              const friendNames = selectedFriendsData.map(f => f.name);
              onDone(selectedFriends, friendNames);
            }}
            disabled={selectedFriends.length === 0}
            className="w-full bg-[#2D7A46] hover:bg-[#236034] dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-xl h-12 disabled:opacity-50"
          >
            Done ({selectedFriends.length} selected)
          </Button>
        ) : (
          <Button 
            onClick={() => onApply(selectedFriends)}
            disabled={selectedFriends.length === 0}
            className="w-full bg-[#2D7A46] hover:bg-[#236034] dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-xl h-12 disabled:opacity-50"
          >
            Find Restaurants ({selectedFriends.length} selected)
          </Button>
        )}
      </div>
    </div>
  );
}