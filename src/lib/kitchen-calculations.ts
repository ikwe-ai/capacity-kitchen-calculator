import { KitchenData, KitchenReport } from '@/types/kitchen';

export function calculateAverage(scores: object): number {
  const values = Object.values(scores) as number[];
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function calculateKitchenReport(data: KitchenData): KitchenReport {
  const fridgeAvg = calculateAverage(data.fridge);
  const cupboardsAvg = calculateAverage(data.cupboards);
  const buffetAvg = calculateAverage(data.buffet);

  // Kitchen Score calculation
  const baseCapacity = ((fridgeAvg + cupboardsAvg) / 20) * 100;
  const platePenalty = (data.plateScore - 5) * 5;
  const kitchenScore = Math.max(0, Math.min(100, baseCapacity - platePenalty));

  // Runway calculation
  const resourceAvg = (fridgeAvg + cupboardsAvg) / 2;
  let runway: KitchenReport['runway'];
  if (resourceAvg <= 3) runway = 'very-short';
  else if (resourceAvg <= 5) runway = 'short';
  else if (resourceAvg <= 7) runway = 'medium';
  else runway = 'solid';

  // Find missing ingredients (lowest scores)
  const allScores: Array<{ name: string; score: number; category: string }> = [
    { name: 'Sleep reserve', score: data.fridge.sleep, category: 'fridge' },
    { name: 'Physical energy', score: data.fridge.energy, category: 'fridge' },
    { name: 'Food & basics', score: data.fridge.food, category: 'fridge' },
    { name: 'Cash for the week', score: data.fridge.cash, category: 'fridge' },
    { name: 'Emotional buffer', score: data.fridge.emotional, category: 'fridge' },
    { name: 'Housing stability', score: data.cupboards.housing, category: 'cupboards' },
    { name: 'Financial stability', score: data.cupboards.finance, category: 'cupboards' },
    { name: 'Emotional safety', score: data.cupboards.safety, category: 'cupboards' },
    { name: 'Support system', score: data.cupboards.support, category: 'cupboards' },
    { name: 'Health stability', score: data.cupboards.health, category: 'cupboards' },
  ];

  const missingIngredients = [...allScores]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  // Generate tiny move suggestion based on lowest score
  const lowestIngredient = missingIngredients[0];
  const tinyMove = generateTinyMove(lowestIngredient);

  return {
    plateLevel: data.plateScore,
    fridgeLevel: fridgeAvg,
    cupboardsLevel: cupboardsAvg,
    buffetLevel: buffetAvg,
    kitchenScore: Math.round(kitchenScore),
    runway,
    missingIngredients,
    tinyMove,
  };
}

export function generateUnderestimatingInsight(data: KitchenData, report: KitchenReport): string | null {
  const selfPerception = (data.selfPerception || '').toLowerCase();
  const kitchenScore = report.kitchenScore;
  
  // Detect minimizing language
  const minimizingWords = ['fine', 'okay', 'just busy', 'not that bad', 'could be worse', 'managing', 'alright', 'just tired'];
  const isMinimizing = minimizingWords.some(w => selfPerception.includes(w));
  
  // Detect crisis indicators
  const crisisWords = ['barely', 'drowning', 'breaking', 'can\'t', 'falling apart', 'overwhelm', 'survive', 'collapse'];
  const isCrisis = crisisWords.some(w => selfPerception.includes(w));
  
  if (isMinimizing && kitchenScore < 50) {
    return `You described your situation as "${data.selfPerception}" — but when we look at your fridge and cupboards together, it looks more like you're in short-runway survival mode. That doesn't mean you're failing. It means you've been carrying more than your system is built for right now, and you've gotten so used to it that it feels "normal."`;
  }
  
  if (isMinimizing && kitchenScore < 70) {
    return `You said "${data.selfPerception}" — and that might be true on the surface. But some of your scores tell a different story. The gap between how you describe things and what's actually happening is worth noticing. You might be under-calling your struggle because you've learned to push through.`;
  }
  
  if (isCrisis && kitchenScore >= 60) {
    return `You said "${data.selfPerception}" — and I hear how heavy that feels. Interestingly, your actual resources are more solid than you might think. Sometimes when we're exhausted, everything looks worse than it structurally is. Your feelings are valid AND you have more to work with than it feels like right now.`;
  }
  
  if (!data.selfPerception) return null;
  
  // General insight based on score
  if (kitchenScore < 40) {
    return `Based on everything you've shared, you're running at ${kitchenScore}% capacity. That's not "just busy" — that's survival mode. And if you've been here for a while, you might not even realize how depleted you are because this has become your baseline.`;
  }
  
  return null;
}

export function generateDreamMealFeasibility(data: KitchenData, report: KitchenReport): string {
  const ratio = report.kitchenScore / (data.goalComplexity * 10 || 1);
  
  if (ratio < 0.7) {
    return `With your kitchen running at ${report.kitchenScore}% and this being a ${getScoreLabel(data.goalComplexity)}-effort meal, this is a stretch right now. That doesn't mean "don't try" — it means consider plating a smaller appetizer version first. What's the smallest slice of this dream meal you could serve this week without burning the kitchen down?`;
  }
  
  if (ratio < 1.2) {
    return `This goal is doable with your current resources, but it'll take most of what you've got. Pace yourself — you don't have a lot of buffer for surprises. Think "slow cook" rather than "microwave."`;
  }
  
  return `Your kitchen has enough capacity for this. The key is making sure you actually use your resources instead of hoarding them "just in case." You have permission to plate this meal.`;
}

export function calculateWhatIfScore(data: KitchenData, changes: Record<string, number>): { newScore: number; oldScore: number } {
  const oldReport = calculateKitchenReport(data);
  
  // Apply changes to a copy of the data
  const modifiedData = JSON.parse(JSON.stringify(data)) as KitchenData;
  
  for (const [key, delta] of Object.entries(changes)) {
    if (key in modifiedData.fridge) {
      (modifiedData.fridge as any)[key] = Math.min(10, Math.max(0, (modifiedData.fridge as any)[key] + delta));
    } else if (key in modifiedData.cupboards) {
      (modifiedData.cupboards as any)[key] = Math.min(10, Math.max(0, (modifiedData.cupboards as any)[key] + delta));
    } else if (key === 'plateScore') {
      modifiedData.plateScore = Math.min(10, Math.max(0, modifiedData.plateScore + delta));
    }
  }
  
  const newReport = calculateKitchenReport(modifiedData);
  
  return {
    oldScore: oldReport.kitchenScore,
    newScore: newReport.kitchenScore,
  };
}

function generateTinyMove(ingredient: { name: string; score: number; category: string }): string {
  const suggestions: Record<string, string> = {
    'Sleep reserve': 'Tonight, try going to bed just 20 minutes earlier. Put your phone in another room. Small sleep wins compound fast.',
    'Physical energy': 'Take one 10-minute walk today—around the block, to get coffee, anywhere. Movement creates energy.',
    'Food & basics': 'Stock up on 3 easy meals you can grab without thinking—frozen stuff, snacks, whatever works. Future you will thank you.',
    'Cash for the week': 'Look at your next 3 days of spending. Is there one small thing you can skip or delay? Even $10 creates breathing room.',
    'Emotional buffer': 'Text one person today who makes you feel lighter. You don\'t have to talk about hard stuff—just connect.',
    'Housing stability': 'If housing feels shaky, write down one concrete next step you could take this week (call, research, ask someone).',
    'Financial stability': 'Check one financial thing you\'ve been avoiding—a bill, a balance, an email. Information reduces anxiety.',
    'Emotional safety': 'Notice where in your space you feel most at ease. Spend 15 minutes there today, doing nothing productive.',
    'Support system': 'Think of someone who\'s offered help before. Ask them for one small, specific thing this week.',
    'Health stability': 'Schedule one health-related thing you\'ve been putting off. Just the appointment. You don\'t have to solve it all.',
  };

  return suggestions[ingredient.name] || 'Focus on the area that feels most within your control right now. Even a tiny improvement matters.';
}

export function getRunwayText(runway: KitchenReport['runway']): string {
  switch (runway) {
    case 'very-short':
      return 'Very short runway — just a few days before something gives. You\'re running on fumes. Prioritize immediate refills over ambition right now.';
    case 'short':
      return 'Short runway. You can push for a bit, but this pace isn\'t sustainable for weeks. Something needs to get easier or something needs to come off the plate.';
    case 'medium':
      return 'Medium runway. You have some buffer, but keep an eye on what\'s draining fastest. Don\'t mistake "getting by" for "doing well."';
    case 'solid':
      return 'Solid runway. You can sustain this for a while if you keep refilling as you go. Use this stability to make moves, not just coast.';
  }
}

export function generateEmojiBar(value: number, max: number = 10, filledEmoji: string = '█', emptyEmoji: string = '░'): string {
  const normalized = Math.round((value / max) * 10);
  return filledEmoji.repeat(normalized) + emptyEmoji.repeat(10 - normalized);
}

export function getScoreLabel(score: number): string {
  if (score <= 2) return 'very low';
  if (score <= 4) return 'low';
  if (score <= 6) return 'medium';
  if (score <= 8) return 'good';
  return 'high';
}
