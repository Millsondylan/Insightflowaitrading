
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Toggle } from '../ui/toggle';
import { Skeleton } from '../ui/skeleton';
import { RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CorrelationData {
  pair1: string;
  pair2: string;
  correlation: number;
  strength: 'weak' | 'moderate' | 'strong';
  direction: 'positive' | 'negative' | 'neutral';
}

interface CorrelationHeatmapProps {
  data?: CorrelationData[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

const mockCorrelationData: CorrelationData[] = [
  { pair1: 'EURUSD', pair2: 'GBPUSD', correlation: 0.82, strength: 'strong', direction: 'positive' },
  { pair1: 'EURUSD', pair2: 'USDJPY', correlation: -0.65, strength: 'moderate', direction: 'negative' },
  { pair1: 'EURUSD', pair2: 'USDCHF', correlation: -0.91, strength: 'strong', direction: 'negative' },
  { pair1: 'GBPUSD', pair2: 'USDJPY', correlation: -0.45, strength: 'moderate', direction: 'negative' },
  { pair1: 'GBPUSD', pair2: 'USDCHF', correlation: -0.76, strength: 'strong', direction: 'negative' },
  { pair1: 'USDJPY', pair2: 'USDCHF', correlation: 0.58, strength: 'moderate', direction: 'positive' },
];

const getCorrelationColor = (correlation: number) => {
  const abs = Math.abs(correlation);
  if (abs >= 0.8) return correlation > 0 ? 'bg-green-500' : 'bg-red-500';
  if (abs >= 0.5) return correlation > 0 ? 'bg-green-400' : 'bg-red-400';
  if (abs >= 0.3) return correlation > 0 ? 'bg-green-300' : 'bg-red-300';
  return 'bg-gray-300';
};

const getCorrelationIcon = (direction: string) => {
  switch (direction) {
    case 'positive': return <TrendingUp className="w-4 h-4" />;
    case 'negative': return <TrendingDown className="w-4 h-4" />;
    default: return <Minus className="w-4 h-4" />;
  }
};

export default function CorrelationHeatmap({ data = mockCorrelationData, isLoading = false, onRefresh }: CorrelationHeatmapProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');
  const [selectedMarket, setSelectedMarket] = useState('forex');
  const [showOnlyStrong, setShowOnlyStrong] = useState(false);
  const [activeTab, setActiveTab] = useState('heatmap');

  const filteredData = data.filter(item => 
    showOnlyStrong ? item.strength === 'strong' : true
  );

  const uniquePairs = Array.from(new Set([
    ...data.map(item => item.pair1),
    ...data.map(item => item.pair2)
  ]));

  const getCorrelationValue = (pair1: string, pair2: string) => {
    if (pair1 === pair2) return 1;
    const found = data.find(
      item => (item.pair1 === pair1 && item.pair2 === pair2) ||
              (item.pair1 === pair2 && item.pair2 === pair1)
    );
    return found ? found.correlation : 0;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Market Correlations</h2>
          <p className="text-muted-foreground">
            Real-time correlation analysis between trading pairs
          </p>
        </div>
        <Button onClick={onRefresh} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5M">5 Minutes</SelectItem>
            <SelectItem value="15M">15 Minutes</SelectItem>
            <SelectItem value="1H">1 Hour</SelectItem>
            <SelectItem value="4H">4 Hours</SelectItem>
            <SelectItem value="1D">1 Day</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedMarket} onValueChange={setSelectedMarket}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Market" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="forex">Forex</SelectItem>
            <SelectItem value="crypto">Crypto</SelectItem>
            <SelectItem value="stocks">Stocks</SelectItem>
            <SelectItem value="commodities">Commodities</SelectItem>
            <SelectItem value="indices">Indices</SelectItem>
            <SelectItem value="bonds">Bonds</SelectItem>
            <SelectItem value="all">All Markets</SelectItem>
          </SelectContent>
        </Select>

        <Toggle pressed={showOnlyStrong} onPressedChange={setShowOnlyStrong}>
          Strong Only
        </Toggle>

        <Button variant="outline" size="sm">
          Export Data
        </Button>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="heatmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Correlation Heatmap</CardTitle>
              <CardDescription>
                Color intensity represents correlation strength. Green = positive, Red = negative.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredData.map((item, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getCorrelationIcon(item.direction)}
                        <span className="font-medium">{item.pair1}</span>
                        <span className="text-muted-foreground">vs</span>
                        <span className="font-medium">{item.pair2}</span>
                      </div>
                      <Badge variant={item.strength === 'strong' ? 'default' : 'secondary'}>
                        {item.strength}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-4 h-4 rounded ${getCorrelationColor(item.correlation)}`}
                      />
                      <span className="text-lg font-bold">
                        {item.correlation.toFixed(2)}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Correlation List</CardTitle>
              <CardDescription>
                Detailed list of all correlation pairs with numerical values.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getCorrelationIcon(item.direction)}
                      <span className="font-medium">{item.pair1} / {item.pair2}</span>
                      <Badge variant="outline" className="text-xs">
                        {item.strength}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-3 h-3 rounded-full ${getCorrelationColor(item.correlation)}`}
                      />
                      <span className="font-mono text-sm">
                        {item.correlation.toFixed(3)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Market Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Pairs:</span>
                    <span className="font-medium">{data.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Strong Correlations:</span>
                    <span className="font-medium">
                      {data.filter(item => item.strength === 'strong').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Positive Correlations:</span>
                    <span className="font-medium">
                      {data.filter(item => item.direction === 'positive').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Negative Correlations:</span>
                    <span className="font-medium">
                      {data.filter(item => item.direction === 'negative').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trading Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <p>
                    <strong>Risk Management:</strong> High positive correlations indicate 
                    similar price movements. Avoid over-leveraging on correlated pairs.
                  </p>
                  <p>
                    <strong>Diversification:</strong> Negative correlations can help 
                    balance portfolio risk during market volatility.
                  </p>
                  <p>
                    <strong>Opportunity:</strong> Strong correlations may indicate 
                    arbitrage opportunities when price movements diverge temporarily.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
