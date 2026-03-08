import { useState, useRef, useEffect } from 'react';
import { CheckInStep, KitchenData, Message } from '@/types/kitchen';
import { Button } from '@/components/ui/button';
import { ChatMessage } from './ChatMessage';
import { SliderAction } from './actions/SliderAction';
import { ChipSelectAction } from './actions/ChipSelectAction';
import { MultiSliderAction } from './actions/MultiSliderAction';
import { TextWithSliderAction } from './actions/TextWithSliderAction';
import { ArrowLeft } from 'lucide-react';

interface CheckInFlowProps {
  onComplete: (data: KitchenData) => void;
  onBack: () => void;
}

const initialKitchenData: KitchenData = {
  plateScore: 5,
  plateDetails: '',
  fridge: { sleep: 5, energy: 5, food: 5, cash: 5, emotional: 5 },
  cupboards: { housing: 5, finance: 5, safety: 5, support: 5, health: 5 },
  buffet: { creativity: 5, skills: 5, network: 5, vision: 5, resilience: 5 },
  dreamMeal: '',
  goalComplexity: 5,
  selfPerception: '',
};

const STEPS: CheckInStep[] = ['plate', 'plate-details', 'fridge', 'cupboards', 'buffet', 'dream-meal', 'self-perception'];

export function CheckInFlow({ onComplete, onBack }: CheckInFlowProps) {
  const [step, setStep] = useState<CheckInStep>('plate');
  const [messages, setMessages] = useState<Message[]>([]);
  const [kitchenData, setKitchenData] = useState<KitchenData>(initialKitchenData);
  const [isTyping, setIsTyping] = useState(false);
  const [showAction, setShowAction] = useState(false);
  const [plateSlider, setPlateSlider] = useState(5);
  const [plateCategories, setPlateCategories] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showAction]);

  useEffect(() => {
    addAssistantMessage(getStepMessage('plate'), true);
  }, []);

  const addAssistantMessage = (content: string, revealAction = true) => {
    setShowAction(false);
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content,
        timestamp: new Date(),
      }]);
      setIsTyping(false);
      if (revealAction) {
        setTimeout(() => setShowAction(true), 200);
      }
    }, 500);
  };

  const addUserMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }]);
    setShowAction(false);
  };

  const getStepMessage = (s: CheckInStep): string => {
    switch (s) {
      case 'plate':
        return "Let's start with your plate 🥣\n\nHow full does your life feel right now? Slide to where this week lands.";
      case 'plate-details':
        return "What's taking up most of that plate? Tap everything that applies.";
      case 'fridge':
        return "Now let's check your fridge 🧊 — what you've actually got for the next 1–3 days.\n\nSlide each one to where it feels right.";
      case 'cupboards':
        return "Time to open the cupboards 🗄️ — the stuff you can somewhat rely on over the next few months.\n\nAdjust each shelf.";
      case 'buffet':
        return "Now the buffet 🍱 — this isn't about your current energy. This is about what exists *in you*.\n\nRate your inner resources.";
      case 'dream-meal':
        return "Finally, what's your Dream Meal? 🥘\n\nWhat's the main thing you'd love to move forward? And how big does it feel?";
      case 'self-perception':
        return "One more thing before your Kitchen Report 📋\n\nHow would you describe your overall situation right now?";
      default:
        return '';
    }
  };

  const advanceStep = (nextStep: CheckInStep, reflectionMsg: string) => {
    setTimeout(() => {
      addAssistantMessage(`${reflectionMsg}\n\n${getStepMessage(nextStep)}`);
      setStep(nextStep);
    }, 300);
  };

  // === STEP HANDLERS ===

  const handlePlateConfirm = (value: number) => {
    setKitchenData(prev => ({ ...prev, plateScore: value }));
    addUserMessage(`My plate feels like ${value}/10`);

    const reflection = value >= 7
      ? `${value}/10 — that's a heavy plate. No wonder things feel intense.`
      : value >= 4
      ? `${value}/10 — a decent amount on there. Not empty, not spilling.`
      : `${value}/10 — some breathing room. That's something.`;

    advanceStep('plate-details', reflection);
  };

  const handlePlateDetailsSelect = (value: string) => {
    setPlateCategories(prev => 
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const handlePlateDetailsConfirm = () => {
    const labels: Record<string, string> = {
      work: 'Work / hustle',
      money: 'Money stress',
      health: 'Health concerns',
      relationships: 'Relationships',
      caregiving: 'Caregiving',
      housing: 'Housing / living situation',
      admin: 'Life admin & errands',
      emotions: 'Emotional weight',
      future: 'Worry about the future',
    };
    const selected = plateCategories.map(c => labels[c] || c);
    const details = selected.join(', ');
    setKitchenData(prev => ({ ...prev, plateDetails: details }));
    addUserMessage(details || 'A mix of things');

    const count = plateCategories.length;
    const reflection = count >= 5
      ? `That's a lot of burners going at once — ${count} areas pulling at you. No wonder the plate feels full.`
      : count >= 3
      ? `${count} things competing for your attention. That adds up fast.`
      : count >= 1
      ? `Got it — ${details}. Even one or two big things can fill a plate.`
      : 'A mix of things. Let\'s keep going.';

    advanceStep('fridge', reflection);
  };

  const handleFridgeConfirm = (values: Record<string, number>) => {
    const fridge = {
      sleep: values.sleep,
      energy: values.energy,
      food: values.food,
      cash: values.cash,
      emotional: values.emotional,
    };
    setKitchenData(prev => ({ ...prev, fridge }));

    const avg = Math.round(Object.values(fridge).reduce((a, b) => a + b, 0) / 5);
    const lowest = Object.entries(fridge).sort(([, a], [, b]) => a - b)[0];
    addUserMessage(`Sleep: ${fridge.sleep} · Energy: ${fridge.energy} · Food: ${fridge.food} · Cash: ${fridge.cash} · Emotional: ${fridge.emotional}`);

    const reflection = avg <= 3
      ? `Fridge is looking pretty rationed — you're running on fumes.${lowest[1] <= 2 ? ` ${lowest[0]} is particularly low. That matters more than people usually think.` : ''}`
      : avg <= 5
      ? `Thinly stocked — enough to get by but not much buffer.${lowest[1] <= 3 ? ` I notice ${lowest[0]} is on the low side.` : ''}`
      : avg <= 7
      ? 'Moderately stocked fridge. You have some buffer to work with.'
      : 'Well-stocked for the next few days!';

    advanceStep('cupboards', reflection);
  };

  const handleCupboardsConfirm = (values: Record<string, number>) => {
    const cupboards = {
      housing: values.housing,
      finance: values.finance,
      safety: values.safety,
      support: values.support,
      health: values.health,
    };
    setKitchenData(prev => ({ ...prev, cupboards }));

    const avg = Math.round(Object.values(cupboards).reduce((a, b) => a + b, 0) / 5);
    addUserMessage(`Housing: ${cupboards.housing} · Finance: ${cupboards.finance} · Safety: ${cupboards.safety} · Support: ${cupboards.support} · Health: ${cupboards.health}`);

    const reflection = avg <= 3
      ? 'Some of those shelves are barely holding. That\'s not easy to live with.'
      : avg <= 5
      ? 'Thin but standing. Not crisis, but not solid either.'
      : avg <= 7
      ? 'Reasonably steady structural stability.'
      : 'Solid cupboards — that\'s a real asset.';

    advanceStep('buffet', reflection);
  };

  const handleBuffetConfirm = (values: Record<string, number>) => {
    const buffet = {
      creativity: values.creativity,
      skills: values.skills,
      network: values.network,
      vision: values.vision,
      resilience: values.resilience,
    };
    setKitchenData(prev => ({ ...prev, buffet }));

    const avg = Math.round(Object.values(buffet).reduce((a, b) => a + b, 0) / 5);
    addUserMessage(`Creativity: ${buffet.creativity} · Skills: ${buffet.skills} · Network: ${buffet.network} · Vision: ${buffet.vision} · Resilience: ${buffet.resilience}`);

    const reflection = avg >= 7
      ? 'Your buffet is rich. There\'s a lot in you — the challenge isn\'t potential, it\'s conditions.'
      : avg >= 4
      ? 'There\'s good stuff in your buffet. Even if it doesn\'t feel accessible right now, it\'s there.'
      : 'Your buffet might feel thin right now, and that\'s okay. Survival mode shrinks what we can see of ourselves.';

    advanceStep('dream-meal', reflection);
  };

  const handleDreamMealConfirm = (text: string, complexity: number) => {
    setKitchenData(prev => ({ ...prev, dreamMeal: text, goalComplexity: complexity }));
    addUserMessage(`"${text}" — effort: ${complexity}/10`);

    const reflection = complexity >= 7
      ? `"${text}" — that's a big meal to cook, especially with everything else on your plate.`
      : complexity >= 4
      ? `"${text}" — a solid-sized project.`
      : `"${text}" — manageable goal. Good instinct.`;

    advanceStep('self-perception', reflection);
  };

  const handleSelfPerceptionSelect = (value: string) => {
    const labels: Record<string, string> = {
      'okay-busy': "I'm okay, just busy",
      'stretched': "Stretched thin but managing",
      'surviving': "In survival mode",
      'barely': "Barely holding on",
    };
    const label = labels[value] || value;
    setKitchenData(prev => ({ ...prev, selfPerception: label }));
    addUserMessage(label);

    setTimeout(() => {
      addAssistantMessage(
        `Got it — "${label}"\n\nI'll hold that next to everything you've shared. Let me put together your Kitchen Report now... 🍳`,
        false
      );

      setTimeout(() => {
        onComplete({
          ...kitchenData,
          selfPerception: label,
        });
      }, 1500);
    }, 300);
  };

  const getStepProgress = (): number => {
    return ((STEPS.indexOf(step) + 1) / STEPS.length) * 100;
  };

  // === RENDER ACTION FOR CURRENT STEP ===
  const renderAction = () => {
    if (!showAction) return null;

    switch (step) {
      case 'plate':
        return (
          <SliderAction
            value={plateSlider}
            onChange={setPlateSlider}
            onConfirm={handlePlateConfirm}
            lowLabel="Weirdly bored"
            highLabel="Spilling everywhere"
            emoji="🥣"
          />
        );

      case 'plate-details':
        return (
          <div className="space-y-3 animate-fade-in">
            <ChipSelectAction
              columns={2}
              multiSelect
              selected={plateCategories}
              options={[
                { label: 'Work / hustle', value: 'work', emoji: '💼' },
                { label: 'Money stress', value: 'money', emoji: '💸' },
                { label: 'Health concerns', value: 'health', emoji: '🏥' },
                { label: 'Relationships', value: 'relationships', emoji: '💔' },
                { label: 'Caregiving', value: 'caregiving', emoji: '🍼' },
                { label: 'Housing / living', value: 'housing', emoji: '🏠' },
                { label: 'Life admin & errands', value: 'admin', emoji: '📋' },
                { label: 'Emotional weight', value: 'emotions', emoji: '😮‍💨' },
                { label: 'Worry about future', value: 'future', emoji: '🔮' },
              ]}
              onSelect={handlePlateDetailsSelect}
            />
            <button
              onClick={handlePlateDetailsConfirm}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              That covers it
            </button>
          </div>
        );

      case 'fridge':
        return (
          <MultiSliderAction
            items={[
              { key: 'sleep', label: 'Sleep reserve', emoji: '😴' },
              { key: 'energy', label: 'Physical energy', emoji: '⚡' },
              { key: 'food', label: 'Food & basics covered', emoji: '🥫' },
              { key: 'cash', label: 'Cash for the week', emoji: '💵' },
              { key: 'emotional', label: 'Emotional buffer', emoji: '🧘' },
            ]}
            onConfirm={handleFridgeConfirm}
          />
        );

      case 'cupboards':
        return (
          <MultiSliderAction
            items={[
              { key: 'housing', label: 'Housing stability', emoji: '🏠' },
              { key: 'finance', label: 'Financial stability (1–6 months)', emoji: '💰' },
              { key: 'safety', label: 'Emotional safety', emoji: '🛡️' },
              { key: 'support', label: 'Support system', emoji: '🤝' },
              { key: 'health', label: 'Health stability', emoji: '❤️‍🩹' },
            ]}
            onConfirm={handleCupboardsConfirm}
          />
        );

      case 'buffet':
        return (
          <MultiSliderAction
            items={[
              { key: 'creativity', label: 'Creativity / ideas', emoji: '💡' },
              { key: 'skills', label: 'Skills / talent', emoji: '🎯' },
              { key: 'network', label: 'Network', emoji: '🌐' },
              { key: 'vision', label: 'Long-term vision', emoji: '🔭' },
              { key: 'resilience', label: 'Inner resilience', emoji: '🔥' },
            ]}
            onConfirm={handleBuffetConfirm}
          />
        );

      case 'dream-meal':
        return (
          <TextWithSliderAction
            placeholder="What do you want to move toward? (a project, healing, a money goal, a shift...)"
            sliderLabel="How big does this feel?"
            sliderEmoji="🍝"
            lowLabel="Tiny snack"
            highLabel="Massive feast"
            onConfirm={handleDreamMealConfirm}
          />
        );

      case 'self-perception':
        return (
          <ChipSelectAction
            columns={1}
            options={[
              { label: "I'm okay, just busy", value: 'okay-busy', emoji: '😌' },
              { label: 'Stretched thin but managing', value: 'stretched', emoji: '😤' },
              { label: 'In survival mode', value: 'surviving', emoji: '😶' },
              { label: 'Barely holding on', value: 'barely', emoji: '😣' },
            ]}
            onSelect={handleSelfPerceptionSelect}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display text-lg font-medium text-foreground">Kitchen Check-In</h1>
            <div className="h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${getStepProgress()}%` }}
              />
            </div>
          </div>
          <span className="text-2xl">🍽️</span>
        </div>
      </header>

      {/* Messages + Actions */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4 flex flex-col">
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && (
            <div className="self-start bg-card rounded-2xl rounded-tl-sm px-4 py-3 shadow-soft">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-soft" />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-soft" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-soft" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}

          {/* Smart Action Area */}
          {renderAction()}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}
