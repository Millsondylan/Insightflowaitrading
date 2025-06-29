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
  const [formState, setFormState] = useState<Backtestformstate>({
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

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextareaElement  >) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <form onSubmit={handleSubmit} className="glass-container p-6 rounded-lg space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="ticker" />Ticker</label>
          <Select > handleSelectChange('ticker', value)}
          >
            <Selecttrigger  />
              <selectvalue  >
            </SelectTrigger>
            <selectcontent  style={{ color: "white" }}>
              {Object.keys(sampleData).map(ticker => (
                <selectitem  >{ticker}</SelectItem>
              ))}
            </SelectContent>
          </select>
        </div>
        <div>
          <label htmlFor="timeframe" >Timeframe</label>
          <select  > handleSelectChange('timeframe', value)}
          >
            <selecttrigger  >
              <selectvalue  >
            </SelectTrigger>
            <selectcontent  style={{ color: "white" }}>
              <selectitem value="1H" >1 Hour</SelectItem>
            </SelectContent>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="entryLogic" >Entry Logic</label>
        <textarea id="entryLogic" name="entryLogic" > sma(50)"
        />
      </div>
      <div>
        <label htmlFor="exitLogic" >Exit Logic</label>
        <textarea id="exitLogic" name="exitLogic" placeholder="e.g., close < sma(50)" >
      </div>
      <div className="flex justify-center">
        <button type="submit" style={{ border: "1px solid #E5E7EB", color: "white", width: "100%" }}>
          {isLoading ? <loader2  > : 'Run Backtest'}
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
