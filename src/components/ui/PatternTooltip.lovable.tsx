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
    <div className={`pattern-tooltip ${type}`} style={style}>
      <div className="pattern-name">{label}</div>
      <div className="pattern-description">{description}</div>
      {confidence && (
        <div className="pattern-confidence">
          Confidence: {confidence}%
        </div>
      )}
    </div>
  );
};

export default PatternTooltip; 