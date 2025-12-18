import { ChevronLeft, Share2 } from 'lucide-react';
import { useState } from 'react';
import { SafetyBadge } from '../SafetyBadge';
import { DietaryIcon } from '../DietaryIcon';
import { restaurantMenus } from '../../data/restaurantData';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ShareGroupDialog } from '../ShareGroupDialog';
import { Button } from '../ui/button';
import { mockFriends } from '../../data/mockData';

interface GroupResultScreenProps {
  onBack: () => void;
  selectedFriendIds?: string[];
  onSendInvites?: (friendIds: string[]) => void;
}

export function GroupResultScreen({ onBack, selectedFriendIds = [], onSendInvites }: GroupResultScreenProps) {
  const [showShareDialog, setShowShareDialog] = useState(false);
  
  const allMenuItems = Object.values(restaurantMenus).flat();
  const safeDishes = allMenuItems.filter(item => item.safetyLevel === 'safe' && item.nutrition.sodium < 600);

  const selectedFriendsData = mockFriends.filter(f => selectedFriendIds.includes(f.id));

  const handleSendInvites = () => {
    if (onSendInvites && selectedFriendIds.length > 0) {
      onSendInvites(selectedFriendIds);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border px-4 py-4 z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <button onClick={onBack}>
              <ChevronLeft size={24} className="text-foreground" />
            </button>
            <h2 className="text-xl text-card-foreground">Group Safe Options</h2>
          </div>
          {selectedFriendIds.length > 0 && (
            <Button
              onClick={() => setShowShareDialog(true)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Share2 size={18} />
              Share
            </Button>
          )}
        </div>
      </div>

      {/* Safe for everyone badge */}
      <div className="bg-[#2D7A46] dark:bg-green-700 text-white px-6 py-4">
        <h3 className="text-lg mb-1">Safe for Everyone</h3>
        <p className="text-sm opacity-90">These dishes meet all dietary requirements for your group</p>
      </div>

      {/* Results */}
      <div className="px-6 py-4 space-y-4">
        {safeDishes.map(item => (
          <div
            key={item.id}
            className="bg-card rounded-2xl p-4 border-2 border-[#2D7A46] dark:border-green-600 shadow-sm"
          >
            <div className="flex gap-4">
              <ImageWithFallback
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-lg text-card-foreground">{item.name}</h3>
                  <span className="text-card-foreground">${item.price}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <SafetyBadge level="safe" />
                  {item.tags.map(tag => (
                    <DietaryIcon key={tag} tag={tag} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {safeDishes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No dishes found that are safe for everyone in your group</p>
          </div>
        )}
      </div>

      {/* Share Dialog */}
      <ShareGroupDialog
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        selectedFriends={selectedFriendsData}
        onSendInvites={handleSendInvites}
      />
    </div>
  );
}