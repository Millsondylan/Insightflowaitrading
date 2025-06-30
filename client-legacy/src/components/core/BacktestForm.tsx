
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CalendarDays, TrendingUp, Settings } from 'lucide-react';

interface BacktestFormProps {
  onSubmit?: (data: BacktestParams) => void;
}

interface BacktestParams {
  symbol: string;
  startDate: string;
  endDate: string;
  strategy: string;
  capital: number;
}

const BacktestForm: React.FC<BacktestFormProps> = ({ onSubmit }) => {
  const [params, setParams] = useState<BacktestParams>({
    symbol: 'AAPL',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    strategy: 'moving_average',
    capital: 10000
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(params);
    }
  };

  const handleInputChange = (field: keyof BacktestParams, value: string | number) => {
    setParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="bg-black/30 border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Backtest Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Symbol
              </label>
              <input
                type="text"
                value={params.symbol}
                onChange={(e) => handleInputChange('symbol', e.target.value)}
                className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                placeholder="e.g., AAPL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Initial Capital
              </label>
              <input
                type="number"
                value={params.capital}
                onChange={(e) => handleInputChange('capital', Number(e.target.value))}
                className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                placeholder="10000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={params.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                End Date
              </label>
              <input
                type="date"
                value={params.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Strategy
            </label>
            <select
              value={params.strategy}
              onChange={(e) => handleInputChange('strategy', e.target.value)}
              className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="moving_average">Moving Average Crossover</option>
              <option value="rsi">RSI Strategy</option>
              <option value="bollinger_bands">Bollinger Bands</option>
              <option value="macd">MACD Strategy</option>
            </select>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2"
            >
              <CalendarDays className="h-4 w-4" />
              Run Backtest
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="text-white border-white/20 hover:bg-white/10 flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Advanced Settings
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BacktestForm;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
