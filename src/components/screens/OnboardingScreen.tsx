import { Button } from '../ui/button';
import { BackgroundIconGrid } from '../BackgroundIconGrid';
import { TrafficLight } from '../TrafficLight';

interface OnboardingScreenProps {
  onSignUp: () => void;
  onLogin: () => void;
}

export function OnboardingScreen({ onSignUp, onLogin }: OnboardingScreenProps) {
  return (
    <div className="min-h-screen w-full bg-[#D4F1E0] dark:bg-green-950/20 flex flex-col relative overflow-hidden">
      {/* Decorative Background Icons - Using Reusable Grid System */}
      <BackgroundIconGrid />

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 relative z-10">
        {/* Logo and Branding */}
        <div className="flex flex-col items-center gap-8 mb-16">
          <h1 className="text-6xl font-bold text-[#1B5E37] dark:text-green-700 text-center tracking-tight" style={{
            WebkitTextStroke: '2px white',
            textShadow: '0 0 8px rgba(255, 255, 255, 0.8)'
          }}>
            GREENLIGHT<br />EATS
          </h1>
          
          {/* Traffic Light Icon */}
          <div className="flex items-center justify-center">
            <TrafficLight size={100} activeLight="green" />
          </div>
          
          <p className="text-2xl font-semibold text-[#1B5E37] dark:text-green-700">
            Eat With Confidence
          </p>
        </div>
        
        {/* CTAs */}
        <div className="w-full space-y-5 max-w-sm">
          <Button 
            onClick={onSignUp}
            className="w-full bg-[#1B5E37] hover:bg-[#14472A] dark:bg-green-800 dark:hover:bg-green-700 text-white rounded-full h-16 text-xl"
          >
            Sign Up
          </Button>
          <Button 
            onClick={onLogin}
            variant="outline"
            className="w-full bg-white/90 border-[#1B5E37] dark:border-green-600 text-[#1B5E37] dark:text-green-700 hover:bg-white dark:hover:bg-white/80 rounded-full h-16 text-xl"
          >
            Log In
          </Button>
        </div>
      </div>
    </div>
  );
}