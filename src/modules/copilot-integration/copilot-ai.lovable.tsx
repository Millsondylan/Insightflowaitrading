// TODO: implement inline AI copilot assistant
import React from 'react';

interface CopilotAIProps {
  context?: string;
  onSuggestionApply?: (suggestion: string) => void;
}

export const CopilotAI: React.FC<CopilotAIProps> = ({ context, onSuggestionApply }) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const [suggestions, setSuggestions] = React.useState([
    {
      id: 1,
      type: 'optimization',
      title: 'Optimize Entry Timing',
      content: 'Consider adding RSI < 30 to your entry conditions for better oversold entries',
      code: 'entry_rules.push("rsi(14) < 30")',
      impact: '+12% win rate'
    },
    {
      id: 2,
      type: 'risk',
      title: 'Risk Management Alert',
      content: 'Your stop loss is too tight. Historical data shows 85% of trades hit this level',
      code: 'stop_loss = entry_price * 0.97 // Changed from 0.99',
      impact: '-23% false stops'
    },
    {
      id: 3,
      type: 'pattern',
      title: 'Pattern Recognition',
      content: 'This setup works best during high volume periods. Add volume filter',
      code: 'volume > sma(volume, 20) * 1.5',
      impact: '+8% accuracy'
    }
  ]);

  const [feedback, setFeedback] = React.useState<Record<number, 'up' | 'down' | null>>({});

  const handleFeedback = (suggestionId: number, type: 'up' | 'down') => {
    setFeedback({ ...feedback, [suggestionId]: type });
    // TODO: Connect to processCopilotFeedback function
  };

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        
        onClick={() => setIsVisible(true)}
      >
        <Sparkles  />
        Show Copilot
      </Button>
    );
  }

  return (
    <Card style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px", display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Sparkles  />
          <h3 >AI Copilot</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
        >
          <span style={{fontSize: '16px'}}>❌</span>
        </Button>
      </div>

      <div style={{ padding: "16px" }}>
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            style={{ border: "1px solid #374151" }}
          >
            <div style={{ display: "flex" }}>
              <h4 >{suggestion.title}</h4>
              <Badge variant="outline" >
                {suggestion.type}
              </Badge>
            </div>
            
            <p >
              {suggestion.content}
            </p>
            
            {suggestion.code && (
              <pre >
                <code>{suggestion.code}</code>
              </pre>
            )}
            
            <div style={{ display: "flex", alignItems: "center" }}>
              <span >
                {suggestion.impact}
              </span>
              
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback(suggestion.id, 'up')}
                  className={feedback[suggestion.id] === 'up' ? 'text-green-500' : ''}
                >
                  <ThumbsUp  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback(suggestion.id, 'down')}
                  className={feedback[suggestion.id] === 'down' ? 'text-red-500' : ''}
                >
                  <ThumbsDown  />
                </Button>
                <Button
                  size="sm"
                  onClick={() => onSuggestionApply?.(suggestion.code)}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "16px" }}>
        <p >
          Copilot analyzes your strategy in real-time
        </p>
      </div>
    </Card>
  );
}; 