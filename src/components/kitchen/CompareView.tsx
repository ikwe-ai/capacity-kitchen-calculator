import { HistoryEntry } from '@/lib/check-in-history';
import { calculateKitchenReport } from '@/lib/kitchen-calculations';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CompareViewProps {
  entryA: HistoryEntry;
  entryB: HistoryEntry;
  onBack: () => void;
  formatDate: (iso: string) => string;
}

interface MetricRow {
  label: string;
  emoji: string;
  valueA: number;
  valueB: number;
  max?: number;
}

function DiffBadge({ diff }: { diff: number }) {
  if (diff === 0) return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
  const isPositive = diff > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${isPositive ? 'text-sage-dark' : 'text-destructive'}`}>
      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {isPositive ? '+' : ''}{diff}
    </span>
  );
}

function MetricBar({ label, emoji, valueA, valueB, max = 10 }: MetricRow) {
  const diff = Math.round((valueB - valueA) * 10) / 10;
  const pctA = (valueA / max) * 100;
  const pctB = (valueB / max) * 100;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
          <span>{emoji}</span> {label}
        </span>
        <DiffBadge diff={Math.round(diff)} />
      </div>
      <div className="flex gap-2 items-center">
        <div className="flex-1 space-y-1">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-primary/50 transition-all duration-500" style={{ width: `${pctA}%` }} />
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pctB}%` }} />
          </div>
        </div>
        <div className="w-12 text-right">
          <div className="text-[10px] text-muted-foreground">{Math.round(valueA * 10) / 10}</div>
          <div className="text-xs font-medium text-foreground">{Math.round(valueB * 10) / 10}</div>
        </div>
      </div>
    </div>
  );
}

