import React, { useState, useMemo } from 'react';

export type Strategy = {
  id: string;
  title: string;
  tags: string[];
  summary: string;
  winRate: number;
  totalPnL: number;
};

type StrategyCardProps = {
  strategy: Strategy;
};

const StrategyCard = ({ strategy }: StrategyCardProps) => {
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

type Props = {
  strategies: Strategy[];
};

export const StrategyVault = ({ strategies }: Props) => {
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