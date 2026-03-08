import { useState } from 'react';
import { HistoryEntry, getHistory, deleteHistoryEntry, clearHistory } from '@/lib/check-in-history';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, Clock, TrendingUp, TrendingDown, Minus, GitCompareArrows, Check } from 'lucide-react';
import { KitchenData } from '@/types/kitchen';
import { CompareView } from './CompareView';

interface CheckInHistoryProps {
  onBack: () => void;
  onViewReport: (data: KitchenData) => void;
  userId?: string;
}

export function CheckInHistory({ onBack, onViewReport, userId }: CheckInHistoryProps) {
  const [entries, setEntries] = useState<HistoryEntry[]>(getHistory(userId));
  const [compareMode, setCompareMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [comparing, setComparing] = useState<[HistoryEntry, HistoryEntry] | null>(null);

  const handleDelete = (id: string) => {
    deleteHistoryEntry(id, userId);
    setEntries(getHistory(userId));
    setSelected(s => s.filter(sid => sid !== id));
  };

  const handleClearAll = () => {
    clearHistory(userId);
    setEntries([]);
  };

  const getTrend = (index: number): 'up' | 'down' | 'same' | null => {
    if (index >= entries.length - 1) return null;
    const diff = entries[index].kitchenScore - entries[index + 1].kitchenScore;
    if (diff > 3) return 'up';
    if (diff < -3) return 'down';
    return 'same';
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(s => s !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const handleCompare = () => {
    const a = entries.find(e => e.id === selected[0]);
    const b = entries.find(e => e.id === selected[1]);
    if (a && b) setComparing([a, b]);
  };

  if (comparing) {
    return (
      <CompareView
        entryA={comparing[0]}
        entryB={comparing[1]}
        onBack={() => { setComparing(null); setSelected([]); setCompareMode(false); }}
        formatDate={formatDate}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 animate-fade-in">
          <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-semibold text-foreground">
              Check-In History
            </h1>
            <p className="text-sm text-muted-foreground">
              {entries.length} check-in{entries.length !== 1 ? 's' : ''} on this device
            </p>
          </div>
          <span className="text-3xl">📊</span>
        </div>

        {entries.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 shadow-card text-center space-y-3 animate-fade-in">
            <span className="text-5xl">🍽️</span>
            <p className="text-foreground font-medium">No check-ins yet</p>
            <p className="text-sm text-muted-foreground">
              Complete your first Kitchen Check-In and it'll show up here.
            </p>
            <Button variant="warm" onClick={onBack}>
              Start a Check-In
            </Button>
          </div>
        ) : (
          <>
            {/* Compare toggle */}
            {entries.length >= 2 && (
              <div className="flex gap-2 animate-fade-in">
                <Button
                  variant={compareMode ? 'default' : 'outline'}
                  size="sm"
                  className="gap-2"
                  onClick={() => { setCompareMode(!compareMode); setSelected([]); }}
                >
                  <GitCompareArrows className="w-4 h-4" />
                  {compareMode ? 'Cancel Compare' : 'Compare Two'}
                </Button>
                {compareMode && selected.length === 2 && (
                  <Button variant="warm" size="sm" onClick={handleCompare} className="gap-2 animate-fade-in">
                    Compare Now →
                  </Button>
                )}
                {compareMode && selected.length < 2 && (
                  <span className="text-xs text-muted-foreground self-center">
                    Select {2 - selected.length} more
                  </span>
                )}
              </div>
            )}

            {/* Score trend mini-chart */}
            {entries.length >= 2 && (
              <div className="bg-card rounded-2xl p-5 shadow-card animate-fade-in">
                <h2 className="text-sm font-medium text-muted-foreground mb-3">Kitchen Score Over Time</h2>
                <div className="flex items-end gap-1 h-20">
                  {entries.slice(0, 12).reverse().map((entry) => {
                    const height = Math.max(8, (entry.kitchenScore / 100) * 100);
                    const isSelected = selected.includes(entry.id);
                    return (
                      <div
                        key={entry.id}
                        className={`flex-1 rounded-t-sm transition-colors cursor-pointer relative group ${
                          isSelected ? 'bg-primary ring-2 ring-primary ring-offset-2' : 'bg-primary/70 hover:bg-primary'
                        }`}
                        style={{ height: `${height}%` }}
                        onClick={() => compareMode ? toggleSelect(entry.id) : onViewReport(entry.data)}
                      >
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {entry.kitchenScore}%
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-muted-foreground">
                    {formatDate(entries[Math.min(11, entries.length - 1)].date)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {formatDate(entries[0].date)}
                  </span>
                </div>
              </div>
            )}

            {/* Entry list */}
            <div className="space-y-3">
              {entries.map((entry, index) => {
                const trend = getTrend(index);
                const isSelected = selected.includes(entry.id);
                return (
                  <div
                    key={entry.id}
                    className={`bg-card rounded-2xl p-4 shadow-card flex items-center gap-4 animate-fade-in cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-primary shadow-glow' : 'hover:shadow-glow'
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => compareMode ? toggleSelect(entry.id) : onViewReport(entry.data)}
                  >
                    {/* Compare checkbox or Score */}
                    {compareMode ? (
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        {isSelected ? <Check className="w-6 h-6" /> : <span className="font-display text-lg font-bold text-muted-foreground">{entry.kitchenScore}%</span>}
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex flex-col items-center justify-center shrink-0">
                        <span className="font-display text-lg font-bold text-primary">
                          {entry.kitchenScore}%
                        </span>
                      </div>
                    )}

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">
                          {formatDate(entry.date)}
                        </span>
                        {trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-sage-dark" />}
                        {trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-destructive" />}
                        {trend === 'same' && <Minus className="w-3.5 h-3.5 text-muted-foreground" />}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {entry.data.selfPerception || entry.data.plateDetails || 'Kitchen check-in'}
                      </p>
                    </div>

                    {/* Delete (only in non-compare mode) */}
                    {!compareMode && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(entry.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Clear all */}
            {entries.length > 1 && !compareMode && (
              <div className="text-center pt-2">
                <Button variant="ghost" size="sm" className="text-muted-foreground text-xs" onClick={handleClearAll}>
                  Clear all history
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
