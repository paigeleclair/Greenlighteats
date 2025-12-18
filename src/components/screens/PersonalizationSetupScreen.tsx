import { useState } from 'react';
import { AlertCircle, Heart, BookOpen, ChevronLeft, Droplet, Plus, X, Candy } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Slider } from '../ui/slider';
import { Input } from '../ui/input';
import { Allergen, DietaryRestriction, ReligiousRestriction, UserPreferences, DEFAULT_MAX_SODIUM, DEFAULT_MAX_SUGAR } from '../../types';

interface PersonalizationSetupScreenProps {
  onComplete: (preferences: UserPreferences) => void;
  onBack?: () => void;
  onSkip?: () => void;
}

export function PersonalizationSetupScreen({ onComplete, onBack, onSkip }: PersonalizationSetupScreenProps) {
  const [step, setStep] = useState(1);
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [dietary, setDietary] = useState<DietaryRestriction[]>([]);
  const [religious, setReligious] = useState<ReligiousRestriction[]>([]);
  const [customAllergens, setCustomAllergens] = useState<string[]>([]);
  const [customDietary, setCustomDietary] = useState<string[]>([]);
  const [customReligious, setCustomReligious] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [maxSodium, setMaxSodium] = useState<number | undefined>(undefined);
  const [useCustomSodium, setUseCustomSodium] = useState(false);
  const [maxSugar, setMaxSugar] = useState<number | undefined>(undefined);
  const [useCustomSugar, setUseCustomSugar] = useState(false);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

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

  const toggleAllergen = (allergen: Allergen) => {
    setAllergens(prev => 
      prev.includes(allergen) 
        ? prev.filter(a => a !== allergen)
        : [...prev, allergen]
    );
  };

  const toggleDietary = (restriction: DietaryRestriction) => {
    setDietary(prev => 
      prev.includes(restriction)
        ? prev.filter(d => d !== restriction)
        : [...prev, restriction]
    );
  };

  const toggleReligious = (restriction: ReligiousRestriction) => {
    setReligious(prev => {
      // If clicking "none"
      if (restriction === 'none') {
        // If "none" is already selected, deselect it
        if (prev.includes('none')) {
          return prev.filter(r => r !== 'none');
        }
        // Otherwise, select only "none" (clear others)
        return ['none'];
      }
      
      // If clicking halal or kosher
      // Remove "none" if it was selected, then toggle the restriction
      const withoutNone = prev.filter(r => r !== 'none');
      if (withoutNone.includes(restriction)) {
        return withoutNone.filter(r => r !== restriction);
      }
      return [...withoutNone, restriction];
    });
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      setShowCustomInput(false);
      setCustomInput('');
    } else {
      onComplete({ 
        allergens, 
        dietary, 
        religious,
        customAllergens,
        customDietary,
        customReligious,
        maxSodium: useCustomSodium ? maxSodium : undefined,
        maxSugar: useCustomSugar ? maxSugar : undefined
      });
    }
  };

  const addCustomItem = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;

    if (step === 1) {
      // Allergens
      if (!customAllergens.includes(trimmed)) {
        setCustomAllergens([...customAllergens, trimmed]);
      }
    } else if (step === 2) {
      // Dietary
      if (!customDietary.includes(trimmed)) {
        setCustomDietary([...customDietary, trimmed]);
      }
    } else if (step === 3) {
      // Religious
      if (!customReligious.includes(trimmed)) {
        setCustomReligious([...customReligious, trimmed]);
      }
    }

    setCustomInput('');
    setShowCustomInput(false);
  };

  const removeCustomItem = (item: string) => {
    if (step === 1) {
      setCustomAllergens(customAllergens.filter(a => a !== item));
    } else if (step === 2) {
      setCustomDietary(customDietary.filter(d => d !== item));
    } else if (step === 3) {
      setCustomReligious(customReligious.filter(r => r !== item));
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else if (onBack) {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={handleBack}>
              <ChevronLeft size={24} className="text-foreground" />
            </button>
            {onSkip && (
              <button 
                onClick={onSkip}
                className="text-[#2D7A46] dark:text-green-400 hover:text-[#236034] dark:hover:text-green-300"
              >
                Skip for now
              </button>
            )}
          </div>
          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-sm text-muted-foreground">Step {step} of {totalSteps}</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 pb-24">
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <AlertCircle size={24} className="text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl text-card-foreground">Allergens</h2>
              <p className="text-muted-foreground">Select any allergens you need to avoid</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {allergenOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => toggleAllergen(option.value)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-full border-2 transition-all ${
                    allergens.includes(option.value)
                      ? 'bg-[#2D7A46] dark:bg-green-700 border-[#2D7A46] dark:border-green-600 text-white'
                      : 'bg-card border-border text-card-foreground hover:border-[#2D7A46] dark:hover:border-green-600'
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
                  className="flex items-center gap-2 px-4 py-3 rounded-full border-2 bg-[#2D7A46] dark:bg-green-700 border-[#2D7A46] dark:border-green-600 text-white"
                >
                  <span>{item}</span>
                  <X 
                    size={16} 
                    className="cursor-pointer hover:opacity-70"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCustomItem(item);
                    }}
                  />
                </button>
              ))}

              {/* Add custom button */}
              {!showCustomInput ? (
                <button
                  onClick={() => setShowCustomInput(true)}
                  className="flex items-center gap-2 px-4 py-3 rounded-full border-2 border-dashed border-[#2D7A46] dark:border-green-600 text-[#2D7A46] dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30"
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
                        addCustomItem();
                      } else if (e.key === 'Escape') {
                        setShowCustomInput(false);
                        setCustomInput('');
                      }
                    }}
                    placeholder="Enter allergen..."
                    className="flex-1"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    onClick={addCustomItem}
                    className="bg-[#2D7A46] hover:bg-[#236034] dark:bg-green-700 dark:hover:bg-green-600"
                  >
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowCustomInput(false);
                      setCustomInput('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <Heart size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl text-card-foreground">Dietary Restrictions</h2>
              <p className="text-muted-foreground">Select your dietary or medical restrictions</p>
            </div>

            <div className="space-y-3">
              {dietaryOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => toggleDietary(option.value)}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all ${
                    dietary.includes(option.value)
                      ? 'bg-green-50 dark:bg-green-900/20 border-[#2D7A46] dark:border-green-600'
                      : 'bg-card border-border hover:border-[#2D7A46] dark:hover:border-green-600'
                  }`}
                >
                  <span className="text-card-foreground">{option.label}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    dietary.includes(option.value)
                      ? 'bg-[#2D7A46] dark:bg-green-700 border-[#2D7A46] dark:border-green-600'
                      : 'border-border'
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
                  className="w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 bg-green-50 dark:bg-green-900/20 border-[#2D7A46] dark:border-green-600"
                >
                  <span className="text-card-foreground">{item}</span>
                  <X 
                    size={18} 
                    className="cursor-pointer hover:opacity-70 text-[#2D7A46] dark:text-green-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCustomItem(item);
                    }}
                  />
                </button>
              ))}

              {/* Add custom button */}
              {!showCustomInput ? (
                <button
                  onClick={() => setShowCustomInput(true)}
                  className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-xl border-2 border-dashed border-[#2D7A46] dark:border-green-600 text-[#2D7A46] dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30"
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
                        addCustomItem();
                      } else if (e.key === 'Escape') {
                        setShowCustomInput(false);
                        setCustomInput('');
                      }
                    }}
                    placeholder="Enter dietary restriction..."
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={addCustomItem}
                      className="flex-1 bg-[#2D7A46] hover:bg-[#236034] dark:bg-green-700 dark:hover:bg-green-600"
                    >
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowCustomInput(false);
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
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <BookOpen size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl text-card-foreground">Religious Restrictions</h2>
              <p className="text-muted-foreground">Select your religious dietary requirements</p>
            </div>

            <div className="space-y-3">
              {religiousOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => toggleReligious(option.value)}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all ${
                    religious.includes(option.value)
                      ? 'bg-green-50 dark:bg-green-900/20 border-[#2D7A46] dark:border-green-600'
                      : 'bg-card border-border hover:border-[#2D7A46] dark:hover:border-green-600'
                  }`}
                >
                  <span className="text-card-foreground">{option.label}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    religious.includes(option.value)
                      ? 'bg-[#2D7A46] dark:bg-green-700 border-[#2D7A46] dark:border-green-600'
                      : 'border-border'
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
                  className="w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 bg-green-50 dark:bg-green-900/20 border-[#2D7A46] dark:border-green-600"
                >
                  <span className="text-card-foreground">{item}</span>
                  <X 
                    size={18} 
                    className="cursor-pointer hover:opacity-70 text-[#2D7A46] dark:text-green-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCustomItem(item);
                    }}
                  />
                </button>
              ))}

              {/* Add custom button */}
              {!showCustomInput ? (
                <button
                  onClick={() => setShowCustomInput(true)}
                  className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-xl border-2 border-dashed border-[#2D7A46] dark:border-green-600 text-[#2D7A46] dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30"
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
                        addCustomItem();
                      } else if (e.key === 'Escape') {
                        setShowCustomInput(false);
                        setCustomInput('');
                      }
                    }}
                    placeholder="Enter religious restriction..."
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={addCustomItem}
                      className="flex-1 bg-[#2D7A46] hover:bg-[#236034] dark:bg-green-700 dark:hover:bg-green-600"
                    >
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowCustomInput(false);
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
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <Droplet size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl text-card-foreground">Sodium & Sugar Limits</h2>
              <p className="text-muted-foreground">Set your maximum sodium and sugar per meal (optional)</p>
            </div>

            {/* Sodium Section */}
            <div className="space-y-4">
              <h3 className="text-lg text-card-foreground flex items-center gap-2">
                <Droplet size={20} className="text-blue-600 dark:text-blue-400" />
                Sodium Limit
              </h3>
              
              <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-4 space-y-2">
                <p className="text-sm text-card-foreground">
                  <span className="font-medium">Default setting:</span> {DEFAULT_MAX_SODIUM}mg per meal
                </p>
                <p className="text-xs text-muted-foreground">
                  This is automatically applied when you select "Low Sodium" preference
                </p>
              </div>

              <button
                onClick={() => setUseCustomSodium(!useCustomSodium)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all ${
                  useCustomSodium
                    ? 'bg-green-50 dark:bg-green-900/20 border-[#2D7A46] dark:border-green-600'
                    : 'bg-card border-border hover:border-[#2D7A46] dark:hover:border-green-600'
                }`}
              >
                <span className="text-card-foreground">Set Custom Sodium Limit</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  useCustomSodium
                    ? 'bg-[#2D7A46] dark:bg-green-700 border-[#2D7A46] dark:border-green-600'
                    : 'border-border'
                }`}>
                  {useCustomSodium && (
                    <div className="w-3 h-3 rounded-full bg-white" />
                  )}
                </div>
              </button>

              {useCustomSodium && (
                <div className="space-y-4 p-4 bg-secondary rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-card-foreground">Maximum Sodium (mg)</span>
                    <span className="text-lg text-[#2D7A46] dark:text-green-400">{maxSodium || DEFAULT_MAX_SODIUM}mg</span>
                  </div>
                  <Slider
                    value={[maxSodium || DEFAULT_MAX_SODIUM]}
                    onValueChange={(value) => setMaxSodium(value[0])}
                    min={200}
                    max={2000}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>200mg (Very Low)</span>
                    <span>2000mg (High)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-border my-6"></div>

            {/* Sugar Section */}
            <div className="space-y-4">
              <h3 className="text-lg text-card-foreground flex items-center gap-2">
                <Candy size={20} className="text-blue-600 dark:text-blue-400" />
                Sugar Limit
              </h3>
              
              <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-4 space-y-2">
                <p className="text-sm text-card-foreground">
                  <span className="font-medium">Default setting:</span> {DEFAULT_MAX_SUGAR}g per meal
                </p>
                <p className="text-xs text-muted-foreground">
                  This is automatically applied when you select "Low Sugar" preference
                </p>
              </div>

              <button
                onClick={() => setUseCustomSugar(!useCustomSugar)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all ${
                  useCustomSugar
                    ? 'bg-green-50 dark:bg-green-900/20 border-[#2D7A46] dark:border-green-600'
                    : 'bg-card border-border hover:border-[#2D7A46] dark:hover:border-green-600'
                }`}
              >
                <span className="text-card-foreground">Set Custom Sugar Limit</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  useCustomSugar
                    ? 'bg-[#2D7A46] dark:bg-green-700 border-[#2D7A46] dark:border-green-600'
                    : 'border-border'
                }`}>
                  {useCustomSugar && (
                    <div className="w-3 h-3 rounded-full bg-white" />
                  )}
                </div>
              </button>

              {useCustomSugar && (
                <div className="space-y-4 p-4 bg-secondary rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-card-foreground">Maximum Sugar (g)</span>
                    <span className="text-lg text-[#2D7A46] dark:text-green-400">{maxSugar || DEFAULT_MAX_SUGAR}g</span>
                  </div>
                  <Slider
                    value={[maxSugar || DEFAULT_MAX_SUGAR]}
                    onValueChange={(value) => setMaxSugar(value[0])}
                    min={5}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5g (Very Low)</span>
                    <span>50g (High)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-4">
        <Button 
          onClick={handleNext}
          className="w-full bg-[#2D7A46] hover:bg-[#236034] dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-xl h-12"
        >
          {step === totalSteps ? 'Save & Continue' : 'Next'}
        </Button>
      </div>
    </div>
  );
}