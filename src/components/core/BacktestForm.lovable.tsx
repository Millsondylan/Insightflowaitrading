import { useState } from 'react';
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
  const [formState, setFormState] = useState<BacktestFormState>({
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
    <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
      <div >
        <div>
          <Label htmlFor="ticker">Ticker</Label>
          <Select
            value={formState.ticker}
            onValueChange={(value) => handleSelectChange('ticker', value)}
          >
            <SelectTrigger >
              <SelectValue />
            </SelectTrigger>
            <SelectContent style={{ color: "white" }}>
              {Object.keys(sampleData).map(ticker => (
                <SelectItem key={ticker} value={ticker}>{ticker}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="timeframe">Timeframe</Label>
          <Select
            value={formState.timeframe}
            onValueChange={(value) => handleSelectChange('timeframe', value)}
          >
            <SelectTrigger >
              <SelectValue />
            </SelectTrigger>
            <SelectContent style={{ color: "white" }}>
              <SelectItem value="1H">1 Hour</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="entryLogic">Entry Logic</Label>
        <Textarea
          id="entryLogic"
          name="entryLogic"
          value={formState.entryLogic}
          onChange={handleTextAreaChange}
          
          placeholder="e.g., close > sma(50)"
        />
      </div>
      <div>
        <Label htmlFor="exitLogic">Exit Logic</Label>
        <Textarea
          id="exitLogic"
          name="exitLogic"
          value={formState.exitLogic}
          onChange={handleTextAreaChange}
          
          placeholder="e.g., close < sma(50)"
        />
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          type="submit"
          style={{ border: "1px solid #374151", color: "white", width: "100%" }}
          disabled={isLoading}
        >
          {isLoading ? <Loader2  /> : 'Run Backtest'}
        </Button>
      </div>
    </form>
  );
};

export default BacktestForm; 