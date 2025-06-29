
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
    <div style={{ marginLeft: "auto", marginRight: "auto" }}>
      <BlockReveal variant="fade">
        <h2 style={{ fontWeight: "700" }}>
          {strategyName}
        </h2>
      </BlockReveal>

      <BlockReveal>
        <p style={{ marginLeft: "auto", marginRight: "auto" }}>
          {description}
        </p>
      </BlockReveal>

      <BlockReveal>
        <section >
          <h3 >Rules</h3>
          <ol >
            {rules.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ol>
        </section>
      </BlockReveal>

      <BlockReveal>
        <section >
          <h3 >Entry Checklist ✅</h3>
          <ul >
            {entryChecklist.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </section>
      </BlockReveal>

      <BlockReveal>
        <section >
          <h3 >⚠️ Warnings</h3>
          <ul >
            {warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </section>
      </BlockReveal>

      <BlockReveal>
        <section >
          <h3 >Backtest Tips 💡</h3>
          <ul >
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
