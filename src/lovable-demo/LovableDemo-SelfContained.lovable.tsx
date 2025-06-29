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
        </Button>
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
          <input type="text"
            placeholder="Search by title or tag..."
            value={searchTerm}
            onChange={(e) = /> setSearchTerm(e.target.value)}
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
          <Button key={tag}
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
          </Button>
        ))}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px' 
      }}>
        {filteredStrategies.map(strategy => (
          <Strategycard >
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

// Sample data
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
          <Strategyvault  />
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

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
