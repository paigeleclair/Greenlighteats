import { useState } from 'react';
import { ChevronLeft, Plus, X } from 'lucide-react';
import { Slider } from '../ui/slider';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Allergen, DietaryRestriction, ReligiousRestriction, UserPreferences, DEFAULT_MAX_SODIUM } from '../../types';

interface PersonalizationMenuScreenProps {
  initialPreferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
  onBack: () => void;
}

export function PersonalizationMenuScreen({ initialPreferences, onSave, onBack }: PersonalizationMenuScreenProps) {
  const [allergens, setAllergens] = useState<Allergen[]>(initialPreferences.allergens);
  const [dietary, setDietary] = useState<DietaryRestriction[]>(initialPreferences.dietary);
  const [religious, setReligious] = useState<ReligiousRestriction[]>(initialPreferences.religious);
  const [customAllergens, setCustomAllergens] = useState<string[]>(initialPreferences.customAllergens || []);
  const [customDietary, setCustomDietary] = useState<string[]>(initialPreferences.customDietary || []);
  const [customReligious, setCustomReligious] = useState<string[]>(initialPreferences.customReligious || []);
  const [maxSodium, setMaxSodium] = useState<number | undefined>(initialPreferences.maxSodium);
  const [useCustomSodium, setUseCustomSodium] = useState(initialPreferences.maxSodium !== undefined);
  
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState<'allergens' | 'dietary' | 'religious' | null>(null);

  const allergenOptions: { value: Allergen; label: string; icon: string }[] = [
    { value: 'gluten', label: 'Gluten', icon: '🌾' },
    { value: 'peanuts', label: 'Peanuts', icon: '🥜' },
    { value: 'dairy', label: 'Dairy', icon: '🥛' },
    { value: 'shellfish', label: 'Shellfish', icon: '🦐' },
    { value: 'soy', label: 'Soy', icon: '🫘' },
    { value: 'eggs', label: 'Eggs', icon: '🥚' },
    { value: 'tree-nuts', label: 'Tree Nuts', icon: '🌰' },
    { value: 'wheat', label: 'Wheat', icon: '🌾' },
    { value: 'fish', label: 'Fish', icon: '🐟' }
  ];

  const dietaryOptions: { value: DietaryRestriction; label: string }[] = [
    { value: 'low-sodium', label: 'Low Sodium' },
    { value: 'diabetic', label: 'Diabetic-Friendly' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'keto', label: 'Keto' },
    { value: 'low-carb', label: 'Low Carb' }
  ];

  const religiousOptions: { value: ReligiousRestriction; label: string }[] = [
    { value: 'halal', label: 'Halal' },
    { value: 'kosher', label: 'Kosher' },
    { value: 'none', label: 'None of the above' }
  ];

  const savePreferences = (newPrefs: Partial<UserPreferences>) => {
    onSave({
      allergens,
      dietary,
      religious,
      customAllergens,
      customDietary,
      customReligious,
      maxSodium: useCustomSodium ? maxSodium : undefined,
      ...newPrefs
    });
  };

  const toggleAllergen = (allergen: Allergen) => {
    const newAllergens = allergens.includes(allergen)
      ? allergens.filter(a => a !== allergen)
      : [...allergens, allergen];
    setAllergens(newAllergens);
    savePreferences({ allergens: newAllergens });
  };

  const toggleDietary = (restriction: DietaryRestriction) => {
    const newDietary = dietary.includes(restriction)
      ? dietary.filter(d => d !== restriction)
      : [...dietary, restriction];
    setDietary(newDietary);
    savePreferences({ dietary: newDietary });
  };

  const toggleReligious = (restriction: ReligiousRestriction) => {
    let newReligious: ReligiousRestriction[];
    
    // If clicking "none"
    if (restriction === 'none') {
      // If "none" is already selected, deselect it
      if (religious.includes('none')) {
        newReligious = religious.filter(r => r !== 'none');
      } else {
        // Otherwise, select only "none" (clear others)
        newReligious = ['none'];
      }
    } else {
      // If clicking halal or kosher
      // Remove "none" if it was selected, then toggle the restriction
      const withoutNone = religious.filter(r => r !== 'none');
      if (withoutNone.includes(restriction)) {
        newReligious = withoutNone.filter(r => r !== restriction);
      } else {
        newReligious = [...withoutNone, restriction];
      }
    }
    
    setReligious(newReligious);
    savePreferences({ religious: newReligious });
  };

  const handleCustomSodiumToggle = () => {
    const newUseCustom = !useCustomSodium;
    setUseCustomSodium(newUseCustom);
    savePreferences({ maxSodium: newUseCustom ? (maxSodium || DEFAULT_MAX_SODIUM) : undefined });
  };

  const handleSodiumChange = (value: number) => {
    setMaxSodium(value);
    savePreferences({ maxSodium: value });
  };

  const addCustomItem = (type: 'allergens' | 'dietary' | 'religious') => {
    const trimmed = customInput.trim();
    if (!trimmed) return;

    if (type === 'allergens') {
      if (!customAllergens.includes(trimmed)) {
        const newCustomAllergens = [...customAllergens, trimmed];
        setCustomAllergens(newCustomAllergens);
        savePreferences({ customAllergens: newCustomAllergens });
      }
    } else if (type === 'dietary') {
      if (!customDietary.includes(trimmed)) {
        const newCustomDietary = [...customDietary, trimmed];
        setCustomDietary(newCustomDietary);
        savePreferences({ customDietary: newCustomDietary });
      }
    } else if (type === 'religious') {
      if (!customReligious.includes(trimmed)) {
        const newCustomReligious = [...customReligious, trimmed];
        setCustomReligious(newCustomReligious);
        savePreferences({ customReligious: newCustomReligious });
      }
    }

    setCustomInput('');
    setShowCustomInput(null);
  };

  const removeCustomItem = (type: 'allergens' | 'dietary' | 'religious', item: string) => {
    if (type === 'allergens') {
      const newCustomAllergens = customAllergens.filter(a => a !== item);
      setCustomAllergens(newCustomAllergens);
      savePreferences({ customAllergens: newCustomAllergens });
    } else if (type === 'dietary') {
      const newCustomDietary = customDietary.filter(d => d !== item);
      setCustomDietary(newCustomDietary);
      savePreferences({ customDietary: newCustomDietary });
    } else if (type === 'religious') {
      const newCustomReligious = customReligious.filter(r => r !== item);
      setCustomReligious(newCustomReligious);
      savePreferences({ customReligious: newCustomReligious });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={onBack}>
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <h2 className="text-xl">Personalization</h2>
        </div>
        <p className="text-sm text-gray-600 pl-9">Manage your dietary restrictions</p>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-8">
        {/* Allergens Section */}
        <div className="space-y-4">
          <h3 className="text-lg">Allergens</h3>
          <div className="flex flex-wrap gap-3">
            {allergenOptions.map(option => (
              <button
                key={option.value}
                onClick={() => toggleAllergen(option.value)}
                className={`flex items-center gap-2 px-4 py-3 rounded-full border-2 transition-all ${
                  allergens.includes(option.value)
                    ? 'bg-[#2D7A46] border-[#2D7A46] text-white'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-[#2D7A46]'
                }`}
              >
                <span className="text-lg">{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}

            {/* Custom allergens */}
            {customAllergens.map(item => (
              <button
                key={item}
                className="flex items-center gap-2 px-4 py-3 rounded-full border-2 bg-[#2D7A46] border-[#2D7A46] text-white"
              >
                <span>{item}</span>
                <X 
                  size={16} 
                  className="cursor-pointer hover:opacity-70"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCustomItem('allergens', item);
                  }}
                />
              </button>
            ))}

            {/* Add custom button */}
            {showCustomInput !== 'allergens' ? (
              <button
                onClick={() => setShowCustomInput('allergens')}
                className="flex items-center gap-2 px-4 py-3 rounded-full border-2 border-dashed border-[#2D7A46] text-[#2D7A46] hover:bg-green-50"
              >
                <Plus size={18} />
                <span>Add Other</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <Input
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addCustomItem('allergens');
                    } else if (e.key === 'Escape') {
                      setShowCustomInput(null);
                      setCustomInput('');
                    }
                  }}
                  placeholder="Enter allergen..."
                  className="flex-1"
                  autoFocus
                />
                <Button
                  size="sm"
                  onClick={() => addCustomItem('allergens')}
                  className="bg-[#2D7A46] hover:bg-[#236034]"
                >
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowCustomInput(null);
                    setCustomInput('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Dietary Section */}
        <div className="space-y-4">
          <h3 className="text-lg">Dietary Restrictions</h3>
          <div className="space-y-3">
            {dietaryOptions.map(option => (
              <button
                key={option.value}
                onClick={() => toggleDietary(option.value)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all ${
                  dietary.includes(option.value)
                    ? 'bg-green-50 border-[#2D7A46]'
                    : 'bg-white border-gray-200 hover:border-[#2D7A46]'
                }`}
              >
                <span className="text-gray-900">{option.label}</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  dietary.includes(option.value)
                    ? 'bg-[#2D7A46] border-[#2D7A46]'
                    : 'border-gray-300'
                }`}>
                  {dietary.includes(option.value) && (
                    <div className="w-3 h-3 rounded-full bg-white" />
                  )}
                </div>
              </button>
            ))}

            {/* Custom dietary restrictions */}
            {customDietary.map(item => (
              <button
                key={item}
                className="w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 bg-green-50 border-[#2D7A46]"
              >
                <span className="text-gray-900">{item}</span>
                <X 
                  size={18} 
                  className="cursor-pointer hover:opacity-70 text-[#2D7A46]"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCustomItem('dietary', item);
                  }}
                />
              </button>
            ))}

            {/* Add custom button */}
            {showCustomInput !== 'dietary' ? (
              <button
                onClick={() => setShowCustomInput('dietary')}
                className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-xl border-2 border-dashed border-[#2D7A46] text-[#2D7A46] hover:bg-green-50"
              >
                <Plus size={18} />
                <span>Add Other</span>
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Input
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addCustomItem('dietary');
                    } else if (e.key === 'Escape') {
                      setShowCustomInput(null);
                      setCustomInput('');
                    }
                  }}
                  placeholder="Enter dietary restriction..."
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => addCustomItem('dietary')}
                    className="flex-1 bg-[#2D7A46] hover:bg-[#236034]"
                  >
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowCustomInput(null);
                      setCustomInput('');
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Religious Section */}
        <div className="space-y-4">
          <h3 className="text-lg">Religious Restrictions</h3>
          <div className="space-y-3">
            {religiousOptions.map(option => (
              <button
                key={option.value}
                onClick={() => toggleReligious(option.value)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all ${
                  religious.includes(option.value)
                    ? 'bg-green-50 border-[#2D7A46]'
                    : 'bg-white border-gray-200 hover:border-[#2D7A46]'
                }`}
              >
                <span className="text-gray-900">{option.label}</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  religious.includes(option.value)
                    ? 'bg-[#2D7A46] border-[#2D7A46]'
                    : 'border-gray-300'
                }`}>
                  {religious.includes(option.value) && (
                    <div className="w-3 h-3 rounded-full bg-white" />
                  )}
                </div>
              </button>
            ))}

            {/* Custom religious restrictions */}
            {customReligious.map(item => (
              <button
                key={item}
                className="w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 bg-green-50 border-[#2D7A46]"
              >
                <span className="text-gray-900">{item}</span>
                <X 
                  size={18} 
                  className="cursor-pointer hover:opacity-70 text-[#2D7A46]"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCustomItem('religious', item);
                  }}
                />
              </button>
            ))}

            {/* Add custom button */}
            {showCustomInput !== 'religious' ? (
              <button
                onClick={() => setShowCustomInput('religious')}
                className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-xl border-2 border-dashed border-[#2D7A46] text-[#2D7A46] hover:bg-green-50"
              >
                <Plus size={18} />
                <span>Add Other</span>
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Input
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addCustomItem('religious');
                    } else if (e.key === 'Escape') {
                      setShowCustomInput(null);
                      setCustomInput('');
                    }
                  }}
                  placeholder="Enter religious restriction..."
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => addCustomItem('religious')}
                    className="flex-1 bg-[#2D7A46] hover:bg-[#236034]"
                  >
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowCustomInput(null);
                      setCustomInput('');
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sodium Limit Section */}
        <div className="space-y-4">
          <h3 className="text-lg">Sodium Limit</h3>
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 space-y-2">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Default:</span> {DEFAULT_MAX_SODIUM}mg per meal
            </p>
            <p className="text-xs text-gray-600">
              Used when "Low Sodium" preference is selected
            </p>
          </div>

          <button
            onClick={handleCustomSodiumToggle}
            className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all ${
              useCustomSodium
                ? 'bg-green-50 border-[#2D7A46]'
                : 'bg-white border-gray-200 hover:border-[#2D7A46]'
            }`}
          >
            <span className="text-gray-900">Use Custom Sodium Limit</span>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              useCustomSodium
                ? 'bg-[#2D7A46] border-[#2D7A46]'
                : 'border-gray-300'
            }`}>
              {useCustomSodium && (
                <div className="w-3 h-3 rounded-full bg-white" />
              )}
            </div>
          </button>

          {useCustomSodium && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Maximum Sodium (mg)</span>
                <span className="text-lg text-[#2D7A46]">{maxSodium || DEFAULT_MAX_SODIUM}mg</span>
              </div>
              <Slider
                value={[maxSodium || DEFAULT_MAX_SODIUM]}
                onValueChange={(value) => handleSodiumChange(value[0])}
                min={200}
                max={2000}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>200mg (Very Low)</span>
                <span>2000mg (High)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
