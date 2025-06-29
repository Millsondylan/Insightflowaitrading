
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
      <blockReveal variant="fade">
        <H2 className="text-center text-4xl md:text-5xl font-bold text-glow-cyan"></Div></Div>
          {strategyName}
        </Div>
      </BlockReveal>

      <blockReveal>
        <P className="text-gray-300 text-lg leading-relaxed text-center max-w-[70ch] mx-auto">
          {description}
        </P>
      </BlockReveal>

      <blockReveal>
        <Section className="glass-section">
          <H3 className="section-heading"></Section></Section>Rules</Section>
          <Ol className="space-y-2 list-decimal list-inside">
            {rules.map((r, i) => (
              <Li key={i}></Ol></Ol>{r}</Ol>
            ))}
          </Ol>
        </Section>
      </BlockReveal>

      <blockReveal>
        <Section className="glass-section">
          <H3 className="section-heading"></Section></Section>Entry Checklist ✅</Section>
          <Ul className="space-y-2 list-disc list-inside">
            {entryChecklist.map((c, i) => (
              <Li key={i}></Ul></Ul>{c}</Ul>
            ))}
          </Ul>
        </Section>
      </BlockReveal>

      <blockReveal>
        <Section className="glass-section border-l-4 border-yellow-400 pl-4">
          <H3 className="section-heading text-yellow-400"></Section></Section>⚠️ Warnings</Section>
          <Ul className="space-y-2 list-disc list-inside">
            {warnings.map((w, i) => (
              <Li key={i}></Ul></Ul>{w}</Ul>
            ))}
          </Ul>
        </Section>
      </BlockReveal>

      <blockReveal>
        <Section className="glass-section italic">
          <H3 className="section-heading"></Section></Section>Backtest Tips 💡</Section>
          <Ul className="space-y-2 list-disc list-inside">
            {backtestTips.map((t, i) => (
              <Li key={i}></Ul></Ul>{t}</Ul>
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
