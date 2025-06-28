import React, { useState } from 'react';

interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  entryTime: string;
  exitTime: string;
  stopLoss: number;
  takeProfit: number;
  strategy: string;
  tags: string[];
}

interface ReflectionGeneratorProps {
  trade: Trade;
  onReflectionGenerated: (reflection: string) => void;
}

export const ReflectionGenerator: React.FC<ReflectionGeneratorProps> = ({
  trade,
  onReflectionGenerated
}) => {
  const [reflection, setReflection] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReflection = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));

      const pnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.type === 'buy' ? 1 : -1);
      const pnlPercentage = ((trade.exitPrice - trade.entryPrice) / trade.entryPrice * 100) * (trade.type === 'buy' ? 1 : -1);
      const duration = Math.round((new Date(trade.exitTime).getTime() - new Date(trade.entryTime).getTime()) / (1000 * 60));

      const reflectionText = `
Trade Analysis for ${trade.symbol} ${trade.type.toUpperCase()}

Performance:
${pnl > 0 ? '✅' : '❌'} P&L: ${pnl.toFixed(2)} (${pnlPercentage.toFixed(2)}%)
⏱️ Duration: ${duration} minutes

Key Observations:
${pnl > 0 ? 
  `- Strong execution of ${trade.strategy} strategy
- Good risk management with clear stop loss at ${trade.stopLoss}
- Profit target at ${trade.takeProfit} was well-defined` :
  `- Review entry criteria for ${trade.strategy} strategy
- Consider adjusting stop loss placement (current: ${trade.stopLoss})
- Evaluate if profit target (${trade.takeProfit}) was realistic`
}

Market Context:
- Trade aligned with ${trade.tags.join(', ')} conditions
- ${trade.type === 'buy' ? 'Bullish' : 'Bearish'} bias was ${pnl > 0 ? 'correct' : 'incorrect'}
- Position sizing was ${trade.quantity} units

Psychological Factors:
- ${pnl > 0 ? 'Maintained discipline and followed the plan' : 'Review emotional state during trade execution'}
- ${pnl > 0 ? 'Good patience in waiting for setup' : 'Evaluate if FOMO influenced entry'}
- ${duration > 120 ? 'Showed good holding strength' : 'Consider if trade was closed too early'}

Areas for Improvement:
1. ${pnl > 0 ? 'Document successful patterns for future reference' : 'Review entry criteria validation'}
2. ${duration > 120 ? 'Consider scaling out strategy' : 'Work on holding winners longer'}
3. Continue monitoring ${trade.tags.join(' & ')} setups

Next Steps:
- Update trading journal with these insights
- Review similar setups in historical data
- Adjust risk parameters if needed
`;

      setReflection(reflectionText);
      onReflectionGenerated(reflectionText);
    } catch (err) {
      setError('Failed to generate reflection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
          Trade Reflection
        </h2>
        <button
          onClick={generateReflection}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#9ca3af' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Analyzing...' : 'Generate Reflection'}
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div style={{
          padding: '20px',
          backgroundColor: '#f3f4f6',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
            Symbol
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {trade.symbol}
          </div>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#f3f4f6',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
            Type
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase' }}>
            {trade.type}
          </div>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#f3f4f6',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
            Strategy
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {trade.strategy}
          </div>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '16px', color: '#6b7280' }}>
            Analyzing trade data and generating insights...
          </div>
        </div>
      )}

      {reflection && !loading && (
        <div style={{
          marginTop: '20px',
          padding: '20px',
          backgroundColor: '#f3f4f6',
          borderRadius: '12px',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace'
        }}>
          {reflection}
        </div>
      )}

      {error && (
        <div style={{
          padding: '20px',
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          {error}
        </div>
      )}
    </div>
  );
}; 