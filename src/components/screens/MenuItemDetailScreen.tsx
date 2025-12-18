import { ChevronLeft, Star, Users, Heart, AlertTriangle, Info } from 'lucide-react';
import { SafetyBadge } from '../SafetyBadge';
import { Button } from '../ui/button';
import { MenuItem, UserPreferences, SavedMenuItem } from '../../types';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { getSafetyDetails } from '../../utils/safetyCalculator';
import { Alert, AlertDescription } from '../ui/alert';

interface MenuItemDetailScreenProps {
  item: MenuItem;
  onNavigate: (screen: string) => void;
  onBack: () => void;
  userPreferences?: UserPreferences;
  restaurantId?: string;
  restaurantName?: string;
  savedMenuItems?: SavedMenuItem[];
  onToggleSave?: (item: MenuItem, restaurantId: string, restaurantName: string) => void;
}

export function MenuItemDetailScreen({ 
  item, 
  onNavigate, 
  onBack,
  userPreferences,
  restaurantId = '',
  restaurantName = '',
  savedMenuItems = [],
  onToggleSave
}: MenuItemDetailScreenProps) {
  // Prepare data for pie chart
  const chartData = [
    { name: 'Protein', value: item.nutrition.protein, color: '#3b82f6' },
    { name: 'Carbs', value: item.nutrition.carbs, color: '#f59e0b' },
    { name: 'Fat', value: item.nutrition.fat, color: '#10b981' },
  ];

  // Get safety details if user preferences are available
  const safetyInfo = userPreferences 
    ? getSafetyDetails(item, userPreferences)
    : null;

  // Check if this item is saved
  const isSaved = savedMenuItems.some(
    saved => saved.menuItemId === item.id && saved.restaurantId === restaurantId
  );

  const handleToggleSave = () => {
    if (onToggleSave) {
      onToggleSave(item, restaurantId, restaurantName);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="relative">
        <ImageWithFallback
          src={item.image}
          alt={item.name}
          className="w-full h-80 object-cover"
        />
        <button
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
        >
          <ChevronLeft size={24} className="text-gray-900" />
        </button>
        {onToggleSave && (
          <button
            onClick={handleToggleSave}
            className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors ${
              isSaved 
                ? 'bg-red-600 text-white' 
                : 'bg-white text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      <div className="px-6 py-6 space-y-6 pb-24">
        {/* Title & Price */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-2xl flex-1">{item.name}</h1>
            <span className="text-2xl text-[#2D7A46]">${item.price}</span>
          </div>
          <p className="text-gray-600">{item.description}</p>
        </div>

        {/* Safety Badge */}
        <div>
          <SafetyBadge level={item.safetyLevel} size="lg" />
        </div>

        {/* Safety Details - Why is this unsafe/caution */}
        {safetyInfo && safetyInfo.safetyLevel !== 'safe' && (
          <Alert className={`border-l-4 ${
            safetyInfo.safetyLevel === 'caution' 
              ? 'bg-yellow-50 border-yellow-400' 
              : 'bg-red-50 border-red-400'
          }`}>
            <AlertTriangle className={`h-4 w-4 ${
              safetyInfo.safetyLevel === 'caution' ? 'text-yellow-600' : 'text-red-600'
            }`} />
            <AlertDescription className="ml-2">
              <div className="space-y-1">
                <p className={`font-medium ${
                  safetyInfo.safetyLevel === 'caution' ? 'text-yellow-800' : 'text-red-800'
                }`}>
                  Why this item is {safetyInfo.safetyLevel === 'caution' ? 'cautionary' : 'not recommended'}:
                </p>
                {safetyInfo.reasons.map((reason, index) => (
                  <p key={index} className="text-sm text-gray-700">• {reason}</p>
                ))}
                {safetyInfo.safetyLevel === 'caution' && (
                  <p className="text-sm text-yellow-700 mt-2 italic">
                    💡 Tip: Ask for no added salt or sauces on the side to reduce sodium and sugar.
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {safetyInfo && safetyInfo.safetyLevel === 'safe' && (
          <Alert className="border-l-4 bg-green-50 border-green-400">
            <Info className="h-4 w-4 text-green-600" />
            <AlertDescription className="ml-2">
              <p className="font-medium text-green-800">Great choice!</p>
              {safetyInfo.reasons.map((reason, index) => (
                <p key={index} className="text-sm text-gray-700">• {reason}</p>
              ))}
            </AlertDescription>
          </Alert>
        )}

        {/* Tags */}
        <div>
          <h3 className="text-lg mb-3">Dietary Information</h3>
          <div className="flex flex-wrap gap-2">
            {item.tags.map(tag => (
              <span key={tag} className="px-4 py-2 bg-gray-100 rounded-full text-sm">
                {tag}
              </span>
            ))}
            {item.tags.length === 0 && (
              <p className="text-sm text-gray-500">No specific dietary tags</p>
            )}
          </div>
        </div>

        {/* Nutrition */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="text-lg mb-4">Nutrition Facts</h3>
          
          <div className="flex flex-col items-center gap-6">
            {/* Pie Chart */}
            <div className="w-full max-w-[280px]">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}g`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Macros Column */}
            <div className="flex flex-col gap-3 w-full">
              <div className="bg-white rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Protein</p>
                <p className="text-xl">{item.nutrition.protein}g</p>
              </div>
              <div className="bg-white rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Carbs</p>
                <p className="text-xl">{item.nutrition.carbs}g</p>
              </div>
              <div className="bg-white rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Fat</p>
                <p className="text-xl">{item.nutrition.fat}g</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Calories</p>
              <p className="text-xl">{item.nutrition.calories}</p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Sodium</p>
              <p className="text-xl">{item.nutrition.sodium}mg</p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Sugar</p>
              <p className="text-xl">{item.nutrition.sugar}g</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}