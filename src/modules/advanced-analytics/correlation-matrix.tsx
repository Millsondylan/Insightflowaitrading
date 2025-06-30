// Correlation Matrix Heatmap Component
// Real-time correlation analysis with interactive visualization

import React, { useState, useEffect, useMemo } from 'react';
import { CorrelationMatrix, CorrelationData, RollingCorrelation, AnalyticsEvent } from './types';

interface CorrelationMatrixProps {
  symbols: string[];
  timeframe?: string;
  updateInterval?: number;
  onCorrelationAlert?: (event: AnalyticsEvent) => void;
  className?: string;
}

export const CorrelationMatrixComponent: React.FC<CorrelationMatrixProps> = ({
  symbols,
  timeframe = '1M',
  updateInterval = 60000, // 1 minute
  onCorrelationAlert,
  className = '',
}) => {
  const [matrix, setMatrix] = useState<CorrelationMatrix | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [rollingData, setRollingData] = useState<RollingCorrelation | null>(null);

  // TODO: implement real correlation calculation
  useEffect(() => {
    const fetchCorrelationMatrix = async () => {
      setLoading(true);
      try {
        // TODO: replace with real API call
        const mockMatrix = await generateMockCorrelationMatrix(symbols, timeframe);
        setMatrix(mockMatrix);
        
        // Check for correlation spikes
        checkCorrelationAlerts(mockMatrix);
      } catch (error) {
        console.error('Failed to fetch correlation matrix:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCorrelationMatrix();
    const interval = setInterval(fetchCorrelationMatrix, updateInterval);

    return () => clearInterval(interval);
  }, [symbols, timeframe, updateInterval]);

  /**
   * Check for significant correlation changes
   * TODO: implement sophisticated correlation spike detection
   */
  const checkCorrelationAlerts = (matrix: CorrelationMatrix) => {
    if (!onCorrelationAlert) return;

    matrix.correlations.forEach((row, i) => {
      row.forEach((correlation, j) => {
        if (i !== j && Math.abs(correlation) > 0.8) {
          onCorrelationAlert({
            type: 'CORRELATION_SPIKE',
            payload: {
              symbols: [matrix.symbols[i], matrix.symbols[j]],
              correlation,
            },
          });
        }
      });
    });
  };

  /**
   * Get color for correlation value
   */
  const getCorrelationColor = (value: number): string => {
    if (value === 1) return 'bg-blue-900'; // Perfect positive correlation
    if (value > 0.7) return 'bg-blue-700';
    if (value > 0.3) return 'bg-blue-500';
    if (value > 0.1) return 'bg-blue-300';
    if (value > -0.1) return 'bg-gray-400';
    if (value > -0.3) return 'bg-red-300';
    if (value > -0.7) return 'bg-red-500';
    return 'bg-red-700'; // Strong negative correlation
  };

  /**
   * Handle cell click for detailed view
   */
  const handleCellClick = async (row: number, col: number) => {
    if (row === col) return; // Skip diagonal
    
    setSelectedCell({ row, col });
    
    // TODO: fetch rolling correlation data
    const symbol1 = matrix?.symbols[row];
    const symbol2 = matrix?.symbols[col];
    
    if (symbol1 && symbol2) {
      const rolling = await fetchRollingCorrelation(symbol1, symbol2, 30);
      setRollingData(rolling);
    }
  };

  /**
   * Format correlation value for display
   */
  const formatCorrelation = (value: number): string => {
    return value.toFixed(2);
  };

  if (loading) {
    return (
      <div className={`rounded-xl bg-black/30 p-6 border border-white/10 backdrop-blur-md ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <span className="ml-2 text-white/60">Loading correlation matrix...</span>
        </div>
      </div>
    );
  }

  if (!matrix) {
    return (
      <div className={`rounded-xl bg-black/30 p-6 border border-white/10 backdrop-blur-md ${className}`}>
        <p className="text-center text-white/60">Failed to load correlation data</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl bg-black/30 p-6 border border-white/10 backdrop-blur-md ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">
          Correlation Matrix ({timeframe})
        </h3>
        <p className="text-sm text-white/60">
          Updated: {matrix.updatedAt.toLocaleTimeString()}
        </p>
      </div>

      <div className="overflow-auto">
        <div className="inline-block min-w-full">
          {/* Header row */}
          <div className="flex">
            <div className="w-16 h-8"></div> {/* Empty corner */}
            {matrix.symbols.map((symbol, index) => (
              <Div key={symbol}
                className="w-16 h-8 flex items-center justify-center text-xs font-medium text-white/80 border-b border-white/10"
             >
                {symbol}
              </div>
            ))}
          </div>

          {/* Matrix rows */}
          {matrix.correlations.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {/* Row header */}
              <div className="w-16 h-8 flex items-center justify-center text-xs font-medium text-white/80 border-r border-white/10">
                {matrix.symbols[rowIndex]}
              </div>
              
              {/* Correlation cells */}
              {row.map((correlation, colIndex) => (
                <div
                  key={colIndex}
                  className={`
                    w-16 h-8 flex items-center justify-center text-xs font-medium text-white
                    cursor-pointer transition-all duration-200 hover:scale-110 hover:z-10 relative
                    border border-white/5
                    ${getCorrelationColor(correlation)}
                    ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex 
                      ? 'ring-2 ring-yellow-400' 
                      : ''
                    }
                  `}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  title={`${matrix.symbols[rowIndex]} vs ${matrix.symbols[colIndex]}: ${formatCorrelation(correlation)}`}
                >
                  {formatCorrelation(correlation)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Correlation legend */}
      <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-white/60">
        <span>-1.0</span>
        <div className="flex space-x-1">
          <div className="w-4 h-4 bg-red-700"></div>
          <div className="w-4 h-4 bg-red-500"></div>
          <div className="w-4 h-4 bg-red-300"></div>
          <div className="w-4 h-4 bg-gray-400"></div>
          <div className="w-4 h-4 bg-blue-300"></div>
          <div className="w-4 h-4 bg-blue-500"></div>
          <div className="w-4 h-4 bg-blue-700"></div>
          <div className="w-4 h-4 bg-blue-900"></div>
        </div>
        <span>+1.0</span>
      </div>

      {/* Rolling correlation detail */}
      {selectedCell && rollingData && (
        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <h4 className="text-sm font-medium text-white mb-2">
            Rolling Correlation: {matrix.symbols[selectedCell.row]} vs {matrix.symbols[selectedCell.col]}
          </h4>
          <div className="h-32 flex items-end space-x-1">
            {/* TODO: implement mini chart for rolling correlation */}
            {rollingData.correlations.slice(-30).map((point, index) => (
              <Div key={index}
                className="flex-1 bg-blue-500 opacity-70 hover:opacity-100 transition-opacity"
                style={{
                  height: `${Math.abs(point.correlation) * 100}%`,
                  backgroundColor: point.correlation />= 0 ? '#3b82f6' : '#ef4444',
                }}
                title={`${point.date.toLocaleDateString()}: ${point.correlation.toFixed(3)}`}
              ></div>
            ))}
          </div>
        </div>
      )}

      {/* TODO: Add correlation statistics */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="p-2 bg-white/5 rounded">
          <div className="text-xs text-white/60">Avg Correlation</div>
          <div className="text-sm font-medium text-white">
            {calculateAverageCorrelation(matrix).toFixed(3)}
          </div>
        </div>
        <div className="p-2 bg-white/5 rounded">
          <div className="text-xs text-white/60">Max Correlation</div>
          <div className="text-sm font-medium text-white">
            {findMaxCorrelation(matrix).toFixed(3)}
          </div>
        </div>
        <div className="p-2 bg-white/5 rounded">
          <div className="text-xs text-white/60">Min Correlation</div>
          <div className="text-sm font-medium text-white">
            {findMinCorrelation(matrix).toFixed(3)}
          </div>
        </div>
      </div>
    </div>
  );
};

// Utility functions
const generateMockCorrelationMatrix = async (
  symbols: string[], 
  timeframe: string
): Promise<CorrelationMatrix> => {
  // TODO: replace with real correlation calculation
  const correlations = symbols.map((_, i) =>
    symbols.map((_, j) => {
      if (i === j) return 1; // Perfect self-correlation
      return (Math.random() - 0.5) * 2; // Random correlation between -1 and 1
    })
  );

  return {
    symbols,
    correlations,
    timeframe,
    updatedAt: new Date(),
  };
};

const fetchRollingCorrelation = async (
  symbol1: string, 
  symbol2: string, 
  window: number
): Promise<RollingCorrelation> => {
  // TODO: implement real rolling correlation calculation
  return {
    symbol1,
    symbol2,
    window,
    correlations: Array.from({ length: window }, (_, i) => ({
      date: new Date(Date.now() - (window - i) * 24 * 60 * 60 * 1000),
      correlation: (Math.random() - 0.5) * 2,
    })),
  };
};

const calculateAverageCorrelation = (matrix: CorrelationMatrix): number => {
  let sum = 0;
  let count = 0;
  
  for (let i = 0; i < matrix.correlations.length; i++) {
    for (let j = i + 1; j < matrix.correlations[i].length; j++) {
      sum += Math.abs(matrix.correlations[i][j]);
      count++;
    }
  }
  
  return count > 0 ? sum / count : 0;
};

const findMaxCorrelation = (matrix: CorrelationMatrix): number => {
  let max = -1;
  
  for (let i = 0; i < matrix.correlations.length; i++) {
    for (let j = i + 1; j < matrix.correlations[i].length; j++) {
      max = Math.max(max, matrix.correlations[i][j]);
    }
  }
  
  return max;
};

const findMinCorrelation = (matrix: CorrelationMatrix): number => {
  let min = 1;
  
  for (let i = 0; i < matrix.correlations.length; i++) {
    for (let j = i + 1; j < matrix.correlations[i].length; j++) {
      min = Math.min(min, matrix.correlations[i][j]);
    }
  }
  
  return min;
};

export default CorrelationMatrixComponent; 