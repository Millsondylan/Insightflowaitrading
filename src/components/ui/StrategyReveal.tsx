
import BlockReveal from './BlockReveal';
import '../../styles/strategy.css';

interface StrategyRevealProps {
  result: {
    strategyName: string;
    description: string;
    rules: string[];
    entryChecklist: string[];
    warnings: string[];
    backtestTips: string[];
  };
}

const StrategyReveal = ({ result }: StrategyRevealProps) => {
  const {
    strategyName,
    description,
    rules,
    entryChecklist,
    warnings,
    backtestTips,
  } = result;

  return (
    <div className="strategy-reveal max-w-3xl mx-auto space-y-12">
      <BlockReveal variant="fade">
        <h2 className="text-center text-4xl md:text-5xl font-bold text-glow-cyan">
          {strategyName}
        </h2>
      </BlockReveal>

      <BlockReveal>
        <p className="text-gray-300 text-lg leading-relaxed text-center max-w-[70ch] mx-auto">
          {description}
        </p>
      </BlockReveal>

      <BlockReveal>
        <section className="glass-section">
          <h3 className="section-heading">Rules</h3>
          <ol className="space-y-2 list-decimal list-inside">
            {rules.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ol>
        </section>
      </BlockReveal>

      <BlockReveal>
        <section className="glass-section">
          <h3 className="section-heading">Entry Checklist ✅</h3>
          <ul className="space-y-2 list-disc list-inside">
            {entryChecklist.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </section>
      </BlockReveal>

      <BlockReveal>
        <section className="glass-section border-l-4 border-yellow-400 pl-4">
          <h3 className="section-heading text-yellow-400">⚠️ Warnings</h3>
          <ul className="space-y-2 list-disc list-inside">
            {warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </section>
      </BlockReveal>

      <BlockReveal>
        <section className="glass-section italic">
          <h3 className="section-heading">Backtest Tips 💡</h3>
          <ul className="space-y-2 list-disc list-inside">
            {backtestTips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </section>
      </BlockReveal>
    </div>
  );
};

export default StrategyReveal;
