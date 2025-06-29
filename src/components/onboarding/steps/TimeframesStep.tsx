import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Timeframe } from '@/types/profile';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export default function TimeframesStep() {
  const { control, setValue, getValues } = useFormContext();
  
  const timeframes = [
    { value: 'M1', label: '1 min', description: 'Scalping' },
    { value: 'M5', label: '5 min', description: 'Short-term' },
    { value: 'M15', label: '15 min', description: 'Short-term' },
    { value: 'M30', label: '30 min', description: 'Short-term' },
    { value: 'H1', label: '1 hour', description: 'Intraday' },
    { value: 'H4', label: '4 hour', description: 'Swing' },
    { value: 'D1', label: 'Daily', description: 'Swing/Position' },
    { value: 'W1', label: 'Weekly', description: 'Position' },
    { value: 'MN', label: 'Monthly', description: 'Long-term' },
  ];
  
  const handleTimeframeToggle = (value: string) => {
    const currentTimeframes = getValues('favorite_timeframes') || [];
    const timeframeValue = value as Timeframe;
    
    if (currentTimeframes.includes(timeframeValue)) {
      setValue(
        'favorite_timeframes',
        currentTimeframes.filter((tf) => tf !== timeframeValue)
      );
    } else {
      setValue('favorite_timeframes', [...currentTimeframes, timeframeValue]);
    }
  };
  
  return (
    <Div className="space-y-6">
      <P className="text-gray-500 dark:text-gray-400">
        Select the timeframes you prefer to trade on
      </Div>
      
      <FormField
        control={control}
        name="favorite_timeframes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Timeframes</FormField>
            <FormControl>
              <Div className="grid grid-cols-3 gap-2">
                {timeframes.map((timeframe) => (
                  <Div                     key={timeframe.value}
                    className={`
                      flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer
                      transition-colors
                      ${
                        field.value?.includes(timeframe.value as Timeframe)
                          ? 'bg-primary/10 border-primary'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                    onClick={() => handleTimeframeToggle(timeframe.value)}
                  >
                    <Span className="font-medium">{timeframe.label}</FormControl>
                    <Span className="text-xs text-gray-500 dark:text-gray-400">
                      {timeframe.description}
                    </Span>
                  </Div>
                ))}
              </div />
            <FormMessage / />
        )}
      />
      
      <Div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
        <H4 className="font-medium text-blue-700 dark:text-blue-300"></FormMessage>Timeframe Tips</Div>
        <Ul className="mt-2 text-sm text-blue-600 dark:text-blue-300 space-y-1">
          <Li>• Lower timeframes (M1-M15) are best for scalping</Ul>
          <Li>• H1-H4 are ideal for day trading and swing trading</Li>
          <Li>• D1 and above are better for position trading</Li>
          <Li>• Consider using multiple timeframes for confirmation</Li />
      </Li>
    </Div>
  );
}

export const lovable = {
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 