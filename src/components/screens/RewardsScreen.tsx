import { ChevronLeft, Gift, Star, Crown, Calendar, TrendingUp, Award, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { RewardsData } from '../../types';

interface RewardsScreenProps {
  onBack: () => void;
  rewardsData?: RewardsData;
}

export function RewardsScreen({ onBack, rewardsData }: RewardsScreenProps) {
  // Default rewards data if none provided
  const defaultRewards: RewardsData = {
    totalPoints: 350,
    tier: 'Silver',
    pointsToNextTier: 150,
    rewards: [
      {
        id: '1',
        title: '$5 Off Next Order',
        description: 'Valid at participating restaurants',
        pointsCost: 100,
        category: 'discount',
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000
      },
      {
        id: '2',
        title: 'Free Appetizer',
        description: 'Redeem at select locations',
        pointsCost: 200,
        category: 'food',
        expiresAt: Date.now() + 45 * 24 * 60 * 60 * 1000
      },
      {
        id: '3',
        title: '$10 Restaurant Credit',
        description: 'Use at any partnered restaurant',
        pointsCost: 300,
        category: 'discount',
        expiresAt: Date.now() + 60 * 24 * 60 * 60 * 1000
      }
    ],
    deals: [
      {
        id: 'd1',
        title: '$5 Off Next Order',
        code: 'SAVE5-ABCD',
        redeemedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
        expiresAt: Date.now() + 25 * 24 * 60 * 60 * 1000,
        used: false
      },
      {
        id: 'd2',
        title: 'Free Dessert',
        code: 'DESSERT-XYZ',
        redeemedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
        expiresAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
        used: true
      }
    ],
    transactions: [
      {
        id: 't1',
        description: 'Visit to Carrabba\'s',
        points: 50,
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
        type: 'earned'
      },
      {
        id: 't2',
        description: 'Redeemed $5 Off Reward',
        points: -100,
        timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
        type: 'spent'
      },
      {
        id: 't3',
        description: 'Visit to Olive Garden',
        points: 75,
        timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000,
        type: 'earned'
      }
    ]
  };

  const rewards = rewardsData || defaultRewards;
  const tierProgress = (rewards.totalPoints / (rewards.totalPoints + rewards.pointsToNextTier)) * 100;

  // Determine next tier
  const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum'];
  const currentTierIndex = tiers.indexOf(rewards.tier);
  const nextTier = currentTierIndex < tiers.length - 1 ? tiers[currentTierIndex + 1] : 'Max Level';

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return `${Math.floor(days / 7)}w ago`;
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'bronze':
        return 'text-orange-700 dark:text-orange-400';
      case 'silver':
        return 'text-gray-600 dark:text-gray-400';
      case 'gold':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'platinum':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-secondary pb-6">
      {/* Header */}
      <div className="bg-card px-6 pt-6 pb-4 border-b border-border">
        <button onClick={onBack} className="mb-4">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl">Rewards</h1>
        <p className="text-sm text-muted-foreground">Earn points and redeem exclusive rewards</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Points & Tier Card */}
        <Card className="bg-gradient-to-br from-[#2D7A46] to-[#236035] text-white border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-white/80 mb-1">Your Points</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{rewards.totalPoints}</span>
                  <Star size={24} className="text-yellow-400 fill-yellow-400" />
                </div>
              </div>
              <div className="text-right">
                <Badge className={`${getTierColor(rewards.tier)} bg-white/20 hover:bg-white/30 text-white border-0 mb-2`}>
                  <Award size={14} className="mr-1" />
                  {rewards.tier} Tier
                </Badge>
              </div>
            </div>

            <Separator className="bg-white/20 mb-4" />

            <div>
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="text-white/80">Progress to {nextTier}</span>
                <span className="font-medium">{rewards.pointsToNextTier} points needed</span>
              </div>
              <Progress value={tierProgress} className="h-2 bg-white/20" />
            </div>
          </CardContent>
        </Card>

        {/* Available Rewards */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Gift size={20} className="text-[#2D7A46] dark:text-green-400" />
            <h2 className="text-xl">Available Rewards</h2>
          </div>

          <div className="space-y-3">
            {rewards.rewards.map((reward) => (
              <Card key={reward.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{reward.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{reward.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar size={12} />
                        <span>Expires {formatDate(reward.expiresAt)}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-2 flex-shrink-0">
                      {reward.pointsCost} pts
                    </Badge>
                  </div>

                  <Button
                    disabled={rewards.totalPoints < reward.pointsCost}
                    className="w-full bg-[#2D7A46] hover:bg-[#236034] dark:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50"
                  >
                    <Gift size={16} className="mr-2" />
                    {rewards.totalPoints >= reward.pointsCost ? 'Redeem' : 'Not Enough Points'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Redeemed Rewards */}
        {rewards.deals.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={20} className="text-[#2D7A46] dark:text-green-400" />
              <h2 className="text-xl">My Rewards</h2>
            </div>

            <div className="space-y-3">
              {rewards.deals.map((reward) => {
                const isExpired = reward.expiresAt < Date.now();
                return (
                  <Card 
                    key={reward.id} 
                    className={reward.used || isExpired ? 'opacity-60' : ''}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{reward.title}</h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-medium text-foreground">
                                {reward.code}
                              </span>
                              <Badge 
                                variant={reward.used ? 'secondary' : isExpired ? 'destructive' : 'default'}
                                className="text-xs"
                              >
                                {reward.used ? 'Used' : isExpired ? 'Expired' : 'Active'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar size={12} />
                              <span>
                                {isExpired 
                                  ? `Expired ${formatDate(reward.expiresAt)}`
                                  : `Expires ${formatDate(reward.expiresAt)}`
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {!reward.used && !isExpired && (
                        <Button variant="outline" className="w-full">
                          Use This Reward
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Points History */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-[#2D7A46] dark:text-green-400" />
            <h2 className="text-xl">Points History</h2>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {rewards.transactions.map((history) => (
                  <div key={history.id}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium mb-1">{history.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatTimeAgo(history.timestamp)}
                        </p>
                      </div>
                      <div className={`font-semibold ${
                        history.points > 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {history.points > 0 ? '+' : ''}{history.points}
                      </div>
                    </div>
                    {history.id !== rewards.transactions[rewards.transactions.length - 1].id && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How to Earn Points */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <Crown size={20} />
              How to Earn Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-medium">Visit restaurants: <span className="text-blue-900 dark:text-blue-100">50-100 points</span></p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-medium">Leave reviews: <span className="text-blue-900 dark:text-blue-100">25 points</span></p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-medium">Refer friends: <span className="text-blue-900 dark:text-blue-100">200 points</span></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}