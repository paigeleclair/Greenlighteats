import { useState } from 'react';
import { ChevronLeft, Check, Crown, Sparkles, Users, Map, Download, Moon } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

interface PremiumUpgradeScreenProps {
  onBack: () => void;
  onSelectPlan: (planType: 'monthly' | 'yearly') => void;
}

type PlanType = 'monthly' | 'yearly';

export function PremiumUpgradeScreen({ onBack, onSelectPlan }: PremiumUpgradeScreenProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('yearly');

  const features = [
    {
      icon: Users,
      title: 'Group Dining',
      description: 'Find restaurants safe for everyone in your group'
    },
    {
      icon: Download,
      title: 'Export Lists',
      description: 'Download your safe restaurant lists'
    },
    {
      icon: Moon,
      title: 'Ad-Free Experience',
      description: 'Enjoy uninterrupted browsing'
    }
  ];

  const plans = [
    {
      id: 'monthly' as PlanType,
      name: 'Monthly Plan',
      price: '$4.99',
      period: 'month',
      description: 'Billed monthly, cancel anytime',
      savings: null
    },
    {
      id: 'yearly' as PlanType,
      name: 'Annual Plan',
      price: '$39.99',
      period: 'year',
      description: 'Billed annually, cancel anytime',
      savings: 'Save $20 (33% off)',
      badge: 'Best Value'
    }
  ];

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#2D7A46] to-[#236035] px-6 pt-6 pb-12 text-white">
        <button onClick={onBack} className="mb-4">
          <ChevronLeft size={24} />
        </button>
        
        <div className="flex items-center justify-center mb-4">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Crown size={40} className="text-yellow-400" />
          </div>
        </div>
        
        <h1 className="text-3xl text-center mb-2">Upgrade to Premium</h1>
        <p className="text-center text-white/80">
          Unlock all features and enhance your dining experience
        </p>
      </div>

      <div className="px-6 -mt-8 pb-6">
        {/* Features List */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="text-[#2D7A46]" size={20} />
              Premium Features
            </CardTitle>
            <CardDescription>Everything you get with Premium</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={20} className="text-[#2D7A46] dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-1">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                    <Check size={20} className="text-[#2D7A46] dark:text-green-400 flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Plan Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Choose Your Plan</CardTitle>
            <CardDescription>Select the plan that works best for you</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedPlan} onValueChange={(value) => setSelectedPlan(value as PlanType)}>
              <div className="space-y-3">
                {plans.map((plan) => (
                  <div key={plan.id} className="relative">
                    <Label
                      htmlFor={plan.id}
                      className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedPlan === plan.id
                          ? 'border-[#2D7A46] dark:border-green-600 bg-green-50 dark:bg-green-900/20'
                          : 'border-border hover:border-[#2D7A46] dark:hover:border-green-600'
                      }`}
                    >
                      <RadioGroupItem value={plan.id} id={plan.id} className="mt-1" />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{plan.name}</span>
                          {plan.badge && (
                            <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                              {plan.badge}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-2xl font-bold text-[#2D7A46] dark:text-green-400">
                            {plan.price}
                          </span>
                          <span className="text-muted-foreground">/ {plan.period}</span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-1">{plan.description}</p>
                        
                        {plan.savings && (
                          <p className="text-sm font-medium text-green-600 dark:text-green-400">
                            {plan.savings}
                          </p>
                        )}
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Trust & Security */}
        <Card className="mb-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Check size={16} className="text-white" />
              </div>
              <div>
                <h4 className="mb-1 text-blue-900 dark:text-blue-100">Secure Payment</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Your payment information is encrypted and secure. Cancel anytime with no questions asked.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <Button
          onClick={() => onSelectPlan(selectedPlan)}
          className="w-full bg-[#2D7A46] hover:bg-[#236034] dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-xl h-14 text-lg"
        >
          <Crown size={20} className="mr-2" />
          Continue to Payment
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
