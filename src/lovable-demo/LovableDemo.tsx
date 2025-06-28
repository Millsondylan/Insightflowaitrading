import React from 'react';
import { StrategyVault, Strategy } from '../components/vault/StrategyVault.lovable';

// Sample data for testing
const sampleStrategies: Strategy[] = [
  {
    id: '1',
    title: 'Momentum Breakout',
    tags: ['Momentum', 'Breakout', 'High Frequency'],
    summary: 'Identifies strong momentum breakouts above key resistance levels with volume confirmation.',
    winRate: 0.65,
    totalPnL: 15420
  },
  {
    id: '2', 
    title: 'Mean Reversion Scalp',
    tags: ['Mean Reversion', 'Scalping', 'Short Term'],
    summary: 'Quick scalping strategy targeting oversold/overbought conditions in trending markets.',
    winRate: 0.58,
    totalPnL: 8950
  },
  {
    id: '3',
    title: 'Trend Following',
    tags: ['Trend Following', 'Long Term', 'Risk Management'],
    summary: 'Classic trend following approach with dynamic position sizing and trailing stops.',
    winRate: 0.72,
    totalPnL: 23680
  },
  {
    id: '4',
    title: 'Options Strangle',
    tags: ['Options', 'Volatility', 'Neutral'],
    summary: 'Profits from high volatility by selling strangles on high IV stocks before earnings.',
    winRate: 0.61,
    totalPnL: 12300
  },
  {
    id: '5',
    title: 'Crypto Arbitrage',
    tags: ['Crypto', 'Arbitrage', 'Low Risk'],
    summary: 'Exploits price differences between cryptocurrency exchanges for risk-free profits.',
    winRate: 0.89,
    totalPnL: 31250
  },
  {
    id: '6',
    title: 'Pairs Trading',
    tags: ['Pairs Trading', 'Market Neutral', 'Statistical'],
    summary: 'Market neutral strategy trading correlated stocks when their spread diverges.',
    winRate: 0.64,
    totalPnL: 9840
  }
];

export const LovableDemo = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            color: 'white',
            margin: '0 0 16px 0',
            background: 'linear-gradient(45deg, #60A5FA, #A78BFA)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🚀 InsightFlow AI Trading
          </h1>
          <p style={{
            fontSize: '20px',
            color: 'rgba(255, 255, 255, 0.7)',
            margin: 0,
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Advanced AI-powered trading strategies with real-time analytics and backtesting
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '48px'
        }}>
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: 'white', marginBottom: '4px' }}>
              {sampleStrategies.length}
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
              Active Strategies
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>💰</div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: 'white', marginBottom: '4px' }}>
              ${sampleStrategies.reduce((sum, s) => sum + s.totalPnL, 0).toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
              Total PnL
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎯</div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: 'white', marginBottom: '4px' }}>
              {Math.round((sampleStrategies.reduce((sum, s) => sum + s.winRate, 0) / sampleStrategies.length) * 100)}%
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
              Avg Win Rate
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🧠</div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: 'white', marginBottom: '4px' }}>
              AI
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
              Powered
            </div>
          </div>
        </div>

        {/* Strategy Vault */}
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          padding: '32px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '600',
            color: 'white',
            margin: '0 0 24px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            🏦 Strategy Vault
          </h2>
          <StrategyVault strategies={sampleStrategies} />
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '48px',
          padding: '24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <p style={{
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '14px',
            margin: 0
          }}>
            Built with ❤️ for Lovable - 100% Native React Components
          </p>
        </div>
      </div>
    </div>
  );
}; 