export function CompareView({ entryA, entryB, onBack, formatDate }: CompareViewProps) {
  // entryA = older, entryB = newer
  const [older, newer] = entryA.date < entryB.date ? [entryA, entryB] : [entryB, entryA];
  const reportOld = calculateKitchenReport(older.data);
  const reportNew = calculateKitchenReport(newer.data);

  const scoreDiff = reportNew.kitchenScore - reportOld.kitchenScore;

  const sections: { title: string; emoji: string; metrics: MetricRow[] }[] = [
    {
      title: 'Fridge — Short-Term',
      emoji: '🧊',
      metrics: [
        { label: 'Sleep', emoji: '😴', valueA: older.data.fridge.sleep, valueB: newer.data.fridge.sleep },
        { label: 'Energy', emoji: '⚡', valueA: older.data.fridge.energy, valueB: newer.data.fridge.energy },
        { label: 'Food & basics', emoji: '🥫', valueA: older.data.fridge.food, valueB: newer.data.fridge.food },
        { label: 'Cash', emoji: '💵', valueA: older.data.fridge.cash, valueB: newer.data.fridge.cash },
        { label: 'Emotional buffer', emoji: '🧘', valueA: older.data.fridge.emotional, valueB: newer.data.fridge.emotional },
      ],
    },
    {
      title: 'Cupboards — Stability',
      emoji: '🗄️',
      metrics: [
        { label: 'Housing', emoji: '🏠', valueA: older.data.cupboards.housing, valueB: newer.data.cupboards.housing },
        { label: 'Finance', emoji: '💰', valueA: older.data.cupboards.finance, valueB: newer.data.cupboards.finance },
        { label: 'Safety', emoji: '🛡️', valueA: older.data.cupboards.safety, valueB: newer.data.cupboards.safety },
        { label: 'Support', emoji: '🤝', valueA: older.data.cupboards.support, valueB: newer.data.cupboards.support },
        { label: 'Health', emoji: '❤️‍🩹', valueA: older.data.cupboards.health, valueB: newer.data.cupboards.health },
      ],
    },
    {
      title: 'Buffet — Potential',
      emoji: '🍱',
      metrics: [
        { label: 'Creativity', emoji: '💡', valueA: older.data.buffet.creativity, valueB: newer.data.buffet.creativity },
        { label: 'Skills', emoji: '🎯', valueA: older.data.buffet.skills, valueB: newer.data.buffet.skills },
        { label: 'Network', emoji: '🌐', valueA: older.data.buffet.network, valueB: newer.data.buffet.network },
        { label: 'Vision', emoji: '🔭', valueA: older.data.buffet.vision, valueB: newer.data.buffet.vision },
        { label: 'Resilience', emoji: '🔥', valueA: older.data.buffet.resilience, valueB: newer.data.buffet.resilience },
      ],
    },
  ];

  // Find biggest improvements and drops
  const allMetrics = sections.flatMap(s => s.metrics);
  const sorted = [...allMetrics].sort((a, b) => (b.valueB - b.valueA) - (a.valueB - a.valueA));
  const biggestGain = sorted[0];
  const biggestDrop = sorted[sorted.length - 1];

  return (
    <div className="min-h-screen bg-gradient-warm py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 animate-fade-in">
          <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-semibold text-foreground">Compare Check-Ins</h1>
            <p className="text-sm text-muted-foreground">See what shifted between sessions</p>
          </div>
          <span className="text-3xl">🔄</span>
        </div>

        {/* Score comparison hero */}
        <div className="bg-card rounded-2xl p-6 shadow-card animate-fade-in">
          <div className="grid grid-cols-3 items-center text-center">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Before</p>
              <p className="text-xs text-muted-foreground mb-2">{formatDate(older.date)}</p>
              <span className="font-display text-3xl font-bold text-muted-foreground">{reportOld.kitchenScore}%</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl">→</span>
              <span className={`text-lg font-bold font-display ${scoreDiff > 0 ? 'text-sage-dark' : scoreDiff < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {scoreDiff > 0 ? '+' : ''}{scoreDiff}%
              </span>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">After</p>
              <p className="text-xs text-muted-foreground mb-2">{formatDate(newer.date)}</p>
              <span className="font-display text-3xl font-bold text-primary">{reportNew.kitchenScore}%</span>
            </div>
          </div>

          {/* Plate comparison */}
          <div className="mt-4 pt-4 border-t border-border">
            <MetricBar label="Plate fullness" emoji="🥣" valueA={older.data.plateScore} valueB={newer.data.plateScore} />
          </div>
        </div>

        {/* Insight card */}
        {(biggestGain.valueB - biggestGain.valueA !== 0 || biggestDrop.valueB - biggestDrop.valueA !== 0) && (
          <div className="bg-card rounded-2xl p-5 shadow-card border-l-4 border-primary animate-fade-in">
            <h2 className="font-display text-lg font-medium text-foreground mb-3">🔍 Key Shifts</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              {biggestGain.valueB - biggestGain.valueA > 0 && (
                <p>
                  <strong className="text-sage-dark">Biggest gain:</strong> {biggestGain.emoji} {biggestGain.label} went from {biggestGain.valueA} → {biggestGain.valueB} (+{biggestGain.valueB - biggestGain.valueA})
                </p>
              )}
              {biggestDrop.valueB - biggestDrop.valueA < 0 && (
                <p>
                  <strong className="text-destructive">Biggest drop:</strong> {biggestDrop.emoji} {biggestDrop.label} went from {biggestDrop.valueA} → {biggestDrop.valueB} ({biggestDrop.valueB - biggestDrop.valueA})
                </p>
              )}
              {biggestGain.valueB - biggestGain.valueA === 0 && biggestDrop.valueB - biggestDrop.valueA === 0 && (
                <p>No significant changes between these two check-ins.</p>
              )}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-4 text-[10px] text-muted-foreground px-1">
          <span className="flex items-center gap-1.5">
            <span className="w-6 h-2 rounded-full bg-primary/50" /> {formatDate(older.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-6 h-2 rounded-full bg-primary" /> {formatDate(newer.date)}
          </span>
        </div>

        {/* Section comparisons */}
        {sections.map((section) => (
          <section key={section.title} className="bg-card rounded-2xl p-5 shadow-card space-y-4 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{section.emoji}</span>
              <h2 className="font-display text-lg font-medium text-foreground">{section.title}</h2>
            </div>
            <div className="space-y-4">
              {section.metrics.map((m) => (
                <MetricBar key={m.label} {...m} />
              ))}
            </div>
          </section>
        ))}

        <div className="pt-2">
          <Button variant="outline" size="lg" onClick={onBack} className="w-full">
            Back to History
          </Button>
        </div>
      </div>
    </div>
  );
}
