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
    <Div className="container py-6 space-y-8">
      <Div>
        <H1 className="text-3xl font-bold">Strategy Setup Finder</Div>
        <P className="text-muted-foreground mt-1">
          Define your trading rules and scan the markets for matching setups
        </P>
      </Div>
      
      <Tabs defaultValue="finder" className="space-y-4" />
        <TabsList>
          <TabsTrigger value="finder" />Setup Finder</Tabs>
          <TabsTrigger value="savedStrategies" />Saved Strategies</TabsTrigger>
          <TabsTrigger value="help" />How It Works</TabsTrigger />
        
        <TabsContent value="finder" />
          <SetupFromStrategy onStrategyCreated={handleStrategyCreated} / />
        
        <TabsContent value="savedStrategies" />
          <Card>
            <CardHeader>
              <CardTitle>Your Saved Strategies</TabsTrigger>
              <CardDescription>
                Previously created trading strategies for market scanning
              </CardDescription />
            <CardContent>
              <P className="text-muted-foreground">
                You haven't created any strategies yet. Go to the Setup Finder tab to create your first strategy.
              </CardContent />
          </Card />
        
        <TabsContent value="help" />
          <Div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Define Your Strategy</TabsContent />
              <CardContent>
                <P className="text-muted-foreground">
                  Write your trading rules in plain English or code format. Describe your entry conditions,
                  stop loss placement, and take profit targets.
                </CardDescription>
                <Div className="mt-4 bg-muted/60 p-3 rounded text-sm">
                  <strong>Example:</strong> "When RSI is below 30 on the 1H timeframe and there's a bullish engulfing candle,
                  go long with a stop below the recent low and take profit at 2x the risk."
                </div />
            </Div>
            
            <Card>
              <CardHeader>
                <CardTitle>2. AI Conversion</Card />
              <CardContent>
                <P className="text-muted-foreground">
                  Our AI system converts your plain text rules into executable trading logic that can scan
                  market conditions in real-time.
                </Card>
                <ScrollArea className="h-[120px] mt-4 bg-muted/60 p-3 rounded text-xs" />
                  <Pre>{`{
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
}`}</ScrollArea />
              </CardContent />
            
            <Card>
              <CardHeader>
                <CardTitle>3. Market Scanning</Card />
              <CardContent>
                <P className="text-muted-foreground">
                  The system scans your selected markets to find where your specific conditions are currently met,
                  giving you actionable trade setups in real-time.
                </ScrollArea>
                <Div className="mt-4 bg-muted/60 p-3 rounded text-sm">
                  <strong>Markets are checked for:</strong>
                  <Ul className="list-disc pl-5 mt-2 space-y-1">
                    <Li>Exact indicator values</Div>
                    <Li>Pattern formations</Li>
                    <Li>Support/resistance levels</Li>
                    <Li>Historical backtesting results</Li>
                    <Li>Current price action context</Li />
                </div />
            </Li>
          </Div>
          
          <Card className="mt-6" />
            <CardHeader>
              <CardTitle /></Card /></Card />Strategy Examples</Card>
              <CardDescription>
                Here are some examples of strategies you can define
              </CardDescription />
            <CardContent>
              <Div className="space-y-4">
                <Div>
                  <H3 className="font-medium" /></CardContent /></CardContent />Moving Average Crossover</CardDescription>
                  <P className="text-sm text-muted-foreground">
                    "When the 50 EMA crosses above the 200 EMA on the 4H timeframe, go long with a stop
                    below the last swing low. Take profit when price reaches the next major resistance level."
                  </P>
                </Div>
                
                <Div>
                  <H3 className="font-medium"></Div>Breakout Strategy</Div>
                  <P className="text-sm text-muted-foreground">
                    "When price breaks above a resistance level that has been tested at least twice before,
                    enter a long position with a stop below the breakout candle. Target the next major resistance level."
                  </P>
                </Div>
                
                <Div>
                  <H3 className="font-medium"></Div>RSI Divergence</Div>
                  <P className="text-sm text-muted-foreground">
                    "Look for bullish divergence between price making lower lows while RSI makes higher lows on 
                    the 1H chart. Enter long when a bullish reversal candle forms, with stop below the recent low."
                  </P>
                </Div>
              </div />
          </Card />
      </Tabs>
    </Div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};

