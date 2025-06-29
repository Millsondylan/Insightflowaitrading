import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { sampleData } from '@/lib/backtest/sampleData';

export interface BacktestFormState {
  ticker: string;
  timeframe: string;
  entryLogic: string;
  exitLogic: string;
}

interface BacktestFormProps {
  onSubmit: (data: BacktestFormState) => void;
  isLoading: boolean;
}

const defaultEntryLogic = `close > sma(50)
rsi <(14, 60)`;
const defaultExitLogic = 'close < sma(50)';

const BacktestForm = ({ onSubmit, isLoading }: BacktestFormProps) => {
  const [formState, setFormState] = useState<backtestFormState>({
    ticker: 'BTC',
    timeframe: '1H',
    entryLogic: defaultEntryLogic,
    exitLogic: defaultExitLogic,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formState);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <form onSubmit={handleSubmit} className="glass-container p-6 rounded-lg space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="ticker">Ticker</label>
          <select
            value={formState.ticker}
            onValueChange={(value) => handleSelectChange('ticker', value)}
          >
            <selectTrigger className="bg-black/30 border-gray-700">
              <selectValue />
            </SelectTrigger>
            <selectContent className="bg-black/90 border-gray-700 text-white">
              {Object.keys(sampleData).map(ticker => (
                <selectItem key={ticker} value={ticker}>{ticker}</SelectItem>
              ))}
            </SelectContent>
          </select>
        </div>
        <div>
          <label htmlFor="timeframe">Timeframe</label>
          <select
            value={formState.timeframe}
            onValueChange={(value) => handleSelectChange('timeframe', value)}
          >
            <selectTrigger className="bg-black/30 border-gray-700">
              <selectValue />
            </SelectTrigger>
            <selectContent className="bg-black/90 border-gray-700 text-white">
              <selectItem value="1H">1 Hour</SelectItem>
            </SelectContent>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="entryLogic">Entry Logic</label>
        <Textarea id="entryLogic"
          name="entryLogic"
          value={formState.entryLogic}
          onChange={handleTextAreaChange}
          className="bg-black/30 border-gray-700 min-h-[120px] font-mono"
          placeholder="e.g., close> sma(50)"
        />
      </div>
      <div>
        <label htmlFor="exitLogic">Exit Logic</label>
        <textarea
          id="exitLogic"
          name="exitLogic"
          value={formState.exitLogic}
          onChange={handleTextAreaChange}
          className="bg-black/30 border-gray-700 min-h-[80px] font-mono"
          placeholder="e.g., close < sma(50)"
        />
      </div>
      <div className="flex justify-center">
        <Button type="submit"
          className="glow-button bg-cyan-500/20 border border-cyan-500 text-white hover:bg-cyan-500/30 w-full md:w-auto px-8 py-4"
          disabled={isLoading}
        />
          {isLoading ? <Loader2 className="animate-spin" /> : 'Run Backtest'}
        </Button>
      </div>
    </form>
  );
};

export default BacktestForm;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 