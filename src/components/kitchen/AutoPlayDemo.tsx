import { useState, useEffect } from 'react';
import { ProgressBar } from './ProgressBar';

interface DemoStep {
  emoji: string;
  label: string;
  description: string;
  sampleValues?: { label: string; value: number }[];
  variant?: 'plate' | 'fridge' | 'cupboards' | 'buffet';
}

const DEMO_STEPS: DemoStep[] = [
  {
    emoji: '🥣',
    label: 'Plate',
    description: 'Rate how full your life feels right now',
    sampleValues: [{ label: 'Fullness', value: 7 }],
    variant: 'plate',
  },
  {
    emoji: '🧊',
    label: 'Fridge',
    description: 'Check your short-term reserves',
    sampleValues: [
      { label: 'Sleep', value: 4 },
      { label: 'Energy', value: 5 },
      { label: 'Food', value: 7 },
      { label: 'Cash', value: 3 },
      { label: 'Emotional', value: 6 },
    ],
    variant: 'fridge',
  },
  {
    emoji: '🗄️',
    label: 'Cupboards',
    description: 'Assess your medium-term stability',
    sampleValues: [
      { label: 'Housing', value: 8 },
      { label: 'Finance', value: 4 },
      { label: 'Safety', value: 6 },
      { label: 'Support', value: 5 },
      { label: 'Health', value: 7 },
    ],
    variant: 'cupboards',
  },
  {
    emoji: '🍱',
    label: 'Buffet',
    description: 'Discover your inner potential',
    sampleValues: [
      { label: 'Creativity', value: 8 },
      { label: 'Skills', value: 7 },
      { label: 'Network', value: 4 },
      { label: 'Vision', value: 6 },
      { label: 'Resilience', value: 9 },
    ],
    variant: 'buffet',
  },
  {
    emoji: '🥘',
    label: 'Dream Meal',
    description: 'Name the goal you want to cook toward',
  },
  {
    emoji: '📋',
    label: 'Report',
    description: 'Get your personalised Kitchen Score',
    sampleValues: [{ label: 'Kitchen Score', value: 6 }],
    variant: 'plate',
  },
];

export function AutoPlayDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % DEMO_STEPS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Animate values when step changes
  useEffect(() => {
    const step = DEMO_STEPS[activeStep];
    if (!step.sampleValues) {
      setAnimatedValues({});
      return;
    }

    // Start from 0
    const initial: Record<string, number> = {};
    step.sampleValues.forEach((v) => (initial[v.label] = 0));
    setAnimatedValues(initial);

    // Animate to target
    const timeout = setTimeout(() => {
      const target: Record<string, number> = {};
      step.sampleValues!.forEach((v) => (target[v.label] = v.value));
      setAnimatedValues(target);
    }, 200);

    return () => clearTimeout(timeout);
  }, [activeStep]);

  const currentStep = DEMO_STEPS[activeStep];
  const progress = ((activeStep + 1) / DEMO_STEPS.length) * 100;

  return (
    <div className="bg-card rounded-2xl p-5 shadow-card space-y-4 overflow-hidden">
      {/* Overall progress */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Demo</span>
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {activeStep + 1}/{DEMO_STEPS.length}
        </span>
      </div>

      {/* Step indicators */}
      <div className="flex justify-between gap-1">
        {DEMO_STEPS.map((step, i) => (
          <button
            key={step.label}
            onClick={() => setActiveStep(i)}
            className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-xl transition-all duration-300 ${
              i === activeStep
                ? 'bg-primary/10 scale-105'
                : 'opacity-50 hover:opacity-75'
            }`}
          >
            <span className="text-lg">{step.emoji}</span>
            <span className="text-[10px] font-medium text-muted-foreground leading-tight">
              {step.label}
            </span>
          </button>
        ))}
      </div>

      {/* Active step content */}
      <div className="min-h-[120px] animate-fade-in" key={activeStep}>
        <p className="text-foreground font-medium text-sm mb-3">
          {currentStep.emoji} {currentStep.description}
        </p>

        {currentStep.sampleValues && currentStep.variant && (
          <div className="space-y-2">
            {currentStep.sampleValues.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-20 truncate">
                  {item.label}
                </span>
                <div className="flex-1">
                  <ProgressBar
                    value={animatedValues[item.label] ?? 0}
                    variant={currentStep.variant}
                    showPercentage={false}
                  />
                </div>
                <span className="text-xs font-medium text-muted-foreground w-6 text-right">
                  {animatedValues[item.label] ?? 0}
                </span>
              </div>
            ))}
          </div>
        )}

        {!currentStep.sampleValues && (
          <div className="bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground italic">
            "I want to launch my freelance business..." — effort: 7/10
          </div>
        )}
      </div>
    </div>
  );
}
