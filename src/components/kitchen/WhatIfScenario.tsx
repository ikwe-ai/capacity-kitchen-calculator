import { useState } from 'react';
import { KitchenData } from '@/types/kitchen';
import { calculateWhatIfScore } from '@/lib/kitchen-calculations';
import { Button } from '@/components/ui/button';

interface WhatIfScenarioProps {
  data: KitchenData;
}

const scenarios = [
  { label: '😴 +2 hours sleep', changes: { sleep: 2 }, description: 'What if you got 2 more hours of sleep consistently?' },
  { label: '💰 +$100/week buffer', changes: { cash: 2, finance: 1 }, description: 'What if you had an extra $100/week for basics?' },
  { label: '🍽️ Cut one obligation', changes: { plateScore: -2 }, description: 'What if you dropped one thing from your plate?' },
  { label: '🤝 One supportive call', changes: { emotional: 1, support: 1 }, description: 'What if you had one solid supportive conversation this week?' },
  { label: '🏃 Daily 15-min walk', changes: { energy: 2 }, description: 'What if you moved your body for 15 minutes daily?' },
];

export function WhatIfScenario({ data }: WhatIfScenarioProps) {
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    setSelectedScenario(selectedScenario === index ? null : index);
  };

  const result = selectedScenario !== null 
    ? calculateWhatIfScore(data, scenarios[selectedScenario].changes) 
    : null;

  const scoreDiff = result ? result.newScore - result.oldScore : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {scenarios.map((scenario, index) => (
          <Button
            key={index}
            variant={selectedScenario === index ? 'warm' : 'outline'}
            size="sm"
            onClick={() => handleSelect(index)}
            className="text-sm"
          >
            {scenario.label}
          </Button>
        ))}
      </div>

      {result && selectedScenario !== null && (
        <div className="bg-muted/50 rounded-xl p-4 space-y-3 animate-fade-in">
          <p className="text-sm text-muted-foreground">
            {scenarios[selectedScenario].description}
          </p>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-display font-bold text-muted-foreground">{result.oldScore}%</div>
              <div className="text-xs text-muted-foreground">Now</div>
            </div>
            <div className="text-2xl text-muted-foreground">→</div>
            <div className="text-center">
              <div className="text-2xl font-display font-bold text-primary">{result.newScore}%</div>
              <div className="text-xs text-muted-foreground">After</div>
            </div>
            <div className={`text-sm font-medium px-2 py-1 rounded-full ${
              scoreDiff > 0 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            }`}>
              {scoreDiff > 0 ? '+' : ''}{scoreDiff}%
            </div>
          </div>
          
          <p className="text-sm text-foreground">
            {scoreDiff >= 10 
              ? 'That\'s a significant shift. This one change would meaningfully extend your runway.' 
              : scoreDiff >= 5 
              ? 'A noticeable improvement. Small changes like this compound over time.' 
              : scoreDiff > 0 
              ? 'Every point matters when you\'re running lean. This would give you a bit more breathing room.' 
              : 'This wouldn\'t change much on paper, but it might shift how things feel internally.'}
          </p>
        </div>
      )}
    </div>
  );
}
