import { useState } from 'react';
import { ChevronLeft, Calendar as CalendarIcon, Clock, Users, CreditCard, Gift, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { format, addDays } from 'date-fns';
import { PaymentMethod } from '../../types';
import { toast } from 'sonner@2.0.3';

interface ReservationScreenProps {
  restaurantId: string;
  restaurantName: string;
  onBack: () => void;
  onConfirm: (reservation: {
    restaurantId: string;
    restaurantName: string;
    date: string;
    time: string;
    partySize: number;
    specialRequests?: string;
    paymentMethodId: string;
    depositAmount: number;
  }) => void;
  paymentMethods: PaymentMethod[];
  onAddPaymentMethod: () => void;
}

export function ReservationScreen({
  restaurantId,
  restaurantName,
  onBack,
  onConfirm,
  paymentMethods,
  onAddPaymentMethod
}: ReservationScreenProps) {
  const [date, setDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [time, setTime] = useState('19:00');
  const [partySize, setPartySize] = useState('2');
  const [specialRequests, setSpecialRequests] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(
    paymentMethods.find(pm => pm.isDefault)?.id || paymentMethods[0]?.id || ''
  );

  const depositAmount = 10.00; // Fixed deposit per person
  const totalDeposit = parseInt(partySize) * depositAmount;

  // Generate time slots
  const timeSlots = [];
  for (let hour = 11; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(timeString);
    }
  }

  const handleConfirm = () => {
    if (!date) {
      toast.error('Please select a date');
      return;
    }
    if (!time) {
      toast.error('Please select a time');
      return;
    }
    if (!partySize || parseInt(partySize) < 1) {
      toast.error('Please select party size');
      return;
    }
    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    onConfirm({
      restaurantId,
      restaurantName,
      date: format(date, 'yyyy-MM-dd'),
      time,
      partySize: parseInt(partySize),
      specialRequests: specialRequests.trim() || undefined,
      paymentMethodId: selectedPaymentMethod,
      depositAmount: totalDeposit
    });
  };

  const selectedPayment = paymentMethods.find(pm => pm.id === selectedPaymentMethod);

  return (
    <div className="min-h-screen bg-secondary pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border px-4 py-4 z-10">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={onBack}>
            <ChevronLeft size={24} className="text-foreground" />
          </button>
          <div className="flex-1">
            <h2 className="text-xl text-card-foreground">Make a Reservation</h2>
            <p className="text-sm text-muted-foreground">{restaurantName}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Date Selection */}
        <div className="space-y-2">
          <Label>Select Date *</Label>
          <Popover>
            <PopoverTrigger className="w-full">
              <div className="flex h-14 w-full items-center justify-start rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:bg-accent hover:text-accent-foreground">
                <CalendarIcon size={20} className="mr-3 text-muted-foreground" />
                <span className={date ? "text-card-foreground" : "text-muted-foreground"}>
                  {date ? format(date, 'EEEE, MMMM d, yyyy') : 'Select a date'}
                </span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => date < new Date() || date > addDays(new Date(), 90)}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Selection */}
        <div className="space-y-2">
          <Label htmlFor="time">Select Time *</Label>
          <Select value={time} onValueChange={setTime}>
            <SelectTrigger id="time" className="h-14">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-muted-foreground" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {slot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Party Size */}
        <div className="space-y-2">
          <Label htmlFor="partySize">Party Size *</Label>
          <Select value={partySize} onValueChange={setPartySize}>
            <SelectTrigger id="partySize" className="h-14">
              <div className="flex items-center gap-3">
                <Users size={20} className="text-muted-foreground" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Special Requests */}
        <div className="space-y-2">
          <Label htmlFor="requests">Special Requests (Optional)</Label>
          <Textarea
            id="requests"
            placeholder="Dietary restrictions, accessibility needs, celebration, etc."
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            className="min-h-24 resize-none"
          />
          <p className="text-xs text-muted-foreground flex items-start gap-1">
            <MessageSquare size={12} className="mt-0.5 flex-shrink-0" />
            <span>Let the restaurant know about any special needs or occasions</span>
          </p>
        </div>

        {/* Payment Method */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Payment Method *</Label>
            <Button
              variant="link"
              onClick={onAddPaymentMethod}
              className="text-sm h-auto p-0 text-[#2D7A46] dark:text-green-400"
            >
              + Add New
            </Button>
          </div>

          {paymentMethods.length > 0 ? (
            <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center space-x-3 p-4 border border-border rounded-xl hover:bg-accent cursor-pointer"
                  >
                    <RadioGroupItem value={method.id} id={method.id} />
                    <label htmlFor={method.id} className="flex items-center gap-3 flex-1 cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center flex-shrink-0">
                        {method.type === 'gift-card' ? (
                          <Gift size={20} className="text-white" />
                        ) : (
                          <CreditCard size={20} className="text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-card-foreground">{method.cardholderName}</p>
                        <p className="text-sm text-muted-foreground">
                          {method.type === 'gift-card' ? 'Gift Card' : 
                           method.type === 'credit-card' ? 'Credit Card' : 'Debit Card'} •••• {method.last4Digits}
                          {method.type === 'gift-card' && method.balance !== undefined && (
                            <span className="text-green-600 dark:text-green-400 ml-2">
                              ${method.balance.toFixed(2)}
                            </span>
                          )}
                        </p>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          ) : (
            <div className="text-center py-6 border border-dashed border-border rounded-xl">
              <CreditCard size={32} className="text-muted-foreground mx-auto mb-2 opacity-30" />
              <p className="text-sm text-muted-foreground mb-3">No payment methods added</p>
              <Button
                variant="outline"
                onClick={onAddPaymentMethod}
                className="text-[#2D7A46] dark:text-green-400 border-[#2D7A46] dark:border-green-400"
              >
                Add Payment Method
              </Button>
            </div>
          )}
        </div>

        {/* Deposit Summary */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <h3 className="font-medium text-card-foreground mb-3">Reservation Deposit</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Deposit per person:</span>
              <span className="text-card-foreground">${depositAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Number of guests:</span>
              <span className="text-card-foreground">{partySize}</span>
            </div>
            <div className="border-t border-blue-300 dark:border-blue-700 my-2"></div>
            <div className="flex justify-between font-medium">
              <span className="text-card-foreground">Total Deposit:</span>
              <span className="text-blue-700 dark:text-blue-300 text-lg">${totalDeposit.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            This deposit will be applied to your final bill. Full refund available if cancelled 24 hours before reservation.
          </p>
        </div>

        {/* Terms */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
          <p className="text-sm text-yellow-900 dark:text-yellow-100">
            <span className="font-medium">Cancellation Policy:</span> Free cancellation up to 24 hours before your reservation. Late cancellations or no-shows may be charged the full deposit amount.
          </p>
        </div>
      </div>

      {/* Confirm Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-4">
        <Button
          onClick={handleConfirm}
          disabled={!date || !time || !selectedPaymentMethod}
          className="w-full bg-[#2D7A46] hover:bg-[#236034] dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-xl h-12 disabled:opacity-50"
        >
          Confirm Reservation - ${totalDeposit.toFixed(2)}
        </Button>
      </div>
    </div>
  );
}
