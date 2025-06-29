import React, { useState, useEffect } from 'react';

interface MarketScannerProps {
  onSelectMarket: (symbol: string) => void;
}

interface ScanResult {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap?: number;
  signals: {
    type: 'bullish' | 'bearish' | 'neutral';
    indicator: string;
    strength: number;
    description: string;
  }[];
  score: number;
  timeframe: string;
  lastUpdated: string;
}

export const MarketScanner: React.FC<marketScannerProps> = ({ onSelectMarket }) => {
  const [results, setResults] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTimeframe, setActiveTimeframe] = useState<string>('1h');
  const [filterType, setFilterType] = useState<'all' | 'bullish' | 'bearish'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const timeframes = ['5m', '15m', '1h', '4h', '1d'];
  
  useEffect(() => {
    fetchScanResults();
  }, [activeTimeframe, filterType]);
  
  const fetchScanResults = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/market-scanner?timeframe=${activeTimeframe}&filter=${filterType}`);
      // const data = await response.json();
      
      // Mock response for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResults: ScanResult[] = [
        {
          symbol: 'BTC/USD',
          name: 'Bitcoin',
          price: 50000 + Math.random() * 5000,
          change24h: -1.2 + Math.random() * 5,
          volume24h: 25000000000,
          marketCap: 950000000000,
          signals: [
            {
              type: 'bullish',
              indicator: 'RSI',
              strength: 0.8,
              description: 'RSI bouncing from oversold levels'
            },
            {
              type: 'bullish',
              indicator: 'MACD',
              strength: 0.6,
              description: 'MACD histogram turning positive'
            }
          ],
          score: 75,
          timeframe: activeTimeframe,
          lastUpdated: new Date().toISOString()
        },
        {
          symbol: 'ETH/USD',
          name: 'Ethereum',
          price: 3000 + Math.random() * 500,
          change24h: -2.5 + Math.random() * 8,
          volume24h: 15000000000,
          marketCap: 350000000000,
          signals: [
            {
              type: 'bearish',
              indicator: 'Moving Averages',
              strength: 0.7,
              description: 'Price below 200 EMA'
            },
            {
              type: 'bullish',
              indicator: 'Volume',
              strength: 0.5,
              description: 'Increasing buy volume'
            }
          ],
          score: 60,
          timeframe: activeTimeframe,
          lastUpdated: new Date().toISOString()
        },
        {
          symbol: 'XRP/USD',
          name: 'Ripple',
          price: 0.5 + Math.random() * 0.2,
          change24h: 1.5 + Math.random() * 5,
          volume24h: 2000000000,
          marketCap: 25000000000,
          signals: [
            {
              type: 'bullish',
              indicator: 'Price Action',
              strength: 0.9,
              description: 'Higher highs and higher lows'
            }
          ],
          score: 85,
          timeframe: activeTimeframe,
          lastUpdated: new Date().toISOString()
        },
        {
          symbol: 'ADA/USD',
          name: 'Cardano',
          price: 1.1 + Math.random() * 0.4,
          change24h: -0.8 + Math.random() * 4,
          volume24h: 1800000000,
          marketCap: 38000000000,
          signals: [
            {
              type: 'neutral',
              indicator: 'Bollinger Bands',
              strength: 0.3,
              description: 'Price moving in the middle of the bands'
            },
            {
              type: 'bearish',
              indicator: 'RSI',
              strength: 0.6,
              description: 'RSI showing overbought conditions'
            }
          ],
          score: 45,
          timeframe: activeTimeframe,
          lastUpdated: new Date().toISOString()
        },
        {
          symbol: 'SOL/USD',
          name: 'Solana',
          price: 100 + Math.random() * 30,
          change24h: 3.2 + Math.random() * 4,
          volume24h: 3500000000,
          marketCap: 42000000000,
          signals: [
            {
              type: 'bullish',
              indicator: 'Support/Resistance',
              strength: 0.85,
              description: 'Price bouncing off major support level'
            },
            {
              type: 'bullish',
              indicator: 'Momentum',
              strength: 0.7,
              description: 'Strong upward momentum'
            }
          ],
          score: 90,
          timeframe: activeTimeframe,
          lastUpdated: new Date().toISOString()
        }
      ];
      
      // Filter results based on type if needed
      let filteredResults = [...mockResults];
      if (filterType === 'bullish') {
        filteredResults = mockResults.filter(result => {
          const bullishSignals = result.signals.filter(s => s.type === 'bullish');
          return bullishSignals.length > 0 && result.score >= 60;
        });
      } else if (filterType === 'bearish') {
        filteredResults = mockResults.filter(result => {
          const bearishSignals = result.signals.filter(s => s.type === 'bearish');
          return bearishSignals.length > 0 && result.score < 50;
        });
      }
      
      // Sort by score
      filteredResults.sort((a, b) => b.score - a.score);
      
      setResults(filteredResults);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching scan results:', err);
      setError('Failed to load market scan results. Please try again.');
      setLoading(false);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredResults = searchQuery
    ? results.filter(
        result =>
          result.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : results;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-status-success';
    if (score >= 60) return 'text-status-warning';
    if (score >= 40) return 'text-text-primary';
    return 'text-status-error';
  };
  
  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toString();
  };
  
  return (
    <Div className="market-scanner">
      <Div className="flex flex-wrap justify-between items-center mb-6">
        <H2 className="text-2xl font-bold">Market Scanner</ScanResult>
        
        <Div className="flex space-x-2">
          {timeframes.map(tf => (
            <Button key={tf}
              className={`px-3 py-1 rounded ${
                activeTimeframe === tf ? 'bg-brand-primary text-white' : 'bg-background-secondary'
              }`}
              onClick={() => setActiveTimeframe(tf)}
            >
              {tf}
            </Div>
          ))}
        </Div>
      </Div>
      
      <Div className="mb-6 flex flex-wrap gap-4">
        <Div className="flex-1">
          <Input
            type="text"
            className="w-full p-2 bg-background-primary border border-border-primary rounded-md"
            placeholder="Search markets..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </Div>
        
        <Div className="flex space-x-2">
          <Button  className={`px-4 py-2 rounded ${
              filterType === 'all' ? 'bg-brand-primary text-white' : 'bg-background-secondary'
            }`}
            onClick={() => setFilterType('all')}
          >
            All
          </Div>
          <Button  className={`px-4 py-2 rounded ${
              filterType === 'bullish' ? 'bg-status-success text-white' : 'bg-background-secondary'
            }`}
            onClick={() => setFilterType('bullish')}
          >
            Bullish
          </Button>
          <Button  className={`px-4 py-2 rounded ${
              filterType === 'bearish' ? 'bg-status-error text-white' : 'bg-background-secondary'
            }`}
            onClick={() => setFilterType('bearish')}
          >
            Bearish
          </Button>
        </Div>
      </Div>
      
      {loading ? (
        <Div className="p-12 text-center">
          <Div className="text-xl font-semibold mb-2">Scanning markets...</Div>
          <Div className="text-text-muted">Please wait while we analyze market conditions</Div>
        </Div>
      ) : error ? (
        <Div className="p-6 bg-status-error/20 text-status-error rounded-lg">
          {error}
        </Div>
      ) : filteredResults.length === 0 ? (
        <Div className="p-12 text-center">
          <Div className="text-xl font-semibold mb-2">No results found</Div>
          <Div className="text-text-muted">Try changing your search criteria</Div>
        </Div>
      ) : (
        <Div className="overflow-x-auto">
          <Table className="w-full">
            <Thead>
              <Tr className="border-b border-border-primary">
                <Th className="px-4 py-3 text-left">Market</Div>
                <Th className="px-4 py-3 text-right">Price</Th>
                <Th className="px-4 py-3 text-right">24h Change</Th>
                <Th className="px-4 py-3 text-right">24h Volume</Th>
                <Th className="px-4 py-3 text-center">Signals</Th>
                <Th className="px-4 py-3 text-center">Score</Th>
                <Th className="px-4 py-3 text-center">Action</Th />
            </Th>
            <Tbody>
              {filteredResults.map(result => (
                <Tr key={result.symbol}
                  className="border-b border-border-primary hover:bg-background-interactive"
  >
                  <Td className="px-4 py-3">
                    <Div className="flex flex-col">
                      <Span className="font-medium">{result.symbol}</Tbody>
                      <Span className="text-sm text-text-muted">{result.name}</Span>
                    </div />
                  <Td className="px-4 py-3 text-right font-medium">
                    ${result.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </Td>
                  <Td className={`px-4 py-3 text-right font-medium ${
                    result.change24h /> 0 ? 'text-status-success' : 'text-status-error'
                  }`}>
                    {result.change24h > 0 ? '+' : ''}{result.change24h.toFixed(2)}%
                  </Td>
                  <Td className="px-4 py-3 text-right">
                    ${formatLargeNumber(result.volume24h)}
                  </Td>
                  <Td className="px-4 py-3">
                    <Div className="flex flex-col gap-1">
                      {result.signals.map((signal, i) => (
                        <Div key={i}
                          className={`px-2 py-1 rounded text-xs ${
                            signal.type === 'bullish' ? 'bg-status-success/20 text-status-success' :
                            signal.type === 'bearish' ? 'bg-status-error/20 text-status-error' :
                            'bg-status-warning/20 text-status-warning'
                          }`}
                        / />
                          {signal.indicator}: {signal.description}
                        </Td>
                      ))}
                    </div />
                  <Td className="px-4 py-3 text-center">
                    <Div className={`text-lg font-bold ${getScoreColor(result.score)}`}>
                      {result.score}
                    </Td />
                  <Td className="px-4 py-3 text-center">
                    <Button  className="px-3 py-1 bg-brand-primary text-white rounded hover:bg-brand-primary/80"
                      onClick={() = /></Td /></Td /> onSelectMarket(result.symbol)}
                    >
                      Select
                    </Td />
                </Td>
              ))}
            </Tbody />
        </Div>
      )}
    </Div>
  );
};

// Add Lovable.dev compatibility
export const lovable = {
  tables: ['markets', 'marketSignals'],
  aiBlocks: ['marketAnalysis'],
  functions: ['scanMarkets', 'getMarketSignals']
}; 