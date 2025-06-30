
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const AIStrategyBuilderV2: React.FC = () => {
  const [strategyName, setStrategyName] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [riskLevel, setRiskLevel] = useState('');

  const markets = ['Stocks', 'Crypto', 'Forex', 'Commodities'];
  const riskLevels = ['Low', 'Medium', 'High'];

  const handleGenerateStrategy = () => {
    // Placeholder for AI strategy generation logic
    console.log('Generating strategy:', { strategyName, selectedMarket, riskLevel });
  };

  return (
    <Card className="w-full bg-black/80 border-zinc-800 text-white">
      <CardHeader>
        <CardTitle>AI Strategy Builder V2</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label className="block text-sm mb-2">Strategy Name</Label>
            <Input 
              value={strategyName}
              onChange={(e) => setStrategyName(e.target.value)}
              placeholder="Enter strategy name"
              className="bg-zinc-900 border-zinc-700 text-white"
            />
          </div>

          <div>
            <Label className="block text-sm mb-2">Market</Label>
            <Select value={selectedMarket} onValueChange={setSelectedMarket}>
              <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                <SelectValue placeholder="Select Market" />
              </SelectTrigger>
              <SelectContent>
                {markets.map((market) => (
                  <SelectItem key={market} value={market}>{market}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="block text-sm mb-2">Risk Level</Label>
            <Select value={riskLevel} onValueChange={setRiskLevel}>
              <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                <SelectValue placeholder="Select Risk Level" />
              </SelectTrigger>
              <SelectContent>
                {riskLevels.map((level) => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleGenerateStrategy}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Generate AI Strategy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Add Lovable.dev compatibility
export const lovable = {
  tables: ['strategies', 'strategyRules'],
  aiBlocks: ['strategyBuilder', 'strategyAnalysis'],
  functions: ['generateStrategy', 'saveStrategy']
};
