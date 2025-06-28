import React, { useState, useEffect } from 'react';
import { HeatmapData, HeatmapCell, Strategy } from './types';

interface VaultHeatmapProps {
  strategyId: string;
  timeframe?: 'hourly' | 'daily' | 'weekly';
  metric?: 'winRate' | 'profitFactor' | 'expectancy' | 'volume';
  colorScale?: 'green-red' | 'blue-purple' | 'yellow-orange';
  showLabels?: boolean;
  onCellClick?: (cell: HeatmapCell) => void;
}

export const VaultHeatmap: React.FC<VaultHeatmapProps> = ({
  strategyId,
  timeframe = 'daily',
  metric = 'winRate',
  colorScale = 'green-red',
  showLabels = true,
  onCellClick
}) => {
  const [heatmapData, setHeatmapData] = useState<HeatmapData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);

  // Generate color based on value and selected color scale
  const getColor = (value: number): string => {
    if (colorScale === 'green-red') {
      // Green to red scale (good to bad)
      if (value > 0.7) return 'rgba(0, 255, 0, 0.8)';
      if (value > 0.5) return 'rgba(144, 238, 144, 0.8)';
      if (value > 0.3) return 'rgba(255, 255, 0, 0.8)';
      if (value > 0.1) return 'rgba(255, 165, 0, 0.8)';
      return 'rgba(255, 0, 0, 0.8)';
    } else if (colorScale === 'blue-purple') {
      // Blue to purple scale
      if (value > 0.7) return 'rgba(0, 0, 255, 0.8)';
      if (value > 0.5) return 'rgba(65, 105, 225, 0.8)';
      if (value > 0.3) return 'rgba(138, 43, 226, 0.8)';
      if (value > 0.1) return 'rgba(186, 85, 211, 0.8)';
      return 'rgba(238, 130, 238, 0.8)';
    } else {
      // Yellow to orange scale
      if (value > 0.7) return 'rgba(255, 255, 0, 0.8)';
      if (value > 0.5) return 'rgba(255, 215, 0, 0.8)';
      if (value > 0.3) return 'rgba(255, 165, 0, 0.8)';
      if (value > 0.1) return 'rgba(255, 140, 0, 0.8)';
      return 'rgba(255, 69, 0, 0.8)';
    }
  };

  // Fetch heatmap data
  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        setLoading(true);
        
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/strategies/${strategyId}/heatmap?timeframe=${timeframe}&metric=${metric}`);
        // const data = await response.json();
        
        // For now, generate mock data
        const mockData = generateMockHeatmapData(strategyId, timeframe);
        
        setHeatmapData(mockData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load heatmap data');
        setLoading(false);
      }
    };

    fetchHeatmapData();
  }, [strategyId, timeframe, metric]);

  // Generate labels based on timeframe
  const getLabels = (): { xLabels: string[], yLabels: string[] } => {
    if (timeframe === 'hourly') {
      return {
        xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        yLabels: Array.from({ length: 24 }, (_, i) => `${i}:00`)
      };
    } else if (timeframe === 'daily') {
      return {
        xLabels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        yLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5']
      };
    } else {
      return {
        xLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        yLabels: ['2020', '2021', '2022', '2023']
      };
    }
  };

  const { xLabels, yLabels } = getLabels();

  // Mock data generator
  const generateMockHeatmapData = (strategyId: string, timeframe: string): HeatmapData => {
    let rows = 0;
    let cols = 0;
    
    if (timeframe === 'hourly') {
      rows = 24; // 24 hours
      cols = 5;  // 5 weekdays
    } else if (timeframe === 'daily') {
      rows = 5;  // 5 weeks
      cols = 7;  // 7 days
    } else {
      rows = 4;  // 4 years
      cols = 12; // 12 months
    }
    
    const data: HeatmapCell[][] = [];
    
    for (let y = 0; y < rows; y++) {
      const row: HeatmapCell[] = [];
      for (let x = 0; x < cols; x++) {
        // Generate random performance value between 0 and 1
        const value = Math.random();
        // Generate random number of trades between 0 and 50
        const trades = Math.floor(Math.random() * 50);
        
        row.push({ x, y, value, trades });
      }
      data.push(row);
    }
    
    return {
      strategyId,
      timeframe,
      data
    };
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading heatmap data...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  if (!heatmapData || !heatmapData.data.length) {
    return <div className="p-4">No heatmap data available for this strategy.</div>;
  }

  return (
    <div className="vault-heatmap">
      <div className="flex flex-col">
        {/* Render X-axis labels if showLabels is true */}
        {showLabels && (
          <div className="flex ml-10">
            {xLabels.map((label, idx) => (
              <div 
                key={`x-${idx}`} 
                className="text-xs text-center" 
                style={{ width: '40px' }}
              >
                {label}
              </div>
            ))}
          </div>
        )}
        
        {/* Render heatmap grid */}
        <div className="flex">
          {/* Render Y-axis labels if showLabels is true */}
          {showLabels && (
            <div className="flex flex-col justify-around pr-2 w-10">
              {yLabels.map((label, idx) => (
                <div 
                  key={`y-${idx}`} 
                  className="text-xs text-right" 
                  style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
                >
                  {label}
                </div>
              ))}
            </div>
          )}
          
          {/* Render cells */}
          <div className="flex flex-col">
            {heatmapData.data.map((row, rowIdx) => (
              <div key={`row-${rowIdx}`} className="flex">
                {row.map((cell, cellIdx) => (
                  <div
                    key={`cell-${rowIdx}-${cellIdx}`}
                    className="cursor-pointer transition-all duration-200 hover:transform hover:scale-105"
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: getColor(cell.value),
                      margin: '1px',
                      borderRadius: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onClick={() => onCellClick && onCellClick(cell)}
                    onMouseEnter={() => setHoveredCell(cell)}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    {cell.trades > 0 && (
                      <span className="text-xs font-bold text-white">
                        {cell.trades}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Tooltip for hovered cell */}
      {hoveredCell && (
        <div className="absolute bg-gray-800 text-white p-2 rounded shadow-lg text-xs">
          <div>Value: {(hoveredCell.value * 100).toFixed(1)}%</div>
          <div>Trades: {hoveredCell.trades}</div>
          <div>
            {timeframe === 'hourly' 
              ? `${xLabels[hoveredCell.x]} at ${yLabels[hoveredCell.y]}`
              : timeframe === 'daily'
                ? `${xLabels[hoveredCell.x]} of ${yLabels[hoveredCell.y]}`
                : `${xLabels[hoveredCell.x]} ${yLabels[hoveredCell.y]}`
            }
          </div>
        </div>
      )}
      
      {/* Legend */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center">
          <span className="text-xs mr-1">Poor</span>
          <div className="flex">
            {[0.1, 0.3, 0.5, 0.7, 0.9].map((value, idx) => (
              <div
                key={`legend-${idx}`}
                style={{
                  width: '20px',
                  height: '10px',
                  backgroundColor: getColor(value),
                }}
              />
            ))}
          </div>
          <span className="text-xs ml-1">Excellent</span>
        </div>
      </div>
    </div>
  );
};

// Add Lovable.dev compatibility
export const lovable = {
  tables: ['strategies', 'trades'],
  aiBlocks: ['strategyAnalysis'],
  functions: ['getHeatmapData', 'analyzeTimePatterns']
}; 