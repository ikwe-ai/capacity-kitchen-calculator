import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FridgeItem {
  key: string;
  label: string;
  emoji: string;
}

interface MultiSliderActionProps {
  items: FridgeItem[];
  onConfirm: (values: Record<string, number>) => void;
}

const levelLabel = (v: number) => {
  if (v <= 2) return 'Very low';
  if (v <= 4) return 'Low';
  if (v <= 6) return 'Medium';
  if (v <= 8) return 'Good';
  return 'High';
};

const levelColor = (v: number) => {
  if (v <= 3) return 'text-destructive';
  if (v <= 5) return 'text-muted-foreground';
  if (v <= 7) return 'text-foreground';
  return 'text-primary';
};

export function MultiSliderAction({ items, onConfirm }: MultiSliderActionProps) {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(items.map(item => [item.key, 5]))
  );

  const handleChange = (key: string, value: number) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-card rounded-2xl p-5 shadow-soft space-y-5 animate-fade-in">
      {items.map((item) => (
        <div key={item.key} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{item.emoji}</span>
              <span className="text-sm font-medium text-foreground">{item.label}</span>
            </div>
            <span className={cn('text-sm font-medium', levelColor(values[item.key]))}>
              {values[item.key]}/10 · {levelLabel(values[item.key])}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={10}
            value={values[item.key]}
            onChange={(e) => handleChange(item.key, parseInt(e.target.value))}
            className="w-full h-2.5 rounded-full appearance-none cursor-pointer bg-muted
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md
              [&::-webkit-slider-thumb]:border-3 [&::-webkit-slider-thumb]:border-card
              [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full 
              [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-3 [&::-moz-range-thumb]:border-card"
          />
        </div>
      ))}

      <button
        onClick={() => onConfirm(values)}
        className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity mt-2"
      >
        Lock these in 🔒
      </button>
    </div>
  );
}
