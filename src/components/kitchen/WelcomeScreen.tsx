import { Button } from '@/components/ui/button';
import { AutoPlayDemo } from './AutoPlayDemo';
import { SampleReportPreview } from './SampleReportPreview';
import { History, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface WelcomeScreenProps {
  onStart: () => void;
  onViewHistory: () => void;
  historyCount: number;
}

export function WelcomeScreen({ onStart, onViewHistory, historyCount }: WelcomeScreenProps) {
  const { user, login, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-warm flex flex-col items-center justify-center p-6">
      {/* Auth button - top right */}
      <div className="fixed top-4 right-4 z-10">
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={logout} className="gap-1.5">
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={login} className="gap-1.5">
            <LogIn className="w-3.5 h-3.5" />
            Sign in
          </Button>
        )}
      </div>

      <div className="max-w-md w-full text-center space-y-6 animate-fade-in">
        {/* Logo/Icon */}
        <div className="text-7xl mb-2">🍽️</div>
        
        {/* Title */}
        <div className="space-y-2">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground tracking-tight">
            What's Cooking?
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            A <strong className="text-foreground">personal capacity check-in</strong> that uses kitchen metaphors to help you see what you're really carrying — and what's actually left in the tank.
          </p>
          <p className="text-sm text-muted-foreground italic">
            Not a recipe app. A reality check. 🪞
          </p>
        </div>

        {/* Auto-Play Demo */}
        <AutoPlayDemo />

        {/* Kitchen Report Preview Card */}
        <div className="bg-card rounded-2xl p-5 shadow-card space-y-3 text-left">
          <p className="text-foreground font-medium">
            After a short 5-step check-in, I'll serve you a Kitchen Report with:
          </p>
          <ul className="space-y-1.5 text-muted-foreground text-sm">
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span>
              <span>Your <strong className="text-foreground">Kitchen Score</strong> (0–100%)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span>
              <span>How full each area is</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span>
              <span>Your top 3 <strong className="text-foreground">missing ingredients</strong></span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span>
              <span><strong className="text-foreground">ONE tiny move</strong> that would give you the most runway</span>
            </li>
          </ul>
          <p className="text-muted-foreground text-sm pt-2 border-t border-border">
            Answer in natural language — no perfect numbers needed.
          </p>
        </div>

        {/* Sample Report Preview */}
        <SampleReportPreview />

        {/* CTA */}
        <Button 
          variant="warm" 
          size="xl" 
          onClick={onStart}
          className="w-full font-display text-lg"
        >
          Start Check-In 🍳
        </Button>

        {/* History button */}
        {historyCount > 0 && (
          <Button
            variant="outline"
            size="lg"
            onClick={onViewHistory}
            className="w-full gap-2"
          >
            <History className="w-4 h-4" />
            View Past Check-Ins ({historyCount})
          </Button>
        )}
        
        <p className="text-xs text-muted-foreground">
          Takes about 3-5 minutes • Saved locally on this device
        </p>
      </div>
    </div>
  );
}
