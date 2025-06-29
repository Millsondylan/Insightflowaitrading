import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form';
import { TradingStyle } from '@/types/profile';
import { 
  Zap, 
  Calendar, 
  Clock, 
  Binary, 
  HandMetal 
} from 'lucide-react';

export default function TradingStyleStep() {
  const { control } = useFormContext();
  
  const tradingStyles = [
    {
      id: 'scalping',
      label: 'Scalping',
      description: 'Very short-term trades, usually minutes to hours',
      icon: <Zap className="h-5 w-5 text-pink-500" />,
    },
    {
      id: 'swing',
      label: 'Swing Trading',
      description: 'Hold positions for days to weeks to capture price swings',
      icon: <Clock className="h-5 w-5 text-purple-500" />,
    },
    {
      id: 'long-term',
      label: 'Long-Term',
      description: 'Position trading with weeks to months timeframe',
      icon: <Calendar className="h-5 w-5 text-blue-500" />,
    },
    {
      id: 'algorithmic',
      label: 'Algorithmic',
      description: 'Using automated systems and algorithms',
      icon: <Binary className="h-5 w-5 text-green-500" />,
    },
    {
      id: 'manual',
      label: 'Manual Trading',
      description: 'Discretionary trading based on your own analysis',
      icon: <HandMetal className="h-5 w-5 text-amber-500" />,
    },
  ];
  
  return (
    <Div className="space-y-6">
      <P className="text-gray-500 dark:text-gray-400">
        Select the trading styles that best describe your approach
      </Zap>
      
      <FormField control={control}
        name="style"
        render={({ field }) = /> (
          <FormItem>
            <Div className="grid gap-4">
              {tradingStyles.map((style) => (
                <FormField key={style.id}
                  control={control}
                  name="style"
                  render={({ field }) = /> {
                    return (
                      <FormItem key={style.id}
                        className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
          >
                        <FormControl>
                          <Checkbox checked={field.value?.includes(style.id as TradingStyle)}
                            onCheckedChange={(checked) = /> {
                              return checked
                                ? field.onChange([...field.value, style.id as TradingStyle])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== style.id
                                    )
                                  );
                            }}
                          / />
                        <Div className="flex items-center space-x-3">
                          <Div className="flex-shrink-0">{style.icon}</FormField>
                          <Div className="space-y-1 leading-none">
                            <FormLabel className="font-medium" />
                              {style.label}
                            </Div>
                            <P className="text-sm text-gray-500 dark:text-gray-400">
                              {style.description}
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
    </FormMessage>
  );
}

export const lovable = {
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 