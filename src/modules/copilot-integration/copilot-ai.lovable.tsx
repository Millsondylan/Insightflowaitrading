// TODO: implement inline AI copilot assistant
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, X, ThumbsUp, ThumbsDown } from 'lucide-react';

interface CopilotAIProps {
  context?: string;
  onSuggestionApply?: (suggestion: string) => void;
}

export const CopilotAI: React.FC<copilotaiprops  > = ({ context, onSuggestionApply }) => {
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

  const [feedback, setFeedback] = React.useState<record  >>({});

  const handleFeedback = (suggestionId: number, type: 'up' | 'down') => {
    setFeedback({ ...feedback, [suggestionId]: type });
    // TODO: Connect to processCopilotFeedback function
  };

  if (!isVisible) {
    return (
      <button variant="outline" size="sm" > setIsVisible(true)}
      >
        <sparkles  >
        Show Copilot
      </Button>
    );
  }

  return (
    <card  style={{ display: "flex" }}>
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <sparkles  >
          <h3 className="font-semibold">AI Copilot</h3>
        </div>
        <button variant="ghost" size="sm" > setIsVisible(false)}
        >
          <x  >
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="p-3 border rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium">{suggestion.title}</h4>
              <badge variant="outline" style={{ fontSize: "0.75rem" }}>
                {suggestion.type}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">
              {suggestion.content}
            </p>
            
            {suggestion.code && (
              <pre className="text-xs bg-secondary/50 p-2 rounded mb-2 overflow-x-auto">
                <code>{suggestion.code}</code>
              </pre>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-green-500">
                {suggestion.impact}
              </span>
              
              <div className="flex items-center gap-2">
                <button variant="ghost" size="sm" > handleFeedback(suggestion.id, 'up')}
                  className={feedback[suggestion.id] === 'up' ? 'text-green-500' : ''}
                >
                  <thumbsup  >
                </Button>
                <button variant="ghost" size="sm" > handleFeedback(suggestion.id, 'down')}
                  className={feedback[suggestion.id] === 'down' ? 'text-red-500' : ''}
                >
                  <thumbsdown  >
                </Button>
                <button size="sm" > onSuggestionApply?.(suggestion.code)}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t bg-secondary/20">
        <p className="text-xs text-muted-foreground text-center">
          Copilot analyzes your strategy in real-time
        </p>
      </div>
    </Card>
  );
}; 
export const lovable = { component: true };
