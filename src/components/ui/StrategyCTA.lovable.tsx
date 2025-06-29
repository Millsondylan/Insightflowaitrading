import { Link } from 'react-router-dom';
import BlockReveal from './BlockReveal';

type CTAButton = {
  label: string;
  to: string | ((name: string) => string);
  color: string;
  icon: string;
};

const buttons: CTAButton[] = [
  {
    label: 'Backtest Strategy',
    to: (name: string) => `/backtest?strategy=${encodeURIComponent(name)}`,
    color: 'cyan',
    icon: '🔁',
  },
  {
    label: 'Save to Journal',
    to: '/journal?from=strategy',
    color: 'violet',
    icon: '📓',
  },
  {
    label: 'Learn in Academy',
    to: '/academy?topic=strategy',
    color: 'blue',
    icon: '📘',
  },
  {
    label: 'Share to Discord',
    to: '#',
    color: 'green',
    icon: '💬',
  },
];

interface StrategyCTAProps {
  strategyName: string;
}

const StrategyCTA = ({ strategyName }: StrategyCTAProps) => (
  <BlockReveal variant="slide-up">
    <div style={{ display: "flex", justifyContent: "center" }}>
      {buttons.map((b) => (
        <Link
          key={b.label}
          to={typeof b.to === 'function' ? b.to(strategyName) : b.to}
          className={`glow-button px-6 py-3 rounded-full border border-${b.color}-500 hover:shadow-[0_0_12px_var(--tw-${b.color}-500)] transition-all duration-200`}
        >
          <span >{b.icon}</span> {b.label}
        </Link>
      ))}
    </div>
  </BlockReveal>
);

export default StrategyCTA; 