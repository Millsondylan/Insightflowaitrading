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
        <Loader2 className="h-12 w-12 animate-spin text-cyan-400 mb-4" />
        <p className="text-lg text-gray-300">Generating your trading strategy...</p>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div>
      <StrategyReveal result={result} />
      <StrategyCTA strategyName={result.strategyName} />
    </div>
  );
};

export default StrategyResult; 