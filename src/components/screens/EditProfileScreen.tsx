import { useState, useRef } from 'react';
import { ChevronLeft, Camera, User, Calendar, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { UserProfile } from '../../types';
import { Calendar as CalendarComponent } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format } from 'date-fns';
import { toast } from 'sonner@2.0.3';

interface EditProfileScreenProps {
  initialProfile?: UserProfile;
  onSave: (profile: UserProfile) => void;
  onBack: () => void;
}

export function EditProfileScreen({ initialProfile, onSave, onBack }: EditProfileScreenProps) {
  const [firstName, setFirstName] = useState(initialProfile?.firstName || '');
  const [lastName, setLastName] = useState(initialProfile?.lastName || '');
  const [email, setEmail] = useState(initialProfile?.email || '');
  const [phone, setPhone] = useState(initialProfile?.phone || '');
  const [password, setPassword] = useState(initialProfile?.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [birthday, setBirthday] = useState<Date | undefined>(
    initialProfile?.birthday ? new Date(initialProfile.birthday) : undefined
  );
  const [photoUrl, setPhotoUrl] = useState(initialProfile?.photoUrl || '');
  const [photoPreview, setPhotoPreview] = useState(initialProfile?.photoUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoUrl(result);
        setPhotoPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!firstName.trim()) {
      alert('Please enter your first name');
      return;
    }
    if (!lastName.trim()) {
      alert('Please enter your last name');
      return;
    }
    if (!email.trim()) {
      alert('Please enter your email');
      return;
    }
    if (!phone.trim()) {
      alert('Please enter your phone number');
      return;
    }

    const updatedProfile: UserProfile = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password: password.trim() || undefined,
      birthday: birthday ? format(birthday, 'yyyy-MM-dd') : undefined,
      photoUrl: photoUrl || undefined,
      lastBirthdayNotification: initialProfile?.lastBirthdayNotification
    };

    onSave(updatedProfile);
    
    // Show success toast
    toast.success('Profile updated successfully!');
    
    // Check if birthday is today and show special message
    if (birthday) {
      const today = new Date();
      if (today.getMonth() === birthday.getMonth() && today.getDate() === birthday.getDate()) {
        setTimeout(() => {
          toast.success('🎉 Check your notifications for a birthday surprise!', {
            duration: 4000
          });
        }, 500);
      }
    }
  };

  return (
    <div className="min-h-screen bg-secondary pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border px-4 py-4 z-10">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={onBack}>
            <ChevronLeft size={24} className="text-foreground" />
          </button>
          <h2 className="text-xl text-card-foreground">Edit Profile</h2>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Photo Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-muted-foreground" />
              )}
            </div>
            <button
              onClick={handlePhotoClick}
              className="absolute bottom-0 right-0 w-8 h-8 bg-[#2D7A46] dark:bg-green-700 rounded-full flex items-center justify-center border-2 border-card"
            >
              <Camera size={16} className="text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <p className="text-sm text-muted-foreground">Tap the camera icon to change photo</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Optional. Used for account security.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthday">Birthday</Label>
            <Popover>
              <PopoverTrigger className="w-full">
                <div className="flex h-12 w-full items-center justify-start rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:bg-accent hover:text-accent-foreground">
                  <Calendar size={16} className="mr-2" />
                  <span className={birthday ? "text-foreground" : "text-muted-foreground"}>
                    {birthday ? format(birthday, 'MMMM d, yyyy') : 'Select your birthday'}
                  </span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={birthday}
                  onSelect={setBirthday}
                  initialFocus
                  disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              We'll send you a special birthday wish and restaurant recommendations! 🎂
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 italic">
              Tip: Set your birthday to today to test the birthday notification feature!
            </p>
          </div>
        </div>

        <div className="bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <span className="font-medium">Note:</span> Your profile information is stored locally on your device and is not shared with any servers.
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-4">
        <Button
          onClick={handleSave}
          className="w-full bg-[#2D7A46] hover:bg-[#236034] dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-xl h-12"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
