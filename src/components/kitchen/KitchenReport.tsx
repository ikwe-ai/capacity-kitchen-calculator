import { useState } from 'react';
import { KitchenData, KitchenReport as KitchenReportType } from '@/types/kitchen';
import { calculateKitchenReport, getRunwayText, getScoreLabel, generateUnderestimatingInsight, generateDreamMealFeasibility } from '@/lib/kitchen-calculations';
import { ProgressBar } from './ProgressBar';
import { EmojiMeter } from './EmojiMeter';
import { WhatIfScenario } from './WhatIfScenario';
import { Button } from '@/components/ui/button';
import { Printer, Mail, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
interface KitchenReportProps {
  data: KitchenData;
  onRestart: () => void;
}

export function KitchenReport({ data, onRestart }: KitchenReportProps) {
  const report = calculateKitchenReport(data);
  const underestimatingInsight = generateUnderestimatingInsight(data, report);
  const dreamMealFeasibility = generateDreamMealFeasibility(data, report);
  const [showReflection, setShowReflection] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateReportText());
      setCopied(true);
      toast.success('Report copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy — try selecting and copying manually.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const generateReportText = () => {
    const lines = [
      '🍽️ Kitchen Reality Check',
      '',
      `🥣 Plate: ${report.plateLevel}/10 — ${data.plateDetails || 'Various things'}`,
      `🧊 Fridge: ${report.fridgeLevel}/10 (Sleep ${data.fridge.sleep}, Energy ${data.fridge.energy}, Food ${data.fridge.food}, Cash ${data.fridge.cash}, Emotional ${data.fridge.emotional})`,
      `🗄️ Cupboards: ${report.cupboardsLevel}/10 (Housing ${data.cupboards.housing}, Finance ${data.cupboards.finance}, Safety ${data.cupboards.safety}, Support ${data.cupboards.support}, Health ${data.cupboards.health})`,
      `🍱 Buffet: ${report.buffetLevel}/10 (Creativity ${data.buffet.creativity}, Skills ${data.buffet.skills}, Network ${data.buffet.network}, Vision ${data.buffet.vision}, Resilience ${data.buffet.resilience})`,
      '',
      `🔥 Kitchen Score: ${report.kitchenScore}%`,
      `Runway: ${getRunwayText(report.runway)}`,
      '',
      '🧂 Top Missing Ingredients:',
      ...report.missingIngredients.map((ing, i) => `  ${i + 1}. ${ing.name} (${ing.score}/10)`),
      '',
      `🥄 One Tiny Move: ${report.tinyMove}`,
    ];
    if (data.dreamMeal) {
      lines.push('', `🥘 Dream Meal: "${data.dreamMeal}" (effort: ${data.goalComplexity}/10)`);
    }
    if (underestimatingInsight) {
      lines.push('', `🪞 What You Might Be Underestimating: ${underestimatingInsight}`);
    }
    return lines.join('\n');
  };

  const handleEmailToSelf = () => {
    const subject = encodeURIComponent(`My Kitchen Check-In — ${report.kitchenScore}% capacity`);
    const body = encodeURIComponent(generateReportText());
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-gradient-warm py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in">
          <span className="text-5xl">🍽️</span>
          <h1 className="font-display text-3xl font-semibold text-foreground">
            Your Kitchen Reality Check
          </h1>
          <p className="text-muted-foreground text-sm">
            Here's what your kitchen actually looks like right now.
          </p>
          
          {/* Overall Kitchen Score Progress */}
          <div className="bg-card rounded-2xl p-5 shadow-card mt-4 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Overall Kitchen Capacity</span>
              <span className="font-display text-2xl font-bold text-primary">{report.kitchenScore}%</span>
            </div>
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-warm-orange transition-all duration-1000"
                style={{ width: `${report.kitchenScore}%` }}
              />
            </div>
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[
                { emoji: '🥣', label: 'Plate', value: report.plateLevel },
                { emoji: '🧊', label: 'Fridge', value: report.fridgeLevel },
                { emoji: '🗄️', label: 'Cupboards', value: report.cupboardsLevel },
                { emoji: '🍱', label: 'Buffet', value: report.buffetLevel },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <span className="text-lg">{item.emoji}</span>
                  <div className="h-2 bg-muted rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full rounded-full bg-primary/70 transition-all duration-700"
                      style={{ width: `${(item.value / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{Math.round(item.value)}/10</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plate Section */}
        <section className="bg-card rounded-2xl p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🥣</span>
            <h2 className="font-display text-xl font-medium text-foreground">
              Plate – What You're Carrying
            </h2>
          </div>
          <EmojiMeter value={report.plateLevel} emoji="🥣" className="mb-3" />
          <ProgressBar value={report.plateLevel} variant="plate" className="mb-3" />
          <p className="text-muted-foreground text-sm">
            Your plate is {getScoreLabel(report.plateLevel)} right now ({report.plateLevel}/10). 
            {report.plateLevel >= 7 && " That's a lot to carry. Be gentle with yourself."}
            {report.plateLevel >= 4 && report.plateLevel < 7 && " You've got a reasonable load, but watch for creep."}
            {report.plateLevel < 4 && " You have some breathing room—use it wisely."}
          </p>
          {data.plateDetails && (
            <div className="mt-3 flex flex-wrap gap-2">
              {data.plateDetails.split(', ').map((item) => {
                const emojiMap: Record<string, string> = {
                  'Work / hustle': '💼',
                  'Money stress': '💸',
                  'Health concerns': '🏥',
                  'Relationships': '💔',
                  'Caregiving': '🍼',
                  'Housing / living': '🏠',
                  'Life admin & errands': '📋',
                  'Emotional weight': '😮‍💨',
                  'Worry about future': '🔮',
                };
                return (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-xs font-medium text-muted-foreground"
                  >
                    {emojiMap[item] && <span>{emojiMap[item]}</span>}
                    {item}
                  </span>
                );
              })}
            </div>
          )}
        </section>

        {/* Fridge Section */}
        <section className="bg-card rounded-2xl p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🧊</span>
            <h2 className="font-display text-xl font-medium text-foreground">
              Fridge – Short-Term Reserves
            </h2>
          </div>
          <EmojiMeter value={report.fridgeLevel} emoji="🧊" className="mb-3" />
          
          <div className="space-y-3 mt-4">
            {[
              { label: 'Sleep reserve', value: data.fridge.sleep },
              { label: 'Physical energy', value: data.fridge.energy },
              { label: 'Food & basics', value: data.fridge.food },
              { label: 'Cash for the week', value: data.fridge.cash },
              { label: 'Emotional buffer', value: data.fridge.emotional },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <ProgressBar value={item.value} variant="fridge" className="w-32" showPercentage={false} />
              </div>
            ))}
          </div>
          
          <p className="text-muted-foreground text-sm mt-4">
            Fridge level: {getScoreLabel(report.fridgeLevel)}. 
            {report.fridgeLevel <= 4 && " Running low on immediate reserves — you're rationing, not living."}
            {report.fridgeLevel > 4 && report.fridgeLevel <= 7 && " You've got some buffer, but don't let it drain completely."}
            {report.fridgeLevel > 7 && " Well-stocked for the next few days!"}
          </p>
        </section>

        {/* Cupboards Section */}
        <section className="bg-card rounded-2xl p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🗄️</span>
            <h2 className="font-display text-xl font-medium text-foreground">
              Cupboards – Structural Stability
            </h2>
          </div>
          <EmojiMeter value={report.cupboardsLevel} emoji="🗄️" className="mb-3" />
          
          <div className="space-y-3 mt-4">
            {[
              { label: 'Housing stability', value: data.cupboards.housing },
              { label: 'Financial stability', value: data.cupboards.finance },
              { label: 'Emotional safety', value: data.cupboards.safety },
              { label: 'Support system', value: data.cupboards.support },
              { label: 'Health stability', value: data.cupboards.health },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <ProgressBar value={item.value} variant="cupboards" className="w-32" showPercentage={false} />
              </div>
            ))}
          </div>
          
          <p className="text-muted-foreground text-sm mt-4">
            Cupboards: {getScoreLabel(report.cupboardsLevel)}. 
            {report.cupboardsLevel <= 4 && " Some structural instability — these are harder to fix quickly but worth paying attention to."}
            {report.cupboardsLevel > 4 && report.cupboardsLevel <= 7 && " Reasonably stable foundation, though some shelves could use reinforcement."}
            {report.cupboardsLevel > 7 && " Strong structural support. This is a real asset."}
          </p>
        </section>

        {/* Buffet Section */}
        <section className="bg-card rounded-2xl p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🍱</span>
            <h2 className="font-display text-xl font-medium text-foreground">
              Buffet – Your Potential
            </h2>
          </div>
          <EmojiMeter value={report.buffetLevel} emoji="🍱" className="mb-3" />
          
          <div className="space-y-3 mt-4">
            {[
              { label: 'Creativity / ideas', value: data.buffet.creativity },
              { label: 'Skills / talent', value: data.buffet.skills },
              { label: 'Network', value: data.buffet.network },
              { label: 'Long-term vision', value: data.buffet.vision },
              { label: 'Inner resilience', value: data.buffet.resilience },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <ProgressBar value={item.value} variant="buffet" className="w-32" showPercentage={false} />
              </div>
            ))}
          </div>
          
          <p className="text-muted-foreground text-sm mt-4 border-t border-border pt-4">
            <strong className="text-foreground">Remember:</strong> Your potential is not the issue. 
            If your buffet is rich but you're struggling, it's about <em>conditions and resourcing</em>, 
            not who you are.
          </p>
        </section>

        {/* Kitchen Score */}
        <section className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-glow animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl">🔥</span>
            <h2 className="font-display text-2xl font-semibold">
              Kitchen Score & Runway
            </h2>
          </div>
          
          <div className="text-center mb-4">
            <div className="text-6xl font-display font-bold mb-2">
              {report.kitchenScore}%
            </div>
            <p className="text-primary-foreground/80">
              capacity online
            </p>
          </div>
          
          <p className="text-sm text-primary-foreground/90 mb-4">
            You're running at about {report.kitchenScore}% of your current capacity. 
            {report.kitchenScore < 50 
              ? " There's more in you, but your fridge and cupboards are severely limiting how much of your buffet you can access." 
              : report.kitchenScore < 75 
              ? " There's more in you, but your fridge and cupboards are limiting how much of your buffet you can actually plate." 
              : " You have solid capacity online — the key is using it wisely."}
          </p>
          
          <div className="bg-primary-foreground/10 rounded-xl p-4">
            <h3 className="font-medium mb-2">Runway</h3>
            <p className="text-sm text-primary-foreground/90">
              {getRunwayText(report.runway)}
            </p>
          </div>
        </section>

        {/* What You Might Be Underestimating */}
        {underestimatingInsight && (
          <section className="bg-card rounded-2xl p-6 shadow-card border-l-4 border-primary animate-slide-up" style={{ animationDelay: '0.55s' }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🪞</span>
              <h2 className="font-display text-xl font-medium text-foreground">
                What You Might Be Underestimating
              </h2>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {underestimatingInsight}
            </p>
          </section>
        )}

        {/* Dream Meal vs Today's Kitchen */}
        {data.dreamMeal && (
          <section className="bg-card rounded-2xl p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🥘</span>
              <h2 className="font-display text-xl font-medium text-foreground">
                Dream Meal vs Today's Kitchen
              </h2>
            </div>
            <p className="text-foreground font-medium mb-2">
              "{data.dreamMeal}"
            </p>
            <EmojiMeter value={data.goalComplexity} emoji="🍝" className="mb-3" />
            <p className="text-sm text-muted-foreground mb-3">
              Effort level: {getScoreLabel(data.goalComplexity)}
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed border-t border-border pt-3">
              {dreamMealFeasibility}
            </p>
          </section>
        )}

        {/* Missing Ingredients */}
        <section className="bg-card rounded-2xl p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.7s' }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🧂</span>
            <h2 className="font-display text-xl font-medium text-foreground">
              Top Missing Ingredients
            </h2>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            These are your thinnest shelves — strengthening even one unlocks more of your buffet.
          </p>
          <ol className="space-y-3">
            {report.missingIngredients.map((ingredient, index) => (
              <li key={ingredient.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                  {index + 1}
                </span>
                <span className="text-foreground flex-1">{ingredient.name}</span>
                <span className="text-sm text-muted-foreground">
                  {ingredient.score}/10
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* Tiny Move */}
        <section className="bg-secondary rounded-2xl p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🥄</span>
            <h2 className="font-display text-xl font-medium text-secondary-foreground">
              One Tiny Move to Extend Survival
            </h2>
          </div>
          <p className="text-secondary-foreground leading-relaxed">
            If you did just <strong>one small thing</strong> this week to extend your survival and capacity:
          </p>
          <p className="text-secondary-foreground leading-relaxed mt-3 pl-4 border-l-2 border-secondary-foreground/20 italic">
            {report.tinyMove}
          </p>
        </section>

        {/* What If Scenarios */}
        <section className="bg-card rounded-2xl p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.85s' }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🔁</span>
            <h2 className="font-display text-xl font-medium text-foreground">
              What If...?
            </h2>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            Tap a scenario to see how one change would shift your Kitchen Score.
          </p>
          <WhatIfScenario data={data} />
        </section>

        {/* Reflection Prompt */}
        <section className="bg-card rounded-2xl p-6 shadow-card animate-slide-up" style={{ animationDelay: '0.9s' }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">💬</span>
            <h2 className="font-display text-xl font-medium text-foreground">
              One Last Thing
            </h2>
          </div>
          {!showReflection ? (
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm">
                When you look at all this, take a moment to notice:
              </p>
              <ul className="text-muted-foreground text-sm space-y-1">
                <li>• What feels the most true?</li>
                <li>• What, if anything, feels confronting or different from how you usually describe your situation to yourself?</li>
              </ul>
              <Button variant="outline" size="sm" onClick={() => setShowReflection(true)} className="mt-2">
                I've reflected on this
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm leading-relaxed">
              Thank you for sitting with that. Remember — this isn't about your worth. It's about your conditions. 
              And conditions can change, especially when you see them clearly. 💛
            </p>
          )}
        </section>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-4 animate-fade-in print:hidden" style={{ animationDelay: '1s' }}>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="lg" onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button variant="outline" size="lg" onClick={handleEmailToSelf} className="gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Button>
            <Button variant="outline" size="lg" onClick={handleCopyToClipboard} className="gap-2">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <Button variant="warm" size="lg" onClick={onRestart} className="w-full">
            Do Another Check-In
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            This isn't about your worth. It's about your conditions. 💛
          </p>
        </div>
      </div>
    </div>
  );
}
