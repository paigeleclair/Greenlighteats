import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';

interface PremiumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgrade?: () => void;
}

export function PremiumDialog({ open, onOpenChange, onUpgrade }: PremiumDialogProps) {
  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-4">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Premium Feature</DialogTitle>
          <DialogDescription className="text-center pt-2">
            Unlock advanced features and enhance your dining experience with GreenLight Eats Premium!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-gradient-to-r from-green-50 dark:from-green-950/20 to-emerald-50 dark:to-emerald-950/20 rounded-xl p-4 border-2 border-green-200 dark:border-green-800">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl text-[#2D7A46] dark:text-green-400">$4.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-sm text-muted-foreground">Billed monthly</p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 dark:from-blue-950/20 to-indigo-50 dark:to-indigo-950/20 rounded-xl p-4 border-2 border-blue-200 dark:border-blue-800 relative">
            <div className="absolute -top-3 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs">
              Best Value
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl text-blue-600 dark:text-blue-400">$39.99</span>
              <span className="text-muted-foreground">/year</span>
            </div>
            <p className="text-sm text-muted-foreground">Save $20 annually</p>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button 
            onClick={handleUpgrade}
            className="w-full bg-[#2D7A46] hover:bg-[#236034] dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-xl h-12"
          >
            Upgrade to Premium
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}