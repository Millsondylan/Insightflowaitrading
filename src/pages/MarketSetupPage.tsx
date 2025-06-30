import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MarketSetupSuggestion } from '@/components/markets/MarketSetupSuggestion';
import { MarketSetup } from '@/lib/db/types';

const marketGroups = [
  {
    name: 'Cryptocurrency',
    markets: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'XRP/USDT', 'ADA/USDT', 'BNB/USDT', 'DOT/USDT', 'AVAX/USDT']
  },
  {
    name: 'Forex',
    markets: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'USD/CHF', 'EUR/GBP', 'EUR/JPY']
  },
  {
    name: 'Stocks',
    markets: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'JPM']
  },
  {
    name: 'Commodities',
    markets: ['GOLD', 'SILVER', 'OIL', 'NATGAS', 'COPPER', 'CORN', 'WHEAT', 'SOYBEANS']
  }
];

const timeframeOptions = ['1m', '5m', '15m', '30m', '1h', '4h', 'D1', 'W1'];

export default function MarketSetupPage() {
  const [selectedMarket, setSelectedMarket] = useState<string>('BTC/USDT');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('1h');
  const [savedSetups, setSavedSetups] = useState<MarketSetup[]>([]);
  const [activeTab, setActiveTab] = useState<string>("suggested");
  
  const handleSaveSetup = (setup: MarketSetup) => {
    setSavedSetups(prev => {
      const exists = prev.some(s => s.id === setup.id);
      if (exists) return prev;
      return [...prev, setup];
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <div className="container py-6 space-y-8">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Market Setup Suggestions</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered trade setup recommendations based on current market conditions
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select market"/>
            </SelectTrigger>
            <SelectContent>
              {marketGroups.map(group => (
                <SelectGroup key={group.name}>
                  <SelectItem value={group.name} disabled className="font-semibold">
                    {group.name}
                  </SelectItem>
                  {group.markets.map(market => (
                    <SelectItem key={market} value={market}>
                      {market}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Timeframe"/>
            </SelectTrigger>
            <SelectContent>
              {timeframeOptions.map(timeframe => (
                <SelectItem key={timeframe} value={timeframe}>
                  {timeframe}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="suggested" value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="suggested">Suggested Setup</TabsTrigger>
          <TabsTrigger value="saved">Saved Setups</TabsTrigger>
          <TabsTrigger value="settings">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="suggested" className="space-y-4">
          <MarketSetupSuggestion 
            symbol={selectedMarket} 
            timeframe={selectedTimeframe}
            onSaveSetup={handleSaveSetup}
         />
          <Card>
            <CardHeader>
              <CardTitle>About This Setup</CardTitle>
              <CardDescription>
                How AI generates personalized trade setups for your selected market
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">What goes into each setup?</h3>
                <p className="text-muted-foreground text-sm">
                  The AI analyzes the latest market data including price action, volume, volatility,
                  and key technical indicators to identify high-probability trading opportunities.
                </p>
              </div>
              <div>
                <h3 className="font-medium">How is the confidence score calculated?</h3>
                <p className="text-muted-foreground text-sm">
                  Confidence scores are derived from multiple factors including strength of pattern formation,
                  alignment with market trend, historical pattern reliability, and proximity to key support/resistance levels.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Personalization</h3>
                <p className="text-muted-foreground text-sm">
                  Setups are tailored to your trading preferences set in your profile, including favorite
                  indicators, trading style (swing/scalp), and risk-reward expectations.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          {savedSetups.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Saved Setups</CardTitle>
                <CardDescription>
                  You haven't saved any trade setups yet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  When you find a setup you like, click the "Save Setup" button to store it here for future reference.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => setActiveTab("suggested")}>Go to Suggested Setups</Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedSetups.map(setup => (
                <Card key={setup.id}>
                  <CardHeader>
                    <CardTitle>{setup.symbol}</CardTitle>
                    <CardDescription>
                      {setup.timeframe} • {setup.tradeType === 'LONG' ? 'Long' : 'Short'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <div className="text-xs text-muted-foreground">Entry</div>
                          <div>{setup.entry.toFixed(5)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Stop Loss</div>
                          <div>{setup.sl.toFixed(5)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Take Profit</div>
                          <div>{setup.tp.toFixed(5)}</div>
                        </div>
                      </div>
                      {setup.patternDescription && (
                        <div>
                          <div className="text-xs text-muted-foreground">Pattern</div>
                          <div className="text-sm">{setup.patternDescription}</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="destructive" size="sm" onClick={() => {
                      setSavedSetups(setups => setups.filter(s => s.id !== setup.id));
                    }}>
                      Remove
                    </Button>
                    <Button variant="outline" size="sm">View Details</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Setup Preferences</CardTitle>
              <CardDescription>
                Customize how AI generates trade setups for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Trading Style</h3>
                  <Select defaultValue="swing">
                    <SelectTrigger>
                      <SelectValue placeholder="Select style"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scalp">Scalping (short-term)</SelectItem>
                      <SelectItem value="day">Day Trading</SelectItem>
                      <SelectItem value="swing">Swing Trading</SelectItem>
                      <SelectItem value="position">Position Trading (long-term)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Risk-Reward Ratio</h3>
                  <Select defaultValue="2">
                    <SelectTrigger>
                      <SelectValue placeholder="Select ratio"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1:1</SelectItem>
                      <SelectItem value="1.5">1:1.5</SelectItem>
                      <SelectItem value="2">1:2</SelectItem>
                      <SelectItem value="3">1:3</SelectItem>
                      <SelectItem value="5">1:5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Preferred Indicators</h3>
                  <div className="space-y-2">
                    {['RSI', 'MACD', 'EMA', 'SMA', 'Bollinger Bands', 'Stochastic', 'Fibonacci', 'Volume Profile'].map(indicator => (
                      <div className="flex items-center space-x-2" key={indicator}>
                        <Switch id={`indicator-${indicator}`} defaultChecked={['RSI', 'EMA', 'Bollinger Bands'].includes(indicator)}/>
                        <Label htmlFor={`indicator-${indicator}`}>{indicator}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
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

