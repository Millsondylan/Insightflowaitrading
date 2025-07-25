import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { BrainCircuit, Volume2, Bell } from 'lucide-react';

export default function AIPreferencesStep() {
  const { control } = useFormContext();
  
  const aiPreferences = [
    {
      id: 'wants_ai_trading',
      label: 'AI Trade Recommendations',
      description: 'Receive personalized trade ideas based on your profile and market conditions',
      icon: <BrainCircuit className="h-5 w-5 text-indigo-500"/>,
    },
    {
      id: 'wants_voice_coach',
      label: 'Voice Trading Coach',
      description: 'Get spoken feedback and guidance during your trading sessions',
      icon: <Volume2 className="h-5 w-5 text-blue-500"/>,
    },
    {
      id: 'wants_alerts',
      label: 'Smart Alerts',
      description: 'Receive alerts when your strategies detect trading opportunities',
      icon: <Bell className="h-5 w-5 text-amber-500"/>,
    },
  ];
  
  return (
    <div className="space-y-6">
      <p className="text-gray-500 dark:text-gray-400">
        Customize how AI assists you with your trading (all settings can be changed later)
      </p>
      
      <div className="space-y-4">
        {aiPreferences.map((preference) => (
          <FormField 
            key={preference.id}
            control={control}
            name={preference.id as any}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="flex items-start space-x-3 space-y-0">
                  <div className="mt-0.5">{preference.icon}</div>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">{preference.label}</FormLabel>
                    <FormDescription>
                      {preference.description}
                    </FormDescription>
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                 />
                </FormControl>
              </FormItem>
            )}
          />
        ))}
      </div>
      
      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
        <h4 className="font-medium text-indigo-700 dark:text-indigo-300">AI Assistant Benefits</h4>
        <ul className="mt-2 text-sm text-indigo-600 dark:text-indigo-300 space-y-1">
          <li>• Personalized trade ideas based on your preferences</li>
          <li>• Real-time market analysis and pattern recognition</li>
          <li>• Automated alerts for your favorite symbols</li>
          <li>• Trading psychology coaching and feedback</li>
        </ul>
      </div>
    </div>
  );
}

export const lovable = {
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 