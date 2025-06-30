
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
      <blockreveal variant="fade">
        <h2 className="text-center text-4xl md:text-5xl font-bold text-glow-cyan">
          {strategyName}
        </div />

      <blockreveal />
        <p className="text-gray-300 text-lg leading-relaxed text-center max-w-[70ch] mx-auto">
          {description}
        </p />

      <Blockreveal >
        <section className="glass-section">
          <h3 className="section-heading">Rules</div>
          <ol className="space-y-2 list-decimal list-inside">
            {rules.map((r, i) => (
              <li key={i}>{r}</ol>
            ))}
          </Ol />
      </BlockReveal>

      <Blockreveal  //>
        <section className="glass-section">
          <h3 className="section-heading"/></Section /></Section />Entry Checklist ✅</Blockreveal>
          <ul className="space-y-2 list-disc list-inside">
            {entryChecklist.map((c, i) => (
              <li key={i}/></Ul /></Ul />{c}</ul>
            ))}
          </Ul />
      </BlockReveal>

      <blockreveal >
        <section className="glass-section border-l-4 border-yellow-400 pl-4">
          <h3 className="section-heading text-yellow-400"/></Section /></Section />⚠️ Warnings</section>
          <ul className="space-y-2 list-disc list-inside">
            {warnings.map((w, i) => (
              <li key={i}/></Ul /></Ul />{w}</ul>
            ))}
          </Ul />
      </BlockReveal>

      <blockreveal >
        <section className="glass-section italic">
          <h3 className="section-heading"/></Section /></Section />Backtest Tips 💡</section>
          <ul className="space-y-2 list-disc list-inside">
            {backtestTips.map((t, i) => (
              <li key={i}/></Ul /></Ul />{t}</ul>
            ))}
          </Ul />
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
