import React, { useState, useEffect } from 'react';
import {
  generateCorrelationMatrix,
  getCorrelationColor,
  getCorrelationColorPalette,
  type ColorPaletteTheme,
  type CorrelationMatrix,
  type CorrelationTimePeriod
} from '@/lib/markets/market-correlation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Star, StarOff, AlertTriangle, Info, Settings, RefreshCw } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { useMarketCorrelations } from '@/lib/realtime/useMarketCorrelations';

const DEFAULT_ASSETS = ['BTC', 'ETH', 'XRP', 'SOL', 'SPY', 'QQQ', 'GOLD', 'SILVER', 'CRUDE'];

interface CorrelationHeatmapProps {
  assets?: string[];
  defaultTimePeriod?: CorrelationTimePeriod;
  defaultTheme?: ColorPaletteTheme;
  onCorrelationChange?: (baseAsset: string, quoteAsset: string, correlation: number) => void;
  onFavoriteToggle?: (baseAsset: string, quoteAsset: string, isFavorite: boolean) => void;
  userId?: string;
  showSettings?: boolean;
  className?: string;
}

// LOVABLE:AI_BLOCK id="correlation_heatmap" type="react_component"
const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({
  assets = DEFAULT_ASSETS,
  defaultTimePeriod = '30d',
  defaultTheme = 'blueRed',
  onCorrelationChange,
  onFavoriteToggle,
  userId,
  showSettings = true,
  className = ''
}) => {
  // State
  const [correlationMatrix, setCorrelationMatrix] = useState<CorrelationMatrix | null />(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [colorTheme, setColorTheme] = useState<ColorPaletteTheme>(defaultTheme);
  const [timePeriod, setTimePeriod] = useState<CorrelationTimePeriod>(defaultTimePeriod);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [favorites, setFavorites] = useState<array<{ base: string; quote: string }>>([]); // Simplified version without DB interaction
  const [showCorrelationValue, setShowCorrelationValue] = useState(true);
  const [viewMode, setViewMode] = useState<'all' | 'favorites'>('all');

  const { data: realtimeRows, refresh: refreshRealtime } = useMarketCorrelations({ timeframe: timePeriod, autoSubscribe: true });

  // Generate color palette
  const colorPalette = getCorrelationColorPalette(colorTheme);

  // LOVABLE:FUNCTION id="fetchCorrelations" endpoint="/api/markets/correlations"
  // Fetch correlation data (initial + on realtimeRows change)
  useEffect(() => {
    const fetchCorrelations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use assets filtered for view mode
        const assetsToUse = viewMode === 'favorites' 
          ? Array.from(new Set(favorites.flatMap(f => [f.base, f.quote])))
          : assets;
        
        if (assetsToUse.length === 0) {
          setCorrelationMatrix(null);
          setLoading(false);
          return;
        }
        
        const matrix = await generateCorrelationMatrix(assetsToUse, timePeriod);
        setCorrelationMatrix(matrix);
      } catch (err) {
        console.error('Error fetching correlation data:', err);
        setError('Failed to load correlation data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCorrelations();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchCorrelations, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [assets, timePeriod, viewMode, favorites, realtimeRows]);

  // Handle cell click
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (rowIndex === colIndex) return; // Skip diagonal
    
    const baseAsset = correlationMatrix?.assets[rowIndex];
    const quoteAsset = correlationMatrix?.assets[colIndex];
    const correlation = correlationMatrix?.matrix[rowIndex][colIndex];
    
    if (baseAsset && quoteAsset && correlation !== undefined) {
      setSelectedCell({ row: rowIndex, col: colIndex });
      
      if (onCorrelationChange) {
        onCorrelationChange(baseAsset, quoteAsset, correlation);
      }
    }
  };

  // LOVABLE:FUNCTION id="toggleFavoritePair" endpoint="/api/markets/favorite-pair"
  // Handle favorite toggle
  const handleToggleFavorite = (baseAsset: string, quoteAsset: string) => {
    const isFavorite = favorites.some(
      f => (f.base === baseAsset && f.quote === quoteAsset) || 
           (f.base === quoteAsset && f.quote === baseAsset)
    );
    
    if (isFavorite) {
      // Remove from favorites
      setFavorites(favorites.filter(
        f => !((f.base === baseAsset && f.quote === quoteAsset) || 
              (f.base === quoteAsset && f.quote === baseAsset))
      ));
    } else {
      // Add to favorites
      setFavorites([...favorites, { base: baseAsset, quote: quoteAsset }]);
    }
    
    if (onFavoriteToggle) {
      onFavoriteToggle(baseAsset, quoteAsset, !isFavorite);
    }
  };

  // Format correlation value for display
  const formatCorrelation = (value: number): string => {
    return value.toFixed(2);
  };

  // Check if a pair is in favorites
  const isFavoritePair = (baseAsset: string, quoteAsset: string): boolean => {
    return favorites.some(
      f => (f.base === baseAsset && f.quote === quoteAsset) || 
           (f.base === quoteAsset && f.quote === baseAsset)
    );
  };

  // Get CSS class for correlation value for text color
  const getCorrelationTextClass = (value: number): string => {
    if (value === 1) return 'text-white';
    if (value > 0.7) return 'text-white';
    if (value > 0.3) return 'text-white';
    if (value < -0.3) return 'text-white';
    if (value < -0.7) return 'text-white';
    return 'text-gray-900';
  };

  // Render loading state
  if (loading && !correlationMatrix) {
    return (
      <Card className={`${className}`} />
        <CardHeader>
          <CardTitle>Market Correlations</CorrelationHeatmapProps>
          <CardDescription>Loading correlation data...</CardDescription>
        </CardHeader>
        <CardContent className="pt-6" />
          <Div className="flex justify-center items-center h-64">
            <Div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></CardContent>
          </Div>
        </CardContent>
      </Card>
    );
  }

  // Render error state
  if (error && !correlationMatrix) {
    return (
      <Card className={`${className}`} />
        <CardHeader>
          <CardTitle>Market Correlations</Card>
          <CardDescription>An error occurred</CardDescription>
        </CardHeader>
        <CardContent>
          <Div className="flex flex-col items-center justify-center h-64">
            <alertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <P>{error}</CardContent>
            <Button onClick={() => setLoading(true)} className="mt-4">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </Div>
        </CardContent>
      </Card>
    );
  }

  // Render no data state
  if (!correlationMatrix || correlationMatrix.assets.length === 0) {
    return (
      <Card className={`${className}`} />
        <CardHeader>
          <CardTitle>Market Correlations</Card>
          <CardDescription>No correlation data available</CardDescription>
        </CardHeader>
        <CardContent>
          <Div className="flex flex-col items-center justify-center h-64">
            <info className="h-12 w-12 text-gray-400 mb-4" />
            <P>No assets available for correlation analysis</CardContent>
            {viewMode === 'favorites' && favorites.length === 0 && (
              <P className="text-sm text-gray-500 mt-2">Add some favorite pairs to view them here</P>
            )}
            {viewMode === 'favorites' && (
              <Button variant="outline" 
                onClick={() = /> setViewMode('all')} 
                className="mt-4"
              >
                View All Assets
              </Button>
            )}
          </Div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} overflow-hidden`} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" />
        <Div>
          <CardTitle>Market Correlations</Card>
          <CardDescription>
            Data from {correlationMatrix.metadata.lastUpdated ? new Date(correlationMatrix.metadata.lastUpdated).toLocaleString() : 'unknown'}
          </CardDescription>
        </Div>
        
        {showSettings && (
          <Div className="flex items-center space-x-2">
            <Select
              value={timePeriod}
              onValueChange={(value) => setTimePeriod(value as CorrelationTimePeriod)}
            >
              <selectTrigger className="w-[100px] h-8">
                <selectValue placeholder="Time Period" />
              </Div>
              <selectContent>
                <selectItem value="1d">1 Day</SelectItem>
                <selectItem value="7d">1 Week</SelectItem>
                <selectItem value="30d">1 Month</SelectItem>
                <selectItem value="90d">3 Months</SelectItem>
                <selectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={colorTheme}
              onValueChange={(value) => setColorTheme(value as ColorPaletteTheme)}
            >
              <selectTrigger className="w-[120px] h-8">
                <selectValue placeholder="Color Theme" />
              </Select>
              <selectContent>
                <selectItem value="blueRed">Blue-Red</SelectItem>
                <selectItem value="greenRed">Green-Red</SelectItem>
                <selectItem value="purpleGreen">Purple-Green</SelectItem>
                <selectItem value="orangeBlue">Orange-Blue</SelectItem>
                <selectItem value="monochrome">Monochrome</SelectItem>
                <selectItem value="highContrast">High Contrast</SelectItem>
                <selectItem value="pastel">Pastel</SelectItem>
              </SelectContent>
            </Select>
          </Div>
        )}
      </CardHeader>
      
      <CardContent className="p-0" />
        <Tabs value={viewMode} onValueChange={(v) = /> setViewMode(v as 'all' | 'favorites')}>
          <Div className="border-b px-4">
            <TabsList className="bg-transparent border-b-0" />
              <TabsTrigger value="all"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
          >
                All Assets
              </CardContent>
              <TabsTrigger value="favorites"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
          >
                Favorites
              </TabsTrigger>
            </TabsList>
            <Div className="flex justify-end items-center py-2 gap-2">
              <Toggle aria-label="Show values"
                pressed={showCorrelationValue}
                onPressedChange={setShowCorrelationValue}
                size="sm"
                className="text-xs h-7"
          >
                Show Values
              </Div>
              <Button variant="ghost" 
                size="icon" 
                onClick={() = /> setLoading(true)}
                className="h-7 w-7"
                title="Refresh data"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </Div>
          </Div>
          
          <TabsContent value="all" className="m-0" />
            {renderHeatmap(correlationMatrix)}
          </TabsContent>
          
          <TabsContent value="favorites" className="m-0" />
            {favorites.length === 0 ? (
              <Div className="flex flex-col items-center justify-center p-8 text-center">
                <StarOff className="h-8 w-8 text-gray-400 mb-4" />
                <P className="text-gray-500">No favorite correlations yet</TabsContent>
                <P className="text-sm text-gray-400 mt-2">Click on any correlation cell and use the star icon to add favorites</P>
              </Div>
            ) : (
              renderHeatmap(correlationMatrix)
            )}
          </TabsContent>
        </Tabs>
        
        {/* Legend */}
        <Div className="p-4 pt-0">
          <Div className="flex items-center justify-center mt-4 space-x-1 text-xs">
            <Span className="text-gray-500">-1</Div>
            <Div className="flex h-4">
              {colorPalette.map((color, i) => (
                <Tooltip key={i} />
                  <TooltipTrigger asChild />
                    <Div
                      className="w-5 h-4 cursor-help"
                      style={{ backgroundColor: color }}
                    />
                  </Div>
                  <TooltipContent side="bottom" />
                    {-1 + (i * 0.25)}
                  </TooltipContent>
                </Tooltip>
              ))}
            </Div>
            <Span className="text-gray-500">+1</Span>
          </Div>
          
          {selectedCell && (
            <Div className="mt-4 pt-4 border-t">
              <Div className="flex justify-between items-center">
                <H4 className="text-sm font-medium">
                  {correlationMatrix.assets[selectedCell.row]} / {correlationMatrix.assets[selectedCell.col]}
                </Div>
                
                <Badge variant={getCorrelationBadgeVariant(correlationMatrix.matrix[selectedCell.row][selectedCell.col])}
           >
                  {formatCorrelation(correlationMatrix.matrix[selectedCell.row][selectedCell.col])}
                </Badge>
                
                <Button variant="ghost"
                  size="icon"
                  onClick={() = /> {
                    const baseAsset = correlationMatrix.assets[selectedCell.row];
                    const quoteAsset = correlationMatrix.assets[selectedCell.col];
                    handleToggleFavorite(baseAsset, quoteAsset);
                  }}
                >
                  {isFavoritePair(
                    correlationMatrix.assets[selectedCell.row],
                    correlationMatrix.assets[selectedCell.col]
                  ) ? (
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ) : (
                    <Star className="h-4 w-4" />
                  )}
                </Button>
              </Div>
              
              <P className="text-sm text-gray-500 mt-2">
                {getCorrelationDescription(correlationMatrix.matrix[selectedCell.row][selectedCell.col])}
              </P>
            </Div>
          )}
        </Div>
      </CardContent>
    </Card>
  );

  function renderHeatmap(matrix: CorrelationMatrix) {
    const { assets } = matrix;
    
    // If viewing favorites, filter assets
    const displayedAssets = viewMode === 'favorites'
      ? assets.filter(asset => 
          favorites.some(f => f.base === asset || f.quote === asset)
        )
      : assets;
    
    if (displayedAssets.length === 0) return null;
    
    return (
      <Div className="heatmap-container overflow-auto p-4">
        {/* Column headers */}
        <Div className="flex ml-12">
          {displayedAssets.map((asset, i) => (
            <Div key={`header-${i}`} 
              className="w-12 h-12 flex items-center justify-center font-medium text-sm"
              style={{
                transform: 'rotate(-45deg)',
              }}
           />
              {asset}
            </Div>
          ))}
        </Div>
        
        {/* Correlation rows */}
        {displayedAssets.map((rowAsset, rowIndex) => {
          const originalRowIndex = assets.indexOf(rowAsset);
          
          return (
            <Div key={`row-${rowIndex}`} className="flex">
              {/* Row header */}
              <Div className="w-12 h-12 flex items-center justify-center font-medium text-sm">
                {rowAsset}
              </Div>
              
              {/* Correlation cells */}
              {displayedAssets.map((colAsset, colIndex) => {
                const originalColIndex = assets.indexOf(colAsset);
                const correlation = matrix.matrix[originalRowIndex][originalColIndex];
                const isSelected = 
                  selectedCell &&
                  assets[selectedCell.row] === rowAsset && 
                  assets[selectedCell.col] === colAsset;
                
                return (
                  <Tooltip key={`cell-${rowIndex}-${colIndex}`} />
                    <TooltipTrigger asChild />
                      <Div
                        className={`
                          w-12 h-12 flex items-center justify-center text-xs font-medium
                          cursor-pointer transition-all duration-200 hover:scale-105
                          border border-white/5
                          ${isSelected ? 'ring-2 ring-white' : ''}
                          ${getCorrelationTextClass(correlation)}
                        `}
                        style={{ backgroundColor: getCorrelationColor(correlation, colorPalette) }}
                        onClick={() => handleCellClick(originalRowIndex, originalColIndex)}
                      >
                        {showCorrelationValue && formatCorrelation(correlation)}
                      </Tooltip>
                    </TooltipTrigger>
                    <TooltipContent>
                      <Div className="text-center">
                        <Div className="font-bold">{rowAsset} / {colAsset}</TooltipContent>
                        <Div className="text-sm">{formatCorrelation(correlation)}</Div>
                        <Div className="text-xs opacity-80">
                          {getCorrelationTooltip(correlation)}
                        </Div>
                      </Div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </Div>
          );
        })}
      </Div>
    );
  }
};

// Helper functions
function getCorrelationBadgeVariant(value: number): "default" | "destructive" | "outline" | "secondary" {
  if (value > 0.7) return "default";
  if (value < -0.7) return "destructive";
  if (Math.abs(value) > 0.4) return "secondary";
  return "outline";
}

function getCorrelationDescription(value: number): string {
  const absValue = Math.abs(value);
  const direction = value > 0 ? "positive" : "negative";
  
  if (absValue > 0.9) {
    return `Very strong ${direction} correlation - these assets move ${value > 0 ? 'together' : 'in opposite directions'} almost perfectly.`;
  } else if (absValue > 0.7) {
    return `Strong ${direction} correlation - these assets tend to move ${value > 0 ? 'together' : 'in opposite directions'} most of the time.`;
  } else if (absValue > 0.5) {
    return `Moderate ${direction} correlation - these assets often move ${value > 0 ? 'together' : 'in opposite directions'}.`;
  } else if (absValue > 0.3) {
    return `Weak ${direction} correlation - these assets sometimes move ${value > 0 ? 'together' : 'in opposite directions'}.`;
  } else {
    return `Very weak or no correlation - these assets move independently of each other.`;
  }
}

function getCorrelationTooltip(value: number): string {
  const absValue = Math.abs(value);
  if (absValue > 0.9) return "Very Strong";
  if (absValue > 0.7) return "Strong";
  if (absValue > 0.5) return "Moderate";
  if (absValue > 0.3) return "Weak";
  return "Very Weak / None";
}

export default CorrelationHeatmap;
export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
