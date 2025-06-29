import React, { useState, useEffect } from 'react';

interface Strategy {
  id: string;
  name: string;
  parameters: {
    entryThreshold: number;
    exitThreshold: number;
    stopLoss: number;
    takeProfit: number;
    positionSize: number;
  };
  rules: string[];
  timeframe: string;
  symbols: string[];
}

interface OptimizationResult {
  parameters: Strategy['parameters'];
  performance: {
    winRate: number;
    profitFactor: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
}

interface MLStrategyOptimizerUIProps {
  strategy: Strategy;
  onOptimizationComplete: (result: OptimizationResult) => void;
}

export const MLStrategyOptimizerUI: React.FC<MLStrategyOptimizerUIProps> = ({
  strategy,
  onOptimizationComplete
}) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>('idle');
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'running') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 500);

      // Simulate optimization process
      setTimeout(() => {
        const optimizedResult: OptimizationResult = {
          parameters: {
            entryThreshold: 0.65,
            exitThreshold: -0.45,
            stopLoss: 2.5,
            takeProfit: 5,
            positionSize: 0.15
          },
          performance: {
            winRate: 0.68,
            profitFactor: 1.85,
            maxDrawdown: 15.5,
            sharpeRatio: 1.92
          }
        };

        setResult(optimizedResult);
        setStatus('complete');
        onOptimizationComplete(optimizedResult);
        clearInterval(interval);
      }, 25000);

      return () => clearInterval(interval);
    }
  }, [status, onOptimizationComplete]);

  const handleStartOptimization = () => {
    setStatus('running');
    setProgress(0);
    setResult(null);
    setError(null);
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
          Strategy Optimizer
        </h2>
        <Button onClick={handleStartOptimization}
          disabled={status === 'running'}
          style={{
            padding: '10px 20px',
            backgroundColor: status === 'running' ? '#9ca3af' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: status === 'running' ? 'not-allowed' : 'pointer'
          }}
       >
          {status === 'running' ? 'Optimizing...' : 'Start Optimization'}
        </button>
      </div>

      {status === 'running' && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: '#2563eb',
                transition: 'width 0.5s ease-in-out'
              }}
            />
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '8px',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
        </div>
      )}

      {result && (
        <div style={{ marginTop: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
            Optimization Results
          </h3>
          
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
                Win Rate
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {(result.performance.winRate * 100).toFixed(1)}%
              </div>
            </div>

            <div style={{
              padding: '20px',
              backgroundColor: '#f3f4f6',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                Profit Factor
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {result.performance.profitFactor.toFixed(2)}
              </div>
            </div>

            <div style={{
              padding: '20px',
              backgroundColor: '#f3f4f6',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                Max Drawdown
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {result.performance.maxDrawdown.toFixed(1)}%
              </div>
            </div>

            <div style={{
              padding: '20px',
              backgroundColor: '#f3f4f6',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                Sharpe Ratio
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {result.performance.sharpeRatio.toFixed(2)}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
              Optimized Parameters
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(result.parameters).map(([param, value]) => (
                <div key={param} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '8px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'capitalize' }}>
                      {param.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                    {typeof value === 'number' ? value.toFixed(2) : value}
                  </div>
                </div>
              ))}
            </div>
          </div>
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
// Add Lovable.dev compatibility
export const lovable = {
  editableComponents: true,
  visualEditing: true,
  supportsTailwind: true
};

export default ml-optimizer;
