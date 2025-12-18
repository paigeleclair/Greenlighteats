import { useState } from 'react';
import { ChevronLeft, MapPin, Info } from 'lucide-react';
import { LocationPermission } from '../../types';
import { Alert, AlertDescription } from '../ui/alert';

interface LocationSettingsScreenProps {
  initialPermission: LocationPermission;
  onSave: (permission: LocationPermission) => void;
  onBack: () => void;
}

export function LocationSettingsScreen({ initialPermission, onSave, onBack }: LocationSettingsScreenProps) {
  const [selectedPermission, setSelectedPermission] = useState<LocationPermission>(initialPermission);

  const locationOptions: { value: LocationPermission; label: string; description: string }[] = [
    { 
      value: 'while-using', 
      label: 'While Using the App', 
      description: 'Location is used only when the app is open to find nearby restaurants' 
    },
    { 
      value: 'always', 
      label: 'Always', 
      description: 'Location is used even when the app is in the background for better recommendations' 
    },
    { 
      value: 'never', 
      label: 'Never', 
      description: 'Location services are disabled. You can still search restaurants manually' 
    }
  ];

  const handleSelect = (permission: LocationPermission) => {
    setSelectedPermission(permission);
    onSave(permission);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={onBack}>
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <h2 className="text-xl">Location Settings</h2>
        </div>
        <p className="text-sm text-gray-600 pl-9">Choose how we use your location</p>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Info Alert */}
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm text-blue-900">
            GreenLight Eats uses your location to find nearby restaurants and provide personalized recommendations based on your dietary restrictions.
          </AlertDescription>
        </Alert>

        {/* Location Options */}
        <div className="space-y-4">
          <h3 className="text-lg flex items-center gap-2">
            <MapPin size={20} className="text-[#2D7A46]" />
            Location Permission
          </h3>
          <div className="space-y-3">
            {locationOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full flex items-start justify-between px-5 py-4 rounded-xl border-2 transition-all ${
                  selectedPermission === option.value
                    ? 'bg-green-50 border-[#2D7A46]'
                    : 'bg-white border-gray-200 hover:border-[#2D7A46]'
                }`}
              >
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900 mb-1">{option.label}</p>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ml-3 ${
                  selectedPermission === option.value
                    ? 'bg-[#2D7A46] border-[#2D7A46]'
                    : 'border-gray-300'
                }`}>
                  {selectedPermission === option.value && (
                    <div className="w-3 h-3 rounded-full bg-white" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <h4 className="font-medium text-gray-900">How we use your location</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#2D7A46] mt-1">•</span>
              <span>Find restaurants near you that match your dietary restrictions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2D7A46] mt-1">•</span>
              <span>Calculate accurate distance and travel time to restaurants</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2D7A46] mt-1">•</span>
              <span>Provide location-based recommendations and safety alerts</span>
            </li>
          </ul>
        </div>

        {/* Privacy Note */}
        <p className="text-xs text-gray-500 text-center">
          Your location data is only used to enhance your experience and is never shared with third parties. You can change this setting anytime.
        </p>
      </div>
    </div>
  );
}
