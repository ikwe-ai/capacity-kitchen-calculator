import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SliderActionProps {
  min?: number;
  max?: number;
  value: number;
  onChange: (value: number) => void;
  onConfirm: (value: number) => void;
  lowLabel?: string;
  highLabel?: string;
  emoji?: string;
  showValue?: boolean;
}

const sliderLabels: Record<number, string> = {
  0: 'Empty',
  1: 'Almost nothing',
  2: 'Very low',
  3: 'Low',
  4: 'Below average',
  5: 'Medium',
  6: 'Decent',
  7: 'Good',
  8: 'High',
  9: 'Very high',
  10: 'Maximum',
};

export function SliderAction({ 
  min = 0, 
  max = 10, 
  value, 
  onChange, 
  onConfirm,
  lowLabel = "Empty",
  highLabel = "Overflowing",
  emoji = "🔥",
  showValue = true,
}: SliderActionProps) {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-soft space-y-4 animate-fade-in">
      <div className="text-center">
        <span className="text-4xl">{emoji}</span>
        {showValue && (
          <div className="mt-2">
            <span className="text-3xl font-display font-bold text-foreground">{value}</span>
            <span className="text-lg text-muted-foreground">/10</span>
          </div>
        )}
        <p className="text-sm text-muted-foreground mt-1">
          {sliderLabels[value] || ''}
        </p>
      </div>

      <div className="space-y-2">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-3 rounded-full appearance-none cursor-pointer accent-primary bg-muted
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-card
            [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:rounded-full 
            [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-card"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
      </div>

      <button
        onClick={() => onConfirm(value)}
        className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
      >
        That feels right
      </button>
    </div>
  );
}
