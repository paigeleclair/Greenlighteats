import { useState } from 'react';
import { X, Users, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { mockFriends } from '../data/mockData';
import { Restaurant } from '../types';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: Restaurant;
  onShare: (selectedMemberIds: string[]) => void;
  hasPremium: boolean;
  onUpgradeToPremium?: () => void;
}

export function ShareDialog({ 
  isOpen, 
  onClose, 
  restaurant, 
  onShare,
  hasPremium,
  onUpgradeToPremium 
}: ShareDialogProps) {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const toggleMember = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const handleShare = () => {
    if (selectedMembers.length > 0) {
      onShare(selectedMembers);
      setSelectedMembers([]);
      onClose();
    }
  };

  const handleUpgrade = () => {
    if (onUpgradeToPremium) {
      onUpgradeToPremium();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Share with Group
          </DialogTitle>
          <DialogDescription>
            {!hasPremium 
              ? "Upgrade to Premium to share restaurants with your group"
              : `Share ${restaurant.name} with your dining companions`
            }
          </DialogDescription>
        </DialogHeader>

        {!hasPremium ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg mb-2">Premium Feature</h3>
            <p className="text-sm text-gray-600 mb-6">
              Upgrade to Premium to share restaurants with your dining group and collaborate on meal planning!
            </p>
            <Button
              onClick={handleUpgrade}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Upgrade to Premium
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Share <span className="font-medium">{restaurant.name}</span> with your group members
              </p>
            </div>

            {mockFriends.length === 0 ? (
              <div className="py-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600">
                  No group members yet. Add dining companions to share restaurants with them!
                </p>
              </div>
            ) : (
              <>
                {/* Member List */}
                <div className="max-h-80 overflow-y-auto space-y-2 mb-4">
                  {mockFriends.map((friend) => {
                    const isSelected = selectedMembers.includes(friend.id);
                    
                    return (
                      <button
                        key={friend.id}
                        onClick={() => toggleMember(friend.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-[#2D7A46] bg-green-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white flex-shrink-0">
                          {friend.name.charAt(0)}
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-left min-w-0">
                          <p className="font-medium text-gray-900">{friend.name}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {friend.restrictions.length > 0 
                              ? friend.restrictions.join(', ')
                              : 'No restrictions'
                            }
                          </p>
                        </div>

                        {/* Checkbox */}
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? 'bg-[#2D7A46] border-[#2D7A46]'
                              : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <Check size={16} className="text-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleShare}
                    disabled={selectedMembers.length === 0}
                    className="flex-1 bg-[#2D7A46] hover:bg-[#236034] text-white"
                  >
                    Share ({selectedMembers.length})
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}