import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Check, Copy, Send, Mail, MessageCircle, Share2 } from 'lucide-react';
import { Friend } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface ShareGroupDialogProps {
  open: boolean;
  onClose: () => void;
  selectedFriends: Friend[];
  onSendInvites: () => void;
}

export function ShareGroupDialog({ 
  open, 
  onClose, 
  selectedFriends,
  onSendInvites 
}: ShareGroupDialogProps) {
  const [copied, setCopied] = useState(false);
  const [sendingMethod, setSendingMethod] = useState<'app' | 'link' | null>(null);

  // Generate a shareable link with encoded data
  const generateShareLink = () => {
    const friendIds = selectedFriends.map(f => f.id).join(',');
    const baseUrl = window.location.origin;
    return `${baseUrl}?invite=group&friends=${encodeURIComponent(friendIds)}&timestamp=${Date.now()}`;
  };

  const shareLink = generateShareLink();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleSendInApp = () => {
    setSendingMethod('app');
    // Simulate sending in-app invites
    setTimeout(() => {
      onSendInvites();
      toast.success(`Invites sent to ${selectedFriends.length} ${selectedFriends.length === 1 ? 'person' : 'people'}!`);
      onClose();
    }, 1000);
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on GreenLight Eats!',
          text: `Let's find safe dining options together! I've invited you to join my dining group.`,
          url: shareLink,
        });
        toast.success('Shared successfully!');
      } catch (err) {
        // User cancelled or error occurred
        if ((err as Error).name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-[#2D7A46]" />
            Share Safe Options
          </DialogTitle>
          <DialogDescription>
            Share these safe dining options with your companions
          </DialogDescription>
        </DialogHeader>

        {/* Selected Friends Preview */}
        <div className="py-4 border-y border-border">
          <p className="text-sm text-muted-foreground mb-3">Sending to:</p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {selectedFriends.map((friend) => (
              <div key={friend.id} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50">
                <ImageWithFallback
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm">{friend.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {friend.restrictions.join(', ') || 'No restrictions'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sharing Options */}
        <div className="space-y-3">
          {/* Send via App */}
          <Button
            onClick={handleSendInApp}
            disabled={sendingMethod === 'app'}
            className="w-full justify-start gap-3 h-auto py-3 bg-[#2D7A46] hover:bg-[#236034] text-white"
          >
            <Send className="w-5 h-5" />
            <div className="flex-1 text-left">
              <div className="font-medium">Send via GreenLight Eats</div>
              <div className="text-xs opacity-90">
                {sendingMethod === 'app' ? 'Sending...' : 'Send in-app invitations to companions'}
              </div>
            </div>
          </Button>

          {/* Copy Link */}
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-3 border-2"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
            <div className="flex-1 text-left">
              <div className="font-medium">
                {copied ? 'Link Copied!' : 'Copy Share Link'}
              </div>
              <div className="text-xs text-muted-foreground">
                Share via text, email, or social media
              </div>
            </div>
          </Button>

          {/* Native Share (if supported) */}
          {navigator.share && (
            <Button
              onClick={handleShareNative}
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-3 border-2"
            >
              <Share2 className="w-5 h-5" />
              <div className="flex-1 text-left">
                <div className="font-medium">Share</div>
                <div className="text-xs text-muted-foreground">
                  Use system share options
                </div>
              </div>
            </Button>
          )}

          {/* Quick Share Options */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => {
                window.open(`sms:?body=${encodeURIComponent(`Join me on GreenLight Eats! ${shareLink}`)}`, '_blank');
              }}
              variant="outline"
              size="sm"
              className="flex-1 gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Text
            </Button>
            <Button
              onClick={() => {
                window.open(`mailto:?subject=${encodeURIComponent('Join me on GreenLight Eats!')}&body=${encodeURIComponent(`Let's find safe dining options together!\n\n${shareLink}`)}`, '_blank');
              }}
              variant="outline"
              size="sm"
              className="flex-1 gap-2"
            >
              <Mail className="w-4 h-4" />
              Email
            </Button>
          </div>
        </div>

        {/* Share Link Preview */}
        <div className="mt-4 p-3 bg-secondary rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Share Link:</p>
          <p className="text-xs break-all font-mono">{shareLink}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}