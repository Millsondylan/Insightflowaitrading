
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DollarSign, TrendingUp, Coins, BarChart3 } from 'lucide-react';

interface MarketsStepProps {
  selectedMarkets: string[];
  onMarketsChange: (markets: string[]) => void;
  favoriteSymbols: string[];
  onSymbolsChange: (symbols: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const MARKET_CATEGORIES = [
  {
    id: 'forex',
    name: 'Forex',
    icon: <DollarSign className="w-5 h-5" />,
    symbols: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'NZD/USD']
  },
  {
    id: 'stocks',
    name: 'Stocks',
    icon: <TrendingUp className="w-5 h-5" />,
    symbols: ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA']
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    icon: <Coins className="w-5 h-5" />,
    symbols: ['BTC/USD', 'ETH/USD', 'ADA/USD', 'SOL/USD', 'DOT/USD', 'LINK/USD']
  },
  {
    id: 'commodities',
    name: 'Commodities',
    icon: <BarChart3 className="w-5 h-5" />,
    symbols: ['GOLD', 'SILVER', 'OIL', 'WHEAT', 'CORN', 'COFFEE']
  }
];

const MarketsStep: React.FC<MarketsStepProps> = ({
  selectedMarkets,
  onMarketsChange,
  favoriteSymbols,
  onSymbolsChange,
  onNext,
  onBack
}) => {
  const [customSymbol, setCustomSymbol] = React.useState('');

  const toggleMarket = (marketId: string) => {
    if (selectedMarkets.includes(marketId)) {
      onMarketsChange(selectedMarkets.filter((id: string) => id !== marketId));
    } else {
      onMarketsChange([...selectedMarkets, marketId]);
    }
  };

  const toggleSymbol = (symbol: string) => {
    if (favoriteSymbols.includes(symbol)) {
      onSymbolsChange(favoriteSymbols.filter((s: string) => s !== symbol));
    } else {
      onSymbolsChange([...favoriteSymbols, symbol]);
    }
  };

  const addCustomSymbol = () => {
    if (customSymbol.trim() && !favoriteSymbols.includes(customSymbol.trim().toUpperCase())) {
      onSymbolsChange([...favoriteSymbols, customSymbol.trim().toUpperCase()]);
      setCustomSymbol('');
    }
  };

  const handleCustomSymbolKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addCustomSymbol();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Select Your Markets</h2>
        <p className="text-gray-400">Choose the markets you're interested in trading</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MARKET_CATEGORIES.map((market) => (
          <Card key={market.id} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white">
                {market.icon}
                {market.name}
                <Badge
                  variant={selectedMarkets.includes(market.id) ? "default" : "outline"}
                  className={`ml-auto cursor-pointer ${
                    selectedMarkets.includes(market.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                  onClick={() => toggleMarket(market.id)}
                >
                  {selectedMarkets.includes(market.id) ? 'Selected' : 'Select'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {market.symbols.map((symbol) => (
                  <Badge
                    key={symbol}
                    variant={favoriteSymbols.includes(symbol) ? "default" : "outline"}
                    className={`p-2 cursor-pointer text-center justify-center ${
                      favoriteSymbols.includes(symbol)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    onClick={() => toggleSymbol(symbol)}
                  >
                    {symbol}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Add Custom Symbols</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter symbol (e.g., AAPL, BTC/USD)"
              value={customSymbol}
              onChange={(e) => setCustomSymbol(e.target.value)}
              onKeyDown={handleCustomSymbolKeyDown}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Button onClick={addCustomSymbol} variant="outline">
              Add
            </Button>
          </div>
          {favoriteSymbols.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {favoriteSymbols.map((symbol) => (
                <Badge key={symbol} className="bg-blue-600 text-white">
                  {symbol}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={onNext}
          disabled={selectedMarkets.length === 0}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default MarketsStep;
