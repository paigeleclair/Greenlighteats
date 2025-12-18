import { useState } from 'react';
import { ChevronLeft, CreditCard, Lock, Check, Crown } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';

interface PremiumPaymentScreenProps {
  onBack: () => void;
  onComplete: () => void;
  planType: 'monthly' | 'yearly';
}

export function PremiumPaymentScreen({ onBack, onComplete, planType }: PremiumPaymentScreenProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const planDetails = planType === 'monthly'
    ? { price: '$4.99', period: 'month', total: '$4.99' }
    : { price: '$39.99', period: 'year', total: '$39.99', savings: 'Save $20' };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '');
    setCvv(cleaned.substring(0, 4));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onComplete();
    }, 2000);
  };

  const isFormValid = 
    cardNumber.replace(/\s/g, '').length >= 15 &&
    expiryDate.length === 5 &&
    cvv.length >= 3 &&
    cardholderName.trim().length > 0;

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <button onClick={onBack} className="mb-2">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl">Payment Details</h1>
        <p className="text-sm text-muted-foreground">Complete your premium subscription</p>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-6">
        {/* Plan Summary */}
        <Card className="mb-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#2D7A46] dark:bg-green-700 rounded-full flex items-center justify-center">
                  <Crown size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Premium {planType === 'monthly' ? 'Monthly' : 'Annual'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {planDetails.price}/{planDetails.period}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#2D7A46] dark:text-green-400">
                  {planDetails.total}
                </p>
                {planDetails.savings && (
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {planDetails.savings}
                  </p>
                )}
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <Check size={16} />
                <span>Group Dining Features</span>
              </div>
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <Check size={16} />
                <span>Export & Offline Mode</span>
              </div>
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <Check size={16} />
                <span>Ad-Free Experience</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard size={20} />
              Card Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Card Number */}
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={handleCardNumberChange}
                className="h-12"
                required
              />
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="text"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={handleExpiryDateChange}
                  className="h-12"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="text"
                  placeholder="123"
                  value={cvv}
                  onChange={handleCvvChange}
                  className="h-12"
                  required
                />
              </div>
            </div>

            {/* Cardholder Name */}
            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                type="text"
                placeholder="John Doe"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                className="h-12"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="mb-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Lock size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-1 text-blue-900 dark:text-blue-100">
                  Secure Payment
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Your payment information is encrypted and secure. We never store your full card details.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!isFormValid || isProcessing}
          className="w-full bg-[#2D7A46] hover:bg-[#236034] dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-xl h-14 text-lg disabled:opacity-50"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            <>
              <Lock size={20} className="mr-2" />
              Complete Payment
            </>
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          You can cancel your subscription at any time from your profile settings
        </p>
      </form>
    </div>
  );
}
