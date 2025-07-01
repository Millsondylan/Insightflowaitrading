import React from 'react';
import { useFormContext } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { RiskProfile } from '@/types/profile';
import { Shield, Gauge, Flame } from 'lucide-react';

export default function RiskProfileStep() {
  const { control } = useFormContext();
  
  const riskProfiles = [
    {
      value: 'conservative',
      label: 'Conservative',
      description: 'Focus on capital preservation with lower risk and returns',
      icon: <Shield className="h-6 w-6 text-blue-500"/>,
      details: 'Typically 1-2% risk per trade, higher win rate, lower reward/risk ratio'
    },
    {
      value: 'moderate',
      label: 'Moderate',
      description: 'Balanced approach between risk and reward',
      icon: <Gauge className="h-6 w-6 text-purple-500"/>,
      details: 'Typically 2-3% risk per trade, balanced win rate and reward/risk ratio'
    },
    {
      value: 'aggressive',
      label: 'Aggressive',
      description: 'Higher risk tolerance for potentially higher returns',
      icon: <Flame className="h-6 w-6 text-red-500"/>,
      details: 'Typically 3-5% risk per trade, lower win rate, higher reward/risk ratio'
    },
  ];
  
  return (
    <div className="space-y-6">
      <p className="text-gray-500 dark:text-gray-400">
        Select your risk tolerance level for trading
      </p>
      
      <FormField 
        control={control}
        name="risk_profile"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid gap-4 pt-2"
              >
                {riskProfiles.map((profile) => (
                  <div key={profile.value} className="relative">
                    <RadioGroupItem
                      value={profile.value as RiskProfile}
                      id={`risk-${profile.value}`}
                      className="peer sr-only"
                   />
                    <Label 
                      htmlFor={`risk-${profile.value}`}
                      className="flex flex-col p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-950 dark:peer-data-[state=checked]:border-blue-700 cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">{profile.icon}</div>
                        <div>
                          <div className="font-medium">{profile.label}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {profile.description}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                        {profile.details}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md">
        <h4 className="font-medium text-amber-700 dark:text-amber-300">Risk Management Tips</h4>
        <ul className="mt-2 text-sm text-amber-600 dark:text-amber-300 space-y-1">
          <li>• Always use stop losses to protect your capital</li>
          <li>• Consider position sizing based on your risk tolerance</li>
          <li>• Avoid risking more than 1-2% of your account on a single trade</li>
          <li>• Your risk profile will influence AI recommendations</li>
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