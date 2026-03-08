import { cn } from '@/lib/utils';

interface ChipOption {
  label: string;
  value: string;
  emoji?: string;
}

interface ChipSelectActionProps {
  options: ChipOption[];
  onSelect: (value: string) => void;
  multiSelect?: boolean;
  selected?: string[];
  columns?: 1 | 2 | 3;
}

export function ChipSelectAction({ 
  options, 
  onSelect, 
  multiSelect = false, 
  selected = [],
  columns = 2,
}: ChipSelectActionProps) {
  return (
    <div className={cn(
      'grid gap-2 animate-fade-in',
      columns === 1 && 'grid-cols-1',
      columns === 2 && 'grid-cols-2',
      columns === 3 && 'grid-cols-3',
    )}>
      {options.map((option) => {
        const isSelected = selected.includes(option.value);
        return (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left',
              'border-2 hover:scale-[1.02] active:scale-[0.98]',
              isSelected
                ? 'bg-primary text-primary-foreground border-primary shadow-md'
                : 'bg-card text-foreground border-border hover:border-primary/50 shadow-soft'
            )}
          >
            {option.emoji && <span className="text-lg">{option.emoji}</span>}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
