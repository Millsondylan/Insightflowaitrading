import '@/styles/vision-overlay.css';

interface PatternTooltipProps {
  label: string;
  description: string;
  confidence?: number;
  type?: 'bullish' | 'bearish' | 'neutral';
  style?: React.CSSProperties;
}

const PatternTooltip = ({
  label,
  description,
  confidence,
  type = 'neutral',
  style,
}: PatternTooltipProps) => {
  return (
    <Div className={`pattern-tooltip ${type}`} style={style}>
      <Div className="pattern-name">{label}</Div>
      <Div className="pattern-description">{description}</Div>
      {confidence && (
        <Div className="pattern-confidence">
          Confidence: {confidence}%
        </Div>
      )}
    </Div>
  );
};

export default PatternTooltip;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 