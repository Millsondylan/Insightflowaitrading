import React from 'react';
import { SetupFromStrategy } from '@/components/markets/SetupFromStrategy';
import { UserStrategy } from '@/lib/db/types';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function SetupFinderPage() {
  const handleStrategyCreated = (strategy: UserStrategy) => {
    console.log('Strategy created:', strategy);
  };
  
  return (
    <div className="container py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Strategy Setup Finder</h1>
        <p className="text-muted-foreground mt-1">
          Define your trading rules and scan the markets for matching setups
        </p>
      </div>
      
      <Tabs defaultValue="finder" className="space-y-4">
        <TabsList>
          <TabsTrigger value="finder">Setup Finder</TabsTrigger>
          <TabsTrigger value="savedStrategies">Saved Strategies</TabsTrigger>
          <TabsTrigger value="help">How It Works</TabsTrigger>
        </TabsList>
        
        <TabsContent value="finder">
          <SetupFromStrategy onStrategyCreated={handleStrategyCreated}/>
        </TabsContent>
        
        <TabsContent value="savedStrategies">
          <Card>
            <CardHeader>
              <CardTitle>Your Saved Strategies</CardTitle>
              <CardDescription>
                Previously created trading strategies for market scanning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You haven't created any strategies yet. Go to the Setup Finder tab to create your first strategy.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="help">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Define Your Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Write your trading rules in plain English or code format. Describe your entry conditions,
                  stop loss placement, and take profit targets.
                </p>
                <div className="mt-4 bg-muted/60 p-3 rounded text-sm">
                  <strong>Example:</strong> "When RSI is below 30 on the 1H timeframe and there's a bullish engulfing candle,
                  go long with a stop below the recent low and take profit at 2x the risk."
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>2. AI Conversion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our AI system converts your plain text rules into executable trading logic that can scan
                  market conditions in real-time.
                </p>
                <ScrollArea className="h-[120px] mt-4 bg-muted/60 p-3 rounded text-xs">
                  <pre>{`{
  "name": "RSI Oversold Bullish Engulfing",
  "direction": "LONG",
  "timeframes": ["1h"],
  "entryConditions": [
    {
      "type": "indicator",
      "indicator": "RSI",
      "condition": "RSI < 30",
      "weight": 1.0
    },
    {
      "type": "pattern",
      "indicator": "candlestick",
      "condition": "bullish engulfing",
      "weight": 1.0
    }
  ],
  "exitConditions": [
    {
      "type": "stopLoss",
      "value": "below recent low"
    },
    {
      "type": "takeProfit",
      "value": "2x stop distance"
    }
  ]
}`}</pre>
                </ScrollArea>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>3. Market Scanning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The system scans your selected markets to find where your specific conditions are currently met,
                  giving you actionable trade setups in real-time.
                </p>
                <div className="mt-4 bg-muted/60 p-3 rounded text-sm">
                  <strong>Markets are checked for:</strong>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Exact indicator values</li>
                    <li>Pattern formations</li>
                    <li>Support/resistance levels</li>
                    <li>Historical backtesting results</li>
                    <li>Current price action context</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Strategy Examples</CardTitle>
              <CardDescription>
                Here are some examples of strategies you can define
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Moving Average Crossover</h3>
                  <p className="text-sm text-muted-foreground">
                    "When the 50 EMA crosses above the 200 EMA on the 4H timeframe, go long with a stop
                    below the last swing low. Take profit when price reaches the next major resistance level."
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Breakout Strategy</h3>
                  <p className="text-sm text-muted-foreground">
                    "When price breaks above a resistance level that has been tested at least twice before,
                    enter a long position with a stop below the breakout candle. Target the next major resistance level."
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">RSI Divergence</h3>
                  <p className="text-sm text-muted-foreground">
                    "Look for bullish divergence between price making lower lows while RSI makes higher lows on 
                    the 1H chart. Enter long when a bullish reversal candle forms, with stop below the recent low."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};

