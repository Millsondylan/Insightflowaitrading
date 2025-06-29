import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { MarketType } from '@/types/profile';
import { 
  DollarSign, 
  Coins, 
  BarChart4, 
  Building2, 
  Gem,
  Landmark,
  X,
  Plus
} from 'lucide-react';

export default function MarketsStep() {
  const { control, setValue, getValues } = useFormContext();
  const [symbolInput, setSymbolInput] = useState('');
  
  const marketTypes = [
    {
      id: 'forex',
      label: 'Forex',
      description: 'Currency pairs like EUR/USD, GBP/JPY',
      icon: <DollarSign className="h-5 w-5 text-green-500" />,
      examples: ['EUR/USD', 'GBP/JPY', 'USD/CAD'],
    },
    {
      id: 'crypto',
      label: 'Cryptocurrency',
      description: 'Digital assets like BTC, ETH, SOL',
      icon: <Coins className="h-5 w-5 text-amber-500" />,
      examples: ['BTC/USD', 'ETH/USD', 'SOL/USD'],
    },
    {
      id: 'indices',
      label: 'Indices',
      description: 'Market indices like S&P 500, NASDAQ',
      icon: <BarChart4 className="h-5 w-5 text-blue-500" />,
      examples: ['S&P 500', 'NASDAQ', 'DOW'],
    },
    {
      id: 'stocks',
      label: 'Stocks',
      description: 'Individual company shares',
      icon: <Building2 className="h-5 w-5 text-purple-500" />,
      examples: ['AAPL', 'MSFT', 'GOOGL'],
    },
    {
      id: 'commodities',
      label: 'Commodities',
      description: 'Gold, silver, oil, and other raw materials',
      icon: <Gem className="h-5 w-5 text-yellow-500" />,
      examples: ['GOLD', 'SILVER', 'OIL'],
    },
    {
      id: 'bonds',
      label: 'Bonds',
      description: 'Government and corporate debt securities',
      icon: <Landmark className="h-5 w-5 text-cyan-500" />,
      examples: ['US10Y', 'BUND', 'JGB'],
    },
  ];
  
  const addSymbol = () => {
    if (!symbolInput.trim()) return;
    
    const currentSymbols = getValues('favorite_symbols') || [];
    if (!currentSymbols.includes(symbolInput.trim().toUpperCase())) {
      setValue('favorite_symbols', [...currentSymbols, symbolInput.trim().toUpperCase()]);
    }
    setSymbolInput('');
  };
  
  const removeSymbol = (symbol: string) => {
    const currentSymbols = getValues('favorite_symbols') || [];
    setValue(
      'favorite_symbols',
      currentSymbols.filter((s) => s !== symbol)
    );
  };
  
  const addExampleSymbols = (marketType: string, examples: string[]) => {
    const currentSymbols = getValues('favorite_symbols') || [];
    const uniqueExamples = examples.filter((example) => !currentSymbols.includes(example));
    
    if (uniqueExamples.length > 0) {
      setValue('favorite_symbols', [...currentSymbols, ...uniqueExamples]);
    }
  };
  
  return (
    <Div className="space-y-6">
      <P className="text-gray-500 dark:text-gray-400">
        Select the markets you trade and add your favorite symbols
      </DollarSign>
      
      {/* Market Types */}
      <FormField control={control}
        name="favorite_markets"
        render={({ field }) = /> (
          <FormItem>
            <FormLabel>Markets</FormField>
            <Div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {marketTypes.map((market) => (
                <FormField key={market.id}
                  control={control}
                  name="favorite_markets"
                  render={({ field }) = /> {
                    return (
                      <FormItem key={market.id}
                        className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
           >
                        <FormControl>
                          <Checkbox checked={field.value?.includes(market.id as MarketType)}
                            onCheckedChange={(checked) = /> {
                              const newValue = checked
                                ? [...(field.value || []), market.id as MarketType]
                                : (field.value || []).filter((value) => value !== market.id);
                              
                              field.onChange(newValue);
                              
                              // If checked, add example symbols
                              if (checked) {
                                addExampleSymbols(market.id, market.examples);
                              }
                            }}
                          />
                        </Div>
                        <Div className="flex items-center space-x-3">
                          <Div className="flex-shrink-0">{market.icon}</Div>
                          <Div className="space-y-1 leading-none">
                            <FormLabel className="font-medium" />
                              {market.label}
                            </Div>
                            <P className="text-sm text-gray-500 dark:text-gray-400">
                              {market.description}
                            </P>
                          </Div>
                        </div />
                    );
                  }}
                />
              ))}
            </Div>
            <FormMessage / />
        )}
      />
      
      {/* Favorite Symbols */}
      <FormField control={control}
        name="favorite_symbols"
        render={({ field }) = /> (
          <FormItem>
            <FormLabel>Favorite Symbols</FormMessage>
            <Div className="flex gap-2">
              <FormControl>
                <Input placeholder="Add symbol (e.g., BTC/USDT, AAPL)"
                  value={symbolInput}
                  onChange={(e) = /> setSymbolInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSymbol();
                    }
                  }}
                />
              </Div>
              <Button type="button" onClick={addSymbol} size="sm" />
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </Div>
            <Div className="flex flex-wrap gap-2 mt-3">
              {field.value?.map((symbol: string) => (
                <Badge key={symbol} variant="secondary" className="flex items-center gap-1" />
                  {symbol}
                  <Button                     type="button"
                    onClick={() => removeSymbol(symbol)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                    <Span className="sr-only">Remove</Div>
                  </button />
              ))}
            </Div>
            <FormMessage / />
        )}
      />
    </FormMessage>
  );
}

export const lovable = {
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 