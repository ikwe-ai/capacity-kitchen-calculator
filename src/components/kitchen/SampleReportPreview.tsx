import { ProgressBar } from './ProgressBar';

const sampleData = {
  kitchenScore: 47,
  areas: [
    { emoji: '🥣', label: 'Plate', value: 7.2 },
    { emoji: '🧊', label: 'Fridge', value: 4.8 },
    { emoji: '🗄️', label: 'Cupboards', value: 5.5 },
    { emoji: '🍱', label: 'Buffet', value: 7.0 },
  ],
  missingIngredients: [
    { name: 'Sleep reserve', score: 3 },
    { name: 'Cash for the week', score: 4 },
    { name: 'Emotional buffer', score: 4 },
  ],
  tinyMove: 'Get one full night of sleep this week — even if it means saying no to something.',
  plateChips: [
    { emoji: '💼', label: 'Work' },
    { emoji: '💸', label: 'Money stress' },
    { emoji: '😮‍💨', label: 'Emotional weight' },
  ],
};

export function SampleReportPreview() {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-card space-y-4 text-left">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Sample Report Preview</h3>
        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">example</span>
      </div>

      {/* Kitchen Score */}
      <div className="bg-primary text-primary-foreground rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Kitchen Score</span>
          <span className="font-display text-2xl font-bold">{sampleData.kitchenScore}%</span>
        </div>
        <div className="h-3 bg-primary-foreground/20 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-primary-foreground/80 transition-all duration-1000"
            style={{ width: `${sampleData.kitchenScore}%` }}
          />
        </div>
      </div>

      {/* Area bars */}
      <div className="grid grid-cols-4 gap-2">
        {sampleData.areas.map((item) => (
          <div key={item.label} className="text-center">
            <span className="text-lg">{item.emoji}</span>
            <div className="h-2 bg-muted rounded-full overflow-hidden mt-1">
              <div
                className="h-full rounded-full bg-primary/70 transition-all duration-700"
                style={{ width: `${(item.value / 10) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">{item.value}/10</span>
          </div>
        ))}
      </div>

      {/* Plate chips */}
      <div className="flex flex-wrap gap-1.5">
        {sampleData.plateChips.map((chip) => (
          <span
            key={chip.label}
            className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-[11px] text-muted-foreground"
          >
            <span>{chip.emoji}</span>
            {chip.label}
          </span>
        ))}
      </div>

      {/* Missing ingredients */}
      <div className="space-y-1.5">
        <span className="text-xs font-medium text-muted-foreground">🧂 Top Missing Ingredients</span>
        {sampleData.missingIngredients.map((ing, i) => (
          <div key={ing.name} className="flex items-center gap-2 text-xs">
            <span className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-[10px] text-muted-foreground shrink-0">
              {i + 1}
            </span>
            <span className="flex-1 text-foreground">{ing.name}</span>
            <span className="text-muted-foreground">{ing.score}/10</span>
          </div>
        ))}
      </div>

      {/* Tiny move */}
      <div className="bg-secondary rounded-lg p-3">
        <span className="text-xs font-medium text-secondary-foreground">🥄 One Tiny Move</span>
        <p className="text-xs text-secondary-foreground/80 mt-1">{sampleData.tinyMove}</p>
      </div>
    </div>
  );
}
