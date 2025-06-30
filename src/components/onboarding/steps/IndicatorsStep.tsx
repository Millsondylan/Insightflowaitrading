import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TradingIndicator } from '@/types/profile';
import { X, Plus } from 'lucide-react';

export default function IndicatorsStep() {
  const { control, setValue, getValues } = useFormContext();
  const [customIndicator, setCustomIndicator] = useState('');
  
  const commonIndicators: TradingIndicator[] = [
    'RSI',
    'MACD',
    'EMA',
    'SMA',
    'Bollinger Bands',
    'Stochastic',
    'Ichimoku',
    'Volume',
    'OBV',
    'ATR',
    'Fibonacci',
  ];
  
  const addCustomIndicator = () => {
    if (!customIndicator.trim()) return;
    
    const currentIndicators = getValues('indicators') || [];
    if (!currentIndicators.includes(customIndicator.trim())) {
      setValue('indicators', [...currentIndicators, customIndicator.trim()]);
    }
    setCustomIndicator('');
  };
  
  const toggleIndicator = (indicator: TradingIndicator) => {
    const currentIndicators = getValues('indicators') || [];
    
    if (currentIndicators.includes(indicator)) {
      setValue(
        'indicators',
        currentIndicators.filter((ind) => ind !== indicator)
      );
    } else {
      setValue('indicators', [...currentIndicators, indicator]);
    }
  };
  
  const removeIndicator = (indicator: string) => {
    const currentIndicators = getValues('indicators') || [];
    setValue(
      'indicators',
      currentIndicators.filter((ind) => ind !== indicator)
    );
  };
  
  return (
    <div className="space-y-6">
      <p className="text-gray-500 dark:text-gray-400">
        Select the indicators you use in your trading analysis
      </p>
      
      <FormField
        control={control}
        name="indicators"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Common Indicators</FormLabel>
            <FormControl>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {commonIndicators.map((indicator) => (
                  <div
                    key={indicator}
                    className={`
                      flex items-center justify-center p-2 border rounded-md cursor-pointer
                      transition-colors text-center
                      ${
                        field.value?.includes(indicator)
                          ? 'bg-primary/10 border-primary'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                    onClick={() => toggleIndicator(indicator)}
                  >
                    {indicator}
                  </div>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div>
        <FormLabel>Custom Indicators</FormLabel>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Add custom indicator"
            value={customIndicator}
            onChange={(e) => setCustomIndicator(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomIndicator();
              }
            }}
          />
          <Button type="button" onClick={addCustomIndicator} size="sm">
            <Plus className="h-4 w-4"/>
            Add
          </Button>
        </div>
      </div>
      
      <FormField
        control={control}
        name="indicators"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Selected Indicators</FormLabel>
            <div className="flex flex-wrap gap-2 mt-2">
              {field.value?.map((indicator: string) => (
                <Badge key={indicator} variant="secondary" className="flex items-center gap-1">
                  {indicator}
                  <Button
                    type="button"
                    onClick={() => removeIndicator(indicator)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <X className="h-3 w-3"/>
                    <span className="sr-only">Remove</span>
                  </Button>
                </Badge>
              ))}
              {(!field.value || field.value.length === 0) && (
                <p className="text-sm text-gray-500 italic">No indicators selected</p>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export const lovable = {
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 