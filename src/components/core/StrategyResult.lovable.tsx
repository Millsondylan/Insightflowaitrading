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
      <div style={{ padding: "32px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Loader2 style={{ marginBottom: "16px" }} />
        <p >Generating your trading strategy...</p>
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