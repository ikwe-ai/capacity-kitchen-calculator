import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'plate' | 'fridge' | 'cupboards' | 'buffet';
}

const variantColors = {
  default: 'bg-primary',
  plate: 'bg-gradient-to-r from-primary to-warm-orange',
  fridge: 'bg-gradient-to-r from-sky-400 to-sky-500',
  cupboards: 'bg-gradient-to-r from-amber-500 to-amber-600',
  buffet: 'bg-gradient-to-r from-sage to-sage-dark',
};

export function ProgressBar({ 
  value, 
  max = 10, 
  className, 
  showPercentage = true,
  variant = 'default' 
}: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100);
  
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn('h-full rounded-full transition-all duration-500', variantColors[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <span className="text-sm font-medium text-muted-foreground w-12 text-right">
          {percentage}%
        </span>
      )}
    </div>
  );
}
