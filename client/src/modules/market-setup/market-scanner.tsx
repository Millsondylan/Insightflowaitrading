
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

export const MarketScanner: React.FC<MarketScannerProps> = ({ onSelectMarket }) => {
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
        }
      ];
      
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
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-gray-500';
    return 'text-red-500';
  };
  
  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toString();
  };
  
  return (
    <div className="market-scanner">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Market Scanner</h2>
        
        <div className="flex space-x-2">
          {timeframes.map(tf => (
            <Button key={tf}
              className={`px-3 py-1 rounded ${
                activeTimeframe === tf ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setActiveTimeframe(tf)}
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex-1">
          <Input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Search markets..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex space-x-2">
          <Button  
            className={`px-4 py-2 rounded ${
              filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setFilterType('all')}
          >
            All
          </Button>
          <Button  
            className={`px-4 py-2 rounded ${
              filterType === 'bullish' ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setFilterType('bullish')}
          >
            Bullish
          </Button>
          <Button  
            className={`px-4 py-2 rounded ${
              filterType === 'bearish' ? 'bg-red-600 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setFilterType('bearish')}
          >
            Bearish
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="p-12 text-center">
          <div className="text-xl font-semibold mb-2">Scanning markets...</div>
          <div className="text-gray-500">Please wait while we analyze market conditions</div>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-100 text-red-600 rounded-lg">
          {error}
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="p-12 text-center">
          <div className="text-xl font-semibold mb-2">No results found</div>
          <div className="text-gray-500">Try changing your search criteria</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left">Market</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">24h Change</th>
                <th className="px-4 py-3 text-right">24h Volume</th>
                <th className="px-4 py-3 text-center">Signals</th>
                <th className="px-4 py-3 text-center">Score</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map(result => (
                <tr key={result.symbol} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{result.symbol}</span>
                      <span className="text-sm text-gray-500">{result.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    ${result.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${
                    result.change24h > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {result.change24h > 0 ? '+' : ''}{result.change24h.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-right">
                    ${formatLargeNumber(result.volume24h)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {result.signals.map((signal, i) => (
                        <div key={i}
                          className={`px-2 py-1 rounded text-xs ${
                            signal.type === 'bullish' ? 'bg-green-100 text-green-600' :
                            signal.type === 'bearish' ? 'bg-red-100 text-red-600' :
                            'bg-yellow-100 text-yellow-600'
                          }`}
                        >
                          {signal.indicator}: {signal.description}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className={`text-lg font-bold ${getScoreColor(result.score)}`}>
                      {result.score}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button  
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={() => onSelectMarket(result.symbol)}
                    >
                      Select
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export const lovable = {
  tables: ['markets', 'marketSignals'],
  aiBlocks: ['marketAnalysis'],
  functions: ['scanMarkets', 'getMarketSignals']
};
