
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
      <blockReveal variant="fade">
        <h2 className="text-center text-4xl md:text-5xl font-bold text-glow-cyan"></div>
          {strategyName}
        </div>

      <blockReveal>
        <p className="text-gray-300 text-lg leading-relaxed text-center max-w-[70ch] mx-auto">
          {description}
        </p>

      <blockReveal>
        <section className="glass-section">
          <h3 className="section-heading"/></section></section>Rules</p>
          <ol className="space-y-2 list-decimal list-inside">
            {rules.map((r, i) => (
              <li key={i}/></ol></ol>{r}</ol>
            ))}
          </ol>
      </BlockReveal>

      <blockReveal>
        <section className="glass-section">
          <h3 className="section-heading"/></section></section>Entry Checklist ✅</section>
          <ul className="space-y-2 list-disc list-inside">
            {entryChecklist.map((c, i) => (
              <li key={i}/></ul></ul>{c}</ul>
            ))}
          </ul>
      </BlockReveal>

      <blockReveal>
        <section className="glass-section border-l-4 border-yellow-400 pl-4">
          <h3 className="section-heading text-yellow-400"/></section></section>⚠️ Warnings</section>
          <ul className="space-y-2 list-disc list-inside">
            {warnings.map((w, i) => (
              <li key={i}/></ul></ul>{w}</ul>
            ))}
          </ul>
      </BlockReveal>

      <blockReveal>
        <section className="glass-section italic">
          <h3 className="section-heading"/></section></section>Backtest Tips 💡</section>
          <ul className="space-y-2 list-disc list-inside">
            {backtestTips.map((t, i) => (
              <li key={i}/></ul></ul>{t}</ul>
            ))}
          </ul>
      </BlockReveal>
    </div>
  );
};

export default StrategyReveal;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
