import { KitchenData } from '@/types/kitchen';
import { calculateKitchenReport } from './kitchen-calculations';

export interface HistoryEntry {
  id: string;
  date: string; // ISO string
  data: KitchenData;
  kitchenScore: number;
}

const BASE_STORAGE_KEY = 'kitchen-check-in-history';

function getStorageKey(userId?: string): string {
  return userId ? `${BASE_STORAGE_KEY}-${userId}` : BASE_STORAGE_KEY;
}

export function getHistory(userId?: string): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCheckIn(data: KitchenData, userId?: string): HistoryEntry {
  const report = calculateKitchenReport(data);
  const entry: HistoryEntry = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    data,
    kitchenScore: report.kitchenScore,
  };
  const history = getHistory(userId);
  history.unshift(entry);
  // Keep last 50 entries
  localStorage.setItem(getStorageKey(userId), JSON.stringify(history.slice(0, 50)));
  return entry;
}

export function deleteHistoryEntry(id: string, userId?: string) {
  const history = getHistory(userId).filter((e) => e.id !== id);
  localStorage.setItem(getStorageKey(userId), JSON.stringify(history));
}

export function clearHistory(userId?: string) {
  localStorage.removeItem(getStorageKey(userId));
}
