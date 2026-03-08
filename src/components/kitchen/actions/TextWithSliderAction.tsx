import { useState } from 'react';

interface TextWithSliderActionProps {
  placeholder?: string;
  sliderLabel?: string;
  sliderEmoji?: string;
  lowLabel?: string;
  highLabel?: string;
  onConfirm: (text: string, sliderValue: number) => void;
}

export function TextWithSliderAction({
  placeholder = "Describe it in your own words...",
  sliderLabel = "How big does this feel?",
  sliderEmoji = "🍝",
  lowLabel = "Tiny snack",
  highLabel = "Massive feast",
  onConfirm,
}: TextWithSliderActionProps) {
  const [text, setText] = useState('');
  const [sliderValue, setSliderValue] = useState(5);

  return (
    <div className="bg-card rounded-2xl p-5 shadow-soft space-y-4 animate-fade-in">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm"
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{sliderLabel}</span>
          <span className="text-lg">{sliderEmoji} {sliderValue}/10</span>
        </div>
        <input
          type="range"
          min={0}
          max={10}
          value={sliderValue}
          onChange={(e) => setSliderValue(parseInt(e.target.value))}
          className="w-full h-2.5 rounded-full appearance-none cursor-pointer bg-muted
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:border-3 [&::-webkit-slider-thumb]:border-card
            [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full 
            [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-3 [&::-moz-range-thumb]:border-card"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
      </div>

      <button
        onClick={() => text.trim() && onConfirm(text.trim(), sliderValue)}
        disabled={!text.trim()}
        className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
      >
        Serve it up 🍽️
      </button>
    </div>
  );
}
