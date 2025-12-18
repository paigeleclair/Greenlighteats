import { useState } from 'react';
import { ChevronLeft, CreditCard, Gift } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { PaymentMethodType } from '../../types';
import { toast } from 'sonner@2.0.3';

interface AddPaymentMethodScreenProps {
  onBack: () => void;
  onSave: (paymentMethod: {
    type: PaymentMethodType;
    cardholderName: string;
    last4Digits: string;
    expiryMonth?: string;
    expiryYear?: string;
    cardBrand?: 'visa' | 'mastercard' | 'amex' | 'discover';
    balance?: number;
    isDefault: boolean;
  }) => void;
}

export function AddPaymentMethodScreen({ onBack, onSave }: AddPaymentMethodScreenProps) {
  const [paymentType, setPaymentType] = useState<PaymentMethodType>('credit-card');
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardBrand, setCardBrand] = useState<'visa' | 'mastercard' | 'amex' | 'discover'>('visa');
  const [giftCardNumber, setGiftCardNumber] = useState('');
  const [giftCardPin, setGiftCardPin] = useState('');
  const [giftCardBalance, setGiftCardBalance] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setCardNumber(value);
      
      // Auto-detect card brand
      if (value.startsWith('4')) {
        setCardBrand('visa');
      } else if (value.startsWith('5')) {
        setCardBrand('mastercard');
      } else if (value.startsWith('3')) {
        setCardBrand('amex');
      } else if (value.startsWith('6')) {
        setCardBrand('discover');
      }
    }
  };

  const handleSave = () => {
    if (!cardholderName.trim()) {
      toast.error('Please enter the cardholder name');
      return;
    }

    if (paymentType === 'gift-card') {
      if (!giftCardNumber || giftCardNumber.length < 12) {
        toast.error('Please enter a valid gift card number');
        return;
      }
      if (!giftCardPin || giftCardPin.length < 4) {
        toast.error('Please enter a valid gift card PIN');
        return;
      }
      if (!giftCardBalance || parseFloat(giftCardBalance) <= 0) {
        toast.error('Please enter a valid balance');
        return;
      }

      onSave({
        type: 'gift-card',
        cardholderName: cardholderName.trim(),
        last4Digits: giftCardNumber.slice(-4),
        balance: parseFloat(giftCardBalance),
        isDefault
      });
    } else {
      if (!cardNumber || cardNumber.length < 13) {
        toast.error('Please enter a valid card number');
        return;
      }
      if (!expiryMonth || !expiryYear) {
        toast.error('Please enter the expiry date');
        return;
      }
      if (!cvv || cvv.length < 3) {
        toast.error('Please enter a valid CVV');
        return;
      }

      onSave({
        type: paymentType,
        cardholderName: cardholderName.trim(),
        last4Digits: cardNumber.slice(-4),
        expiryMonth,
        expiryYear,
        cardBrand,
        isDefault
      });
    }

    toast.success('Payment method added successfully!');
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear + i);

  return (
    <div className="min-h-screen bg-secondary pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border px-4 py-4 z-10">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={onBack}>
            <ChevronLeft size={24} className="text-foreground" />
          </button>
          <h2 className="text-xl text-card-foreground">Add Payment Method</h2>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Payment Type Selection */}
        <div className="space-y-3">
          <Label>Payment Type</Label>
          <RadioGroup value={paymentType} onValueChange={(value) => setPaymentType(value as PaymentMethodType)}>
            <div className="flex items-center space-x-2 p-4 border border-border rounded-xl hover:bg-accent cursor-pointer">
              <RadioGroupItem value="credit-card" id="credit" />
              <label htmlFor="credit" className="flex items-center gap-2 flex-1 cursor-pointer">
                <CreditCard size={20} className="text-blue-600 dark:text-blue-400" />
                <span className="text-card-foreground">Credit Card</span>
              </label>
            </div>
            <div className="flex items-center space-x-2 p-4 border border-border rounded-xl hover:bg-accent cursor-pointer">
              <RadioGroupItem value="debit-card" id="debit" />
              <label htmlFor="debit" className="flex items-center gap-2 flex-1 cursor-pointer">
                <CreditCard size={20} className="text-green-600 dark:text-green-400" />
                <span className="text-card-foreground">Debit Card</span>
              </label>
            </div>
            <div className="flex items-center space-x-2 p-4 border border-border rounded-xl hover:bg-accent cursor-pointer">
              <RadioGroupItem value="gift-card" id="gift" />
              <label htmlFor="gift" className="flex items-center gap-2 flex-1 cursor-pointer">
                <Gift size={20} className="text-purple-600 dark:text-purple-400" />
                <span className="text-card-foreground">Gift Card</span>
              </label>
            </div>
          </RadioGroup>
        </div>

        {/* Cardholder Name */}
        <div className="space-y-2">
          <Label htmlFor="cardholderName">
            {paymentType === 'gift-card' ? 'Your Name' : 'Cardholder Name'} *
          </Label>
          <Input
            id="cardholderName"
            type="text"
            placeholder="John Doe"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            className="h-12"
          />
        </div>

        {/* Gift Card Fields */}
        {paymentType === 'gift-card' ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="giftCardNumber">Gift Card Number *</Label>
              <Input
                id="giftCardNumber"
                type="text"
                placeholder="1234567890123456"
                value={giftCardNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s/g, '');
                  if (/^\d*$/.test(value) && value.length <= 16) {
                    setGiftCardNumber(value);
                  }
                }}
                className="h-12"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="giftCardPin">PIN *</Label>
                <Input
                  id="giftCardPin"
                  type="password"
                  placeholder="1234"
                  value={giftCardPin}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) && value.length <= 8) {
                      setGiftCardPin(value);
                    }
                  }}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="balance">Balance *</Label>
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={giftCardBalance}
                  onChange={(e) => setGiftCardBalance(e.target.value)}
                  className="h-12"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Credit/Debit Card Fields */}
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number *</Label>
              <Input
                id="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={formatCardNumber(cardNumber)}
                onChange={handleCardNumberChange}
                className="h-12"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryMonth">Exp Month *</Label>
                <Select value={expiryMonth} onValueChange={setExpiryMonth}>
                  <SelectTrigger id="expiryMonth" className="h-12">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = (i + 1).toString().padStart(2, '0');
                      return (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryYear">Exp Year *</Label>
                <Select value={expiryYear} onValueChange={setExpiryYear}>
                  <SelectTrigger id="expiryYear" className="h-12">
                    <SelectValue placeholder="YYYY" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvv">CVV *</Label>
                <Input
                  id="cvv"
                  type="password"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) && value.length <= 4) {
                      setCvv(value);
                    }
                  }}
                  className="h-12"
                />
              </div>
            </div>
          </>
        )}

        {/* Set as Default */}
        <div className="flex items-center justify-between p-4 border border-border rounded-xl">
          <div className="flex-1">
            <Label htmlFor="default" className="cursor-pointer">Set as default payment method</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Use this for quick checkouts and reservations
            </p>
          </div>
          <Switch
            id="default"
            checked={isDefault}
            onCheckedChange={setIsDefault}
          />
        </div>

        {/* Security Note */}
        <div className="bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <span className="font-medium">🔒 Secure:</span> Your payment information is encrypted and stored securely. We never share your payment details.
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-4">
        <Button
          onClick={handleSave}
          className="w-full bg-[#2D7A46] hover:bg-[#236034] dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-xl h-12"
        >
          Add Payment Method
        </Button>
      </div>
    </div>
  );
}
