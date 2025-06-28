import React, { useState, useMemo } from 'react';

// Type definitions
type Strategy = {
  id: string;
  title: string;
  tags: string[];
  summary: string;
  winRate: number;
  totalPnL: number;
};

// Strategy Card Component
const StrategyCard = ({ strategy }: { strategy: Strategy }) => {
  return (
    <div style={{
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(8px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', margin: 0 }}>{strategy.title}</h3>
        <button style={{
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.7)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          transition: 'color 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
        >
          View
        </button>
      </div>
      <p style={{
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.7)',
        height: '40px',
        margin: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>{strategy.summary}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {strategy.tags.map((tag) => (
          <div key={tag} style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '4px 8px',
            borderRadius: '20px',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.7)'
          }}>
            {tag}
          </div>
        ))}
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        marginTop: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🎯</span>
          <span style={{ fontSize: '14px', fontWeight: '500', color: 'white' }}>
            {(strategy.winRate * 100).toFixed(0)}% Win Rate
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>📈</span>
          <span style={{ fontSize: '14px', fontWeight: '500', color: 'white' }}>
            ${strategy.totalPnL.toLocaleString()} PnL
          </span>
        </div>
      </div>
    </div>
  );
};

// Strategy Vault Component
const StrategyVault = ({ strategies }: { strategies: Strategy[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('totalPnL');

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    strategies.forEach(s => s.tags.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, [strategies]);

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredStrategies = useMemo(() => {
    let result = [...strategies];

    if (searchTerm) {
      result = result.filter(s => 
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedTags.length > 0) {
      result = result.filter(s => 
        selectedTags.every(st => s.tags.includes(st))
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'winRate') {
        return b.winRate - a.winRate;
      }
      return b.totalPnL - a.totalPnL;
    });

    return result;
  }, [strategies, searchTerm, selectedTags, sortBy]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px'
      }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <span style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '20px',
            pointerEvents: 'none'
          }}>🔍</span>
          <input 
            type="text"
            placeholder="Search by title or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 40px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              boxSizing: 'border-box',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />
        </div>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '12px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            minWidth: '180px',
            outline: 'none',
            cursor: 'pointer'
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
        >
          <option value="totalPnL" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Sort by PnL</option>
          <option value="winRate" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Sort by Win Rate</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {allTags.map(tag => (
          <button 
            key={tag}
            onClick={() => handleTagClick(tag)}
            style={{
              padding: '8px 16px',
              backgroundColor: selectedTags.includes(tag) 
                ? 'rgba(255, 255, 255, 0.2)' 
                : 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              color: 'white',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              if (!selectedTags.includes(tag)) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = selectedTags.includes(tag) 
                ? 'rgba(255, 255, 255, 0.2)' 
                : 'transparent';
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px' 
      }}>
        {filteredStrategies.map(strategy => (
          <StrategyCard key={strategy.id} strategy={strategy} />
        ))}
      </div>

      {filteredStrategies.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '48px',
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '16px'
        }}>
          No strategies found matching your criteria
        </div>
      )}
    </div>
  );
};

// Enhanced and expanded sample data
const sampleStrategies: Strategy[] = [
  {
    id: '1',
    title: 'Momentum Breakout',
    tags: ['Momentum', 'Breakout', 'High Frequency'],
    summary: 'Identifies strong momentum breakouts above key resistance levels with volume confirmation. Uses 3-period RSI divergence for entry timing and adaptive trailing stops.',
    winRate: 0.65,
    totalPnL: 15420
  },
  {
    id: '2', 
    title: 'Mean Reversion Scalp',
    tags: ['Mean Reversion', 'Scalping', 'Short Term'],
    summary: 'Quick scalping strategy targeting oversold/overbought conditions in trending markets. Uses Bollinger Band squeezes and momentum reversals with tight risk management.',
    winRate: 0.58,
    totalPnL: 8950
  },
  {
    id: '3',
    title: 'Trend Following',
    tags: ['Trend Following', 'Long Term', 'Risk Management'],
    summary: 'Classic trend following approach with dynamic position sizing and trailing stops. Combines multiple timeframe analysis with volume spread to determine entry and exit points.',
    winRate: 0.72,
    totalPnL: 23680
  },
  {
    id: '4',
    title: 'Options Strangle',
    tags: ['Options', 'Volatility', 'Neutral'],
    summary: 'Profits from high volatility by selling strangles on high IV stocks before earnings. Implements sophisticated IV rank filtering and gamma exposure management techniques.',
    winRate: 0.61,
    totalPnL: 12300
  },
  {
    id: '5',
    title: 'Crypto Arbitrage',
    tags: ['Crypto', 'Arbitrage', 'Low Risk'],
    summary: 'Exploits price differences between cryptocurrency exchanges for risk-free profits. Includes latency optimization, fee calculation, and multi-exchange execution algorithms.',
    winRate: 0.89,
    totalPnL: 31250
  },
  {
    id: '6',
    title: 'Pairs Trading',
    tags: ['Pairs Trading', 'Market Neutral', 'Statistical'],
    summary: 'Market neutral strategy trading correlated stocks when their spread diverges. Uses cointegration analysis and z-score thresholds with dynamic position sizing for optimal results.',
    winRate: 0.64,
    totalPnL: 9840
  },
  {
    id: '7',
    title: 'Harmonic Pattern Scanner',
    tags: ['Pattern Recognition', 'Swing Trading', 'Fibonacci'],
    summary: 'Automatically identifies and trades harmonic patterns like Gartley, Butterfly, and Bat formations. Combines Fibonacci ratios with price action confirmation for precise entries.',
    winRate: 0.68,
    totalPnL: 18765
  },
  {
    id: '8',
    title: 'News Sentiment Analyzer',
    tags: ['Sentiment Analysis', 'Event Driven', 'NLP'],
    summary: 'Analyzes financial news headlines and social media sentiment in real-time to predict short-term price movements. Uses advanced NLP algorithms with customizable sentiment thresholds.',
    winRate: 0.57,
    totalPnL: 14280
  },
  {
    id: '9',
    title: 'Supply Demand Zones',
    tags: ['Price Action', 'Support/Resistance', 'Institutional'],
    summary: 'Identifies institutional supply and demand zones where large orders are filled. Tracks order flow and price rejection patterns to find high-probability reversal points.',
    winRate: 0.71,
    totalPnL: 26350
  },
  {
    id: '10',
    title: 'VWAP Deviation',
    tags: ['VWAP', 'Intraday', 'Mean Reversion'],
    summary: 'Trades deviations from Volume Weighted Average Price (VWAP) using standard deviation bands. Incorporates cumulative delta volume for confirmation of reversals and continuations.',
    winRate: 0.63,
    totalPnL: 11420
  },
  {
    id: '11',
    title: 'Ichimoku Cloud System',
    tags: ['Multi-Timeframe', 'Japanese', 'Trend Following'],
    summary: 'Complete trading system based on the Ichimoku Cloud indicator with multiple confirmation signals. Uses Tenkan/Kijun crosses, cloud breakouts, and Chikou span for trade management.',
    winRate: 0.66,
    totalPnL: 17950
  },
  {
    id: '12',
    title: 'AI Market Regime Detection',
    tags: ['Machine Learning', 'Adaptive', 'Long Term'],
    summary: 'Uses machine learning to detect market regimes and adapt trading strategies accordingly. Combines traditional technical indicators with neural networks to predict regime changes.',
    winRate: 0.74,
    totalPnL: 29780
  },
  {
    id: '13',
    title: 'Fixed Income Carry',
    tags: ['Bonds', 'Yield Curve', 'Income'],
    summary: 'Generates income through bond yield differentials while managing duration risk. Implements dynamic allocation based on yield curve steepness and central bank policy predictions.',
    winRate: 0.82,
    totalPnL: 8360
  },
  {
    id: '14',
    title: 'Volume Profile Breakout',
    tags: ['Volume Analysis', 'Breakout', 'Institutional'],
    summary: 'Trades breakouts from key volume nodes identified through Volume Profile analysis. Focuses on high volume areas and low volume nodes for support/resistance identification.',
    winRate: 0.62,
    totalPnL: 13570
  },
  {
    id: '15',
    title: 'Options Iron Condor',
    tags: ['Options', 'Income', 'Range Bound'],
    summary: 'Generates consistent income by selling Iron Condors on range-bound securities. Uses implied volatility rank and historical price channels to identify optimal setups.',
    winRate: 0.77,
    totalPnL: 10450
  },
  {
    id: '16',
    title: 'ETF Sector Rotation',
    tags: ['Sectors', 'Momentum', 'Macro'],
    summary: 'Rotates capital between sector ETFs based on relative strength and macroeconomic factors. Implements adaptive allocation using economic cycle indicators and momentum overlays.',
    winRate: 0.68,
    totalPnL: 19850
  },
  {
    id: '17',
    title: 'Commodity Channel Trading',
    tags: ['Commodities', 'Channels', 'Trend Following'],
    summary: 'Trades commodity futures using dynamic price channels and seasonal patterns. Incorporates COT report data, seasonality analysis, and technical breakouts for optimal entries.',
    winRate: 0.59,
    totalPnL: 21430
  },
  {
    id: '18',
    title: 'Market Divergence Finder',
    tags: ['Divergence', 'Reversal', 'Oscillators'],
    summary: 'Identifies and trades regular and hidden divergences between price and multiple oscillators. Uses adaptive filtered confirmations to eliminate false signals in different market contexts.',
    winRate: 0.64,
    totalPnL: 16780
  }
];

// Main Demo Component
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

export default LovableDemo; 