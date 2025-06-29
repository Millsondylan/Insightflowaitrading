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
  <blockreveal variant="slide-up">
    <Div className="flex flex-wrap justify-center gap-4 mt-12">
      {buttons.map((b) => (
        <Link  />
          <Span className="mr-2"></Div></Div>{b.icon}</Div> {b.label}
        </Link>
      ))}
    </Div>
  </BlockReveal>
);

export default StrategyCTA; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
