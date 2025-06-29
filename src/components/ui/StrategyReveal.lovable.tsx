
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
    <Div className="strategy-reveal max-w-3xl mx-auto space-y-12">
      <blockreveal variant="fade">
        <H2 className="text-center text-4xl md:text-5xl font-bold text-glow-cyan">
          {strategyName}
        </Div>
      </BlockReveal>

      <blockreveal  />
        <P className="text-gray-300 text-lg leading-relaxed text-center max-w-[70ch] mx-auto">
          {description}
        </P>
      </BlockReveal>

      <Blockreveal >
        <Section className="glass-section">
          <H3 className="section-heading">Rules</Blockreveal>
          <Ol className="space-y-2 list-decimal list-inside">
            {rules.map((r, i) => (
              <Li key={i}>{r}</Ol>
            ))}
          </Ol>
        </Section>
      </BlockReveal>

      <Blockreveal  /></Blockreveal>
        <Section className="glass-section">
          <H3 className="section-heading"></Section>Entry Checklist ✅</Section>
          <Ul className="space-y-2 list-disc list-inside">
            {entryChecklist.map((c, i) => (
              <Li key={i}></Ul>{c}</Ul>
            ))}
          </Ul>
        </Section>
      </BlockReveal>

      <blockreveal >
        <Section className="glass-section border-l-4 border-yellow-400 pl-4">
          <H3 className="section-heading text-yellow-400"></Section>⚠️ Warnings</Section>
          <Ul className="space-y-2 list-disc list-inside">
            {warnings.map((w, i) => (
              <Li key={i}></Ul>{w}</Ul>
            ))}
          </Ul>
        </Section>
      </BlockReveal>

      <blockreveal >
        <Section className="glass-section italic">
          <H3 className="section-heading"></Section>Backtest Tips 💡</Section>
          <Ul className="space-y-2 list-disc list-inside">
            {backtestTips.map((t, i) => (
              <Li key={i}></Ul>{t}</Ul>
            ))}
          </Ul>
        </Section>
      </BlockReveal>
    </Div>
  );
};

export default StrategyReveal;


export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
