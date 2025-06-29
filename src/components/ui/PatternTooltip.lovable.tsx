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
      <div >{label}</div>
      <div >{description}</div>
      {confidence && (
        <div >
          Confidence: {confidence}%
        </div>
      )}
    </div>
  );
};

export default PatternTooltip; 