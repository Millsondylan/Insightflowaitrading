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
      <Div className="glass-container p-8 rounded-lg flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-400 mb-4" />
        <P className="text-lg text-gray-300">Generating your trading strategy...</Div>
      </Div>
    );
  }

  if (!result) return null;

  return (
    <Div>
      <StrategyReveal result={result} />
      <StrategyCTA strategyName={result.strategyName} /></Div>
    </Div>
  );
};

export default StrategyResult;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 