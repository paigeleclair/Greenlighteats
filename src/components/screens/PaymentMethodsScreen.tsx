import { ChevronLeft, CreditCard, Gift, Plus, Trash2, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { PaymentMethod } from '../../types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { useState } from 'react';

interface PaymentMethodsScreenProps {
  paymentMethods: PaymentMethod[];
  onBack: () => void;
  onAddPaymentMethod: () => void;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PaymentMethodsScreen({
  paymentMethods,
  onBack,
  onAddPaymentMethod,
  onSetDefault,
  onDelete
}: PaymentMethodsScreenProps) {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const getCardBrandIcon = (brand?: string) => {
    // In a real app, you'd return actual brand logos
    return brand?.toUpperCase() || 'CARD';
  };

  const formatCardType = (type: string) => {
    switch (type) {
      case 'credit-card':
        return 'Credit Card';
      case 'debit-card':
        return 'Debit Card';
      case 'gift-card':
        return 'Gift Card';
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-secondary pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border px-4 py-4 z-10">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={onBack}>
            <ChevronLeft size={24} className="text-foreground" />
          </button>
          <h2 className="text-xl text-card-foreground">Payment Methods</h2>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-4">
        {/* Add Payment Method Button */}
        <Button
          onClick={onAddPaymentMethod}
          className="w-full h-14 bg-[#2D7A46] hover:bg-[#236034] dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-xl"
        >
          <Plus size={20} className="mr-2" />
          Add Payment Method
        </Button>

        {/* Payment Methods List */}
        {paymentMethods.length > 0 ? (
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center flex-shrink-0">
                    {method.type === 'gift-card' ? (
                      <Gift size={24} className="text-white" />
                    ) : (
                      <CreditCard size={24} className="text-white" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm text-muted-foreground">
                        {formatCardType(method.type)}
                      </p>
                      {method.isDefault && (
                        <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700">
                          <Check size={12} className="mr-1" />
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="font-medium text-card-foreground mb-1">
                      {method.cardholderName}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      {method.type !== 'gift-card' && method.cardBrand && (
                        <span className="uppercase text-xs font-medium">
                          {getCardBrandIcon(method.cardBrand)}
                        </span>
                      )}
                      <span>•••• {method.last4Digits}</span>
                      {method.type !== 'gift-card' && method.expiryMonth && method.expiryYear && (
                        <span>Exp {method.expiryMonth}/{method.expiryYear}</span>
                      )}
                      {method.type === 'gift-card' && method.balance !== undefined && (
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          ${method.balance.toFixed(2)} balance
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {!method.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSetDefault(method.id)}
                        className="text-xs whitespace-nowrap"
                      >
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirmId(method.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CreditCard size={48} className="text-muted-foreground mx-auto mb-3 opacity-30" />
            <p className="text-muted-foreground mb-2">No payment methods added</p>
            <p className="text-sm text-muted-foreground">
              Add a payment method to make reservations easier
            </p>
          </div>
        )}

        {/* Info Card */}
        <div className="bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 mt-6">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <span className="font-medium">Secure Storage:</span> Payment information is stored locally on your device for demo purposes. In a production app, this would be securely encrypted and stored with a payment processor.
          </p>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmId !== null} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payment Method</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this payment method? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirmId) {
                  onDelete(deleteConfirmId);
                  setDeleteConfirmId(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
