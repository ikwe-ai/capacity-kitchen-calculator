import { useState } from 'react';
import { WelcomeScreen } from '@/components/kitchen/WelcomeScreen';
import { CheckInFlow } from '@/components/kitchen/CheckInFlow';
import { KitchenReport } from '@/components/kitchen/KitchenReport';
import { CheckInHistory } from '@/components/kitchen/CheckInHistory';
import { KitchenData } from '@/types/kitchen';
import { saveCheckIn, getHistory } from '@/lib/check-in-history';
import { useAuth } from '@/contexts/AuthContext';

type AppState = 'welcome' | 'check-in' | 'report' | 'history';

const Index = () => {
  const [state, setState] = useState<AppState>('welcome');
  const [kitchenData, setKitchenData] = useState<KitchenData | null>(null);
  const { user } = useAuth();
  const userId = user?.id;

  const handleStart = () => {
    setState('check-in');
  };

  const handleComplete = (data: KitchenData) => {
    saveCheckIn(data, userId);
    setKitchenData(data);
    setState('report');
  };

  const handleRestart = () => {
    setKitchenData(null);
    setState('welcome');
  };

  const handleBack = () => {
    setState('welcome');
  };

  const handleViewHistory = () => {
    setState('history');
  };

  const handleViewReport = (data: KitchenData) => {
    setKitchenData(data);
    setState('report');
  };

  const historyCount = getHistory(userId).length;

  return (
    <>
      {state === 'welcome' && (
        <WelcomeScreen onStart={handleStart} onViewHistory={handleViewHistory} historyCount={historyCount} />
      )}
      {state === 'check-in' && (
        <CheckInFlow onComplete={handleComplete} onBack={handleBack} />
      )}
      {state === 'report' && kitchenData && (
        <KitchenReport data={kitchenData} onRestart={handleRestart} />
      )}
      {state === 'history' && (
        <CheckInHistory onBack={handleBack} onViewReport={handleViewReport} userId={userId} />
      )}
    </>
  );
};

export default Index;
