import { useState } from 'react';
import { ArrowLeft, UserPlus, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface AddCompanionScreenProps {
  onBack: () => void;
  onSave: (name: string, restrictions: string[]) => void;
}

const allergenOptions = [
  'Gluten',
  'Peanuts',
  'Dairy',
  'Shellfish',
  'Soy',
  'Eggs',
  'Tree Nuts',
  'Wheat',
  'Fish'
];

const dietaryOptions = [
  'Low Sodium',
  'Diabetic-Friendly',
  'Vegetarian',
  'Vegan',
  'Keto',
  'Low-Carb'
];

const religiousOptions = [
  'Halal',
  'Kosher'
];

export function AddCompanionScreen({ onBack, onSave }: AddCompanionScreenProps) {
  const [name, setName] = useState('');
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);
  const [customRestriction, setCustomRestriction] = useState('');

  const toggleRestriction = (restriction: string) => {
    if (selectedRestrictions.includes(restriction)) {
      setSelectedRestrictions(selectedRestrictions.filter(r => r !== restriction));
    } else {
      setSelectedRestrictions([...selectedRestrictions, restriction]);
    }
  };

  const addCustomRestriction = () => {
    if (customRestriction.trim() && !selectedRestrictions.includes(customRestriction.trim())) {
      setSelectedRestrictions([...selectedRestrictions, customRestriction.trim()]);
      setCustomRestriction('');
    }
  };

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), selectedRestrictions);
    }
  };

  const isValid = name.trim().length > 0;

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#2D7A46] to-[#236035] px-6 pt-6 pb-8 text-white">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Back</span>
        </button>
        <h1 className="text-2xl mb-2">Add Companion</h1>
        <p className="text-sm text-white/80">
          Add a dining companion with their dietary restrictions
        </p>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Name Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Companion Name</CardTitle>
            <CardDescription className="text-sm">
              Enter the name of your dining companion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Enter name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Allergens */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Allergens</CardTitle>
            <CardDescription className="text-sm">
              Select any allergens to avoid
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {allergenOptions.map((allergen) => {
                const isSelected = selectedRestrictions.includes(allergen);
                return (
                  <button
                    key={allergen}
                    onClick={() => toggleRestriction(allergen)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm ${
                      isSelected
                        ? 'bg-green-50 dark:bg-green-900/20 border-[#2D7A46] dark:border-green-600'
                        : 'bg-card border-border hover:border-[#2D7A46] dark:hover:border-green-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{allergen}</span>
                      {isSelected && (
                        <Check size={16} className="text-[#2D7A46] dark:text-green-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Dietary Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dietary Preferences</CardTitle>
            <CardDescription className="text-sm">
              Select dietary preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {dietaryOptions.map((dietary) => {
                const isSelected = selectedRestrictions.includes(dietary);
                return (
                  <button
                    key={dietary}
                    onClick={() => toggleRestriction(dietary)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm ${
                      isSelected
                        ? 'bg-green-50 dark:bg-green-900/20 border-[#2D7A46] dark:border-green-600'
                        : 'bg-card border-border hover:border-[#2D7A46] dark:hover:border-green-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{dietary}</span>
                      {isSelected && (
                        <Check size={16} className="text-[#2D7A46] dark:text-green-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Religious Restrictions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Religious Restrictions</CardTitle>
            <CardDescription className="text-sm">
              Select religious dietary requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {religiousOptions.map((religious) => {
                const isSelected = selectedRestrictions.includes(religious);
                return (
                  <button
                    key={religious}
                    onClick={() => toggleRestriction(religious)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm ${
                      isSelected
                        ? 'bg-green-50 dark:bg-green-900/20 border-[#2D7A46] dark:border-green-600'
                        : 'bg-card border-border hover:border-[#2D7A46] dark:hover:border-green-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{religious}</span>
                      {isSelected && (
                        <Check size={16} className="text-[#2D7A46] dark:text-green-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Custom Restrictions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Custom Restrictions</CardTitle>
            <CardDescription className="text-sm">
              Add any other dietary restrictions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter custom restriction..."
                value={customRestriction}
                onChange={(e) => setCustomRestriction(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomRestriction();
                  }
                }}
                className="flex-1"
              />
              <Button
                onClick={addCustomRestriction}
                disabled={!customRestriction.trim()}
                variant="outline"
                className="border-[#2D7A46] text-[#2D7A46] hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                Add
              </Button>
            </div>
            {selectedRestrictions.filter(r => 
              !allergenOptions.includes(r) && 
              !dietaryOptions.includes(r) && 
              !religiousOptions.includes(r)
            ).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedRestrictions.filter(r => 
                  !allergenOptions.includes(r) && 
                  !dietaryOptions.includes(r) && 
                  !religiousOptions.includes(r)
                ).map((restriction) => (
                  <div
                    key={restriction}
                    className="px-3 py-1 bg-green-50 dark:bg-green-900/20 border border-[#2D7A46] dark:border-green-600 rounded-full text-sm flex items-center gap-2"
                  >
                    <span>{restriction}</span>
                    <button
                      onClick={() => toggleRestriction(restriction)}
                      className="hover:text-destructive"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={!isValid}
          className="w-full bg-[#2D7A46] hover:bg-[#236034] disabled:opacity-50"
        >
          <UserPlus size={16} className="mr-2" />
          Save Companion
        </Button>
      </div>
    </div>
  );
}
