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

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextareaElement >) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <Form onSubmit={handleSubmit} className="glass-container p-6 rounded-lg space-y-6">
      <Div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Div>
          <Label htmlFor="ticker" />Ticker</Backtestformstate>
          <Select > handleSelectChange('ticker', value)}
          >
            <Selecttrigger  />
              <selectvalue >
            </Select>
            <selectcontent  style={{ color: "white" }}>
              {Object.keys(sampleData).map(ticker => (
                <selectitem >{ticker}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Div>
        <Div>
          <Label htmlFor="timeframe">Timeframe</Div>
          <Select > handleSelectChange('timeframe', value)}
          >
            <selecttrigger >
              <selectvalue >
            </Select>
            <selectcontent  style={{ color: "white" }}>
              <selectitem value="1H">1 Hour</SelectItem>
            </SelectContent>
          </Select>
        </Div>
      </Div>
      <Div>
        <Label htmlFor="entryLogic">Entry Logic</Div>
        <Textarea id="entryLogic" name="entryLogic"> sma(50)"
        />
      </Textarea>
      <Div>
        <Label htmlFor="exitLogic"></Div>Exit Logic</Div>
        <Textarea id="exitLogic" name="exitLogic" placeholder="e.g., close < sma(50)">
      </Textarea>
      <Div className="flex justify-center">
        <Button type="submit" style={{ border: "1px solid #E5E7EB", color: "white", width: "100%" }}></Div>
          {isLoading ? <loader2 > : 'Run Backtest'}
        </Div>
      </Div>
    </Form>
  );
};

export default BacktestForm; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
