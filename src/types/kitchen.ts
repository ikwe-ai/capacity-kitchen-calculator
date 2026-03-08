export interface FridgeScores {
  sleep: number;
  energy: number;
  food: number;
  cash: number;
  emotional: number;
}

export interface CupboardScores {
  housing: number;
  finance: number;
  safety: number;
  support: number;
  health: number;
}

export interface BuffetScores {
  creativity: number;
  skills: number;
  network: number;
  vision: number;
  resilience: number;
}

export interface KitchenData {
  plateScore: number;
  plateDetails: string;
  fridge: FridgeScores;
  cupboards: CupboardScores;
  buffet: BuffetScores;
  dreamMeal: string;
  goalComplexity: number;
  selfPerception?: string;
}

export interface KitchenReport {
  plateLevel: number;
  fridgeLevel: number;
  cupboardsLevel: number;
  buffetLevel: number;
  kitchenScore: number;
  runway: 'very-short' | 'short' | 'medium' | 'solid';
  missingIngredients: Array<{ name: string; score: number; category: string }>;
  tinyMove: string;
}

export type CheckInStep = 
  | 'welcome' 
  | 'plate' 
  | 'plate-details'
  | 'fridge' 
  | 'cupboards' 
  | 'buffet' 
  | 'dream-meal' 
  | 'self-perception'
  | 'report';

export interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}
