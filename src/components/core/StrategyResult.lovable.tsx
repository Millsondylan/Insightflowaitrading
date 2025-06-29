import { Loader2 } from 'lucide-react';
import StrategyReveal from '../ui/StrategyReveal';
import StrategyCTA from '../ui/StrategyCTA';
import { StrategyResponse } from '../../pages/Strategy';

interface StrategyResultProps {
  result: StrategyResponse | null;
  isLoading: boolean;
}

const StrategyResult = ({ result, isLoading }: StrategyResultProps) => {
  if (isLoading) {
    return (
      <div className="glass-container p-8 rounded-lg flex flex-col items-center justify-center min-h-[300px]">
        <loader2  >
        <p className="text-lg text-gray-300">Generating your trading strategy...</p>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div>
      <Strategyreveal >
      <Strategycta  />
    </div>
  );
};

export default StrategyResult; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
