import { cn } from '@/lib/utils';

interface EmojiMeterProps {
  value: number;
  max?: number;
  emoji: string;
  className?: string;
}

export function EmojiMeter({ value, max = 10, emoji, className }: EmojiMeterProps) {
  const filled = Math.round((value / max) * 5);
  const empty = 5 - filled;
  
  return (
    <div className={cn('flex items-center gap-0.5 text-xl', className)}>
      {Array.from({ length: filled }).map((_, i) => (
        <span key={`filled-${i}`} className="opacity-100">{emoji}</span>
      ))}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`empty-${i}`} className="opacity-20 grayscale">⬜</span>
      ))}
    </div>
  );
}
