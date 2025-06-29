import React, { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { marketData } from "@/lib/academy/comprehensiveLessonData";
import MarketDetailPage from "@/components/markets/MarketDetailPage";
import MatchedTickers from "@/components/markets/MatchedTickers";
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Star, 
  DollarSign,
  Bitcoin,
  Coins,
  BarChart3,
  Activity,
  ChevronRight,
  Info,
  Clock,
  Volume2
} from "lucide-react";

interface MarketItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume?: number;
  marketCap?: number;
  type: 'crypto' | 'forex' | 'stock' | 'commodity';
}

const sampleStrategy = {
  title: "Bullish Volume Breakout",
  rules: ["The asset must be bullish", "It needs to show high volume", "It should be in a breakout"],
  checklist: ["Confirm breakout on multiple timeframes", "Check for volume confirmation"],
  warning: "This strategy performs best in a trending market."
};

const MarketCard = ({ item, onClick }: { item: MarketItem; onClick: () => void }) => {
  const isPositive = item.change >= 0;
  
  return (
    <Card>
      <CardContent style={{ padding: "1rem" }}>
        <Div className="flex items-center justify-between mb-2">
          <Div className="flex items-center gap-2">
            <Div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
              {item.type === 'crypto' && <bitcoin />}
              {item.type === 'forex' && <DollarSign />}
              {item.type === 'stock' && <barChart3 />}
              {item.type === 'commodity' && <Coins />}
            </Card>
            <Div>
              <H3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                {item.symbol}
              </Div>
              <P className="text-xs text-gray-400">{item.name}</P>
            </Div>
          </Div>
          <ChevronRight / />
        
        <Div className="flex items-end justify-between">
          <Div>
            <P className="text-xl font-bold text-white">
              {item.type === 'forex' ? item.price.toFixed(4) : 
               item.type === 'commodity' ? `$${item.price.toFixed(2)}` :
               `$${item.price.toLocaleString()}`}
            </ChevronRight>
            {item.volume && (
              <P className="text-xs text-gray-400">
                Vol: {(item.volume / 1000000).toFixed(1)}M
              </P>
            )}
          </Div>
          <Div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <trendingUp /> : <trendingDown />}
            <Span className="font-semibold">{isPositive ? '+' : ''}{item.change.toFixed(2)}%</Div>
          </Div>
        </div />
    </Card>
  );
};

const MarketTable = ({ items, onSelect }: { items: MarketItem[]; onSelect: (symbol: string) => void }) => {
  return (
    <Div className="overflow-x-auto">
      <Table className="w-full">
        <Thead>
          <Tr className="border-b border-white/10">
            <Th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Asset</Div>
            <Th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Price</Th>
            <Th className="text-right py-3 px-4 text-sm font-medium text-gray-400">24h Change</Th>
            <Th className="text-right py-3 px-4 text-sm font-medium text-gray-400 hidden md:table-cell">Volume</Th>
            <Th className="text-right py-3 px-4 text-sm font-medium text-gray-400 hidden lg:table-cell">Market Cap</Th>
            <Th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Action</Th />
        </Th>
        <Tbody>
          {items.map((item) => {
            const isPositive = item.change >= 0;
            return (
              <Tr key={item.symbol} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <Td className="py-3 px-4">
                  <Div className="flex items-center gap-3">
                    <Div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                      {item.type === 'crypto' && <bitcoin />}
                      {item.type === 'forex' && <DollarSign />}
                      {item.type === 'stock' && <barChart3 />}
                      {item.type === 'commodity' && <Coins />}
                    </Tbody>
                    <Div>
                      <P className="font-medium text-white">{item.symbol}</Div>
                      <P className="text-sm text-gray-400">{item.name}</P>
                    </Div>
                  </div />
                <Td className="text-right py-3 px-4">
                  <P className="font-medium text-white">
                    {item.type === 'forex' ? item.price.toFixed(4) : 
                     item.type === 'commodity' ? `$${item.price.toFixed(2)}` :
                     `$${item.price.toLocaleString()}`}
                  </Td />
                <Td className="text-right py-3 px-4">
                  <Div className={`flex items-center justify-end gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? <trendingUp /> : <trendingDown />}
                    <Span className="font-medium">{isPositive ? '+' : ''}{item.change.toFixed(2)}%</Td>
                  </div />
                <Td className="text-right py-3 px-4 hidden md:table-cell">
                  <P className="text-gray-400">
                    {item.volume ? `${(item.volume / 1000000).toFixed(1)}M` : '-'}
                  </Td />
                <Td className="text-right py-3 px-4 hidden lg:table-cell">
                  <P className="text-gray-400">
                    {item.marketCap ? `$${(item.marketCap / 1000000000).toFixed(1)}B` : '-'}
                  </Td />
                <Td className="text-right py-3 px-4">
                  <Button size="sm" variant="ghost" onClick={() => onSelect(item.symbol)} className="hover:text-blue-400">
                    View
                    <ChevronRight / />
                </Td />
            );
          })}
        </Tbody />
    </Td>
  );
};

export default function Markets() {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [watchlist, setWatchlist] = useState<string[]>([]);
  
  // Convert market data to unified format
  const allMarkets = useMemo(() => {
    const markets: MarketItem[] = [];
    
    // Add cryptocurrencies
    marketData.cryptocurrencies.forEach(crypto => {
      markets.push({
        symbol: crypto.symbol,
        name: crypto.name,
        price: crypto.price,
        change: crypto.change24h,
        volume: crypto.volume24h,
        marketCap: crypto.marketCap,
        type: 'crypto'
      });
    });
    
    // Add forex pairs
    marketData.forex.forEach(pair => {
      markets.push({
        symbol: pair.pair,
        name: pair.pair,
        price: pair.bid,
        change: pair.change,
        type: 'forex'
      });
    });
    
    // Add stocks
    marketData.stocks.forEach(stock => {
      markets.push({
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        change: stock.change,
        volume: stock.volume,
        marketCap: stock.marketCap,
        type: 'stock'
      });
    });
    
    // Add commodities
    marketData.commodities.forEach(commodity => {
      markets.push({
        symbol: commodity.symbol,
        name: commodity.name,
        price: commodity.price,
        change: commodity.change,
        type: 'commodity'
      });
    });
    
    return markets;
  }, []);
  
  // Filter markets based on search and category
  const filteredMarkets = useMemo(() => {
    let filtered = allMarkets;
    
    if (searchTerm) {
      filtered = filtered.filter(market => 
        market.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        market.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(market => market.type === selectedCategory);
    }
    
    return filtered;
  }, [allMarkets, searchTerm, selectedCategory]);
  
  // Get top movers
  const topGainers = useMemo(() => 
    [...allMarkets].sort((a, b) => b.change - a.change).slice(0, 5),
    [allMarkets]
  );
  
  const topLosers = useMemo(() => 
    [...allMarkets].sort((a, b) => a.change - b.change).slice(0, 5),
    [allMarkets]
  );
  
  const toggleWatchlist = (symbol: string) => {
    setWatchlist(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };
  
  if (selectedSymbol) {
    return <marketDetailPage symbol={selectedSymbol} onClose={() => setSelectedSymbol(null)} />;
  }
  
  return (
    <Div className="space-y-8">
      {/* Header */}
      <Div>
        <H1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <activity />
          Markets Overview
        </Div>
        <P className="text-gray-400">
          Real-time market data across cryptocurrencies, forex, stocks, and commodities
        </P>
      </Div>
      
      {/* Market Stats */}
      <Div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent style={{ padding: "1rem" }}>
            <Div className="flex items-center justify-between">
              <Div>
                <P className="text-sm text-gray-400">Total Markets</Div>
                <P className="text-2xl font-bold text-white">{allMarkets.length}</P>
              </Div>
              <barChart3 />
            </div />
        </Card>
        <Card>
          <CardContent style={{ padding: "1rem" }}>
            <Div className="flex items-center justify-between">
              <Div>
                <P className="text-sm text-gray-400">24h Volume</Card>
                <P className="text-2xl font-bold text-white">$2.3T</P>
              </Div>
              <Volume2 />
            </Volume2 />
        </Volume2>
        <Card>
          <CardContent style={{ padding: "1rem" }}>
            <Div className="flex items-center justify-between">
              <Div>
                <P className="text-sm text-gray-400">Gainers</Card>
                <P className="text-2xl font-bold text-green-400">
                  {allMarkets.filter(m => m.change > 0).length}
                </P>
              </Div>
              <trendingUp />
            </div />
        </Card>
        <Card>
          <CardContent style={{ padding: "1rem" }}>
            <Div className="flex items-center justify-between">
              <Div>
                <P className="text-sm text-gray-400">Losers</Card>
                <P className="text-2xl font-bold text-red-400">
                  {allMarkets.filter(m => m.change < 0).length}
                </P>
              </Div>
              <trendingDown />
            </div />
        </Card>
      </Div>
      
      {/* Top Movers */}
      <Div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle style={{ color: "white", display: "flex", alignItems: "center" }}>
              <trendingUp />
              Top Gainers
            </div />
          <CardContent>
            <Div className="space-y-3">
              {topGainers.map((market) => (
                <Div 
                  key={market.symbol} 
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => setSelectedSymbol(market.symbol)}
                >
                  <Div className="flex items-center gap-3">
                    <Div className="w-8 h-8 bg-green-400/20 rounded-full flex items-center justify-center">
                      {market.type === 'crypto' && <bitcoin />}
                      {market.type === 'forex' && <DollarSign />}
                      {market.type === 'stock' && <barChart3 />}
                      {market.type === 'commodity' && <Coins />}
                    </Div>
                    <Div>
                      <P className="font-medium text-white">{market.symbol}</Div>
                      <P className="text-xs text-gray-400">{market.name}</P>
                    </Div>
                  </Div>
                  <Div className="text-right">
                    <P className="font-medium text-white">${market.price.toFixed(2)}</Div>
                    <P className="text-sm text-green-400">+{market.change.toFixed(2)}%</P>
                  </Div>
                </Div>
              ))}
            </div />
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle style={{ color: "white", display: "flex", alignItems: "center" }}>
              <trendingDown />
              Top Losers
            </Card />
          <CardContent>
            <Div className="space-y-3">
              {topLosers.map((market) => (
                <Div 
                  key={market.symbol} 
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => setSelectedSymbol(market.symbol)}
                >
                  <Div className="flex items-center gap-3">
                    <Div className="w-8 h-8 bg-red-400/20 rounded-full flex items-center justify-center">
                      {market.type === 'crypto' && <bitcoin />}
                      {market.type === 'forex' && <DollarSign />}
                      {market.type === 'stock' && <barChart3 />}
                      {market.type === 'commodity' && <Coins />}
                    </Card>
                    <Div>
                      <P className="font-medium text-white">{market.symbol}</Div>
                      <P className="text-xs text-gray-400">{market.name}</P>
                    </Div>
                  </Div>
                  <Div className="text-right">
                    <P className="font-medium text-white">${market.price.toFixed(2)}</Div>
                    <P className="text-sm text-red-400">{market.change.toFixed(2)}%</P>
                  </Div>
                </Div>
              ))}
            </div />
        </Card>
      </Div>
      
      {/* Search and Filters */}
      <Div className="flex flex-col md:flex-row gap-4">
        <Div className="flex-1 relative">
          <Search />
          <Input placeholder="Search markets..." value={searchTerm} onChange={(e) = /> setSearchTerm(e.target.value)} className="pl-10 bg-white/5 border-white/10 text-white" />
        </Div>
        <Tabs>
          <TabsList>
            <TabsTrigger value="all">All</Tabs>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
            <TabsTrigger value="forex">Forex</TabsTrigger>
            <TabsTrigger value="stock">Stocks</TabsTrigger>
            <TabsTrigger value="commodity">Commodities</TabsTrigger />
        </TabsTrigger>
      </Div>
      
      {/* Markets Grid/Table */}
      <Tabs defaultValue="grid" style={{ width: "100%" }}>
        <TabsList>
          <TabsTrigger value="grid">Grid View</Tabs>
          <TabsTrigger value="table">Table View</TabsTrigger />
        
        <TabsContent value="grid">
          <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMarkets.map((market) => (
              <Div key={market.symbol} onClick={() => setSelectedSymbol(market.symbol)}>
                <marketCard item={market} onClick={setSelectedSymbol} / />
            ))}
          </div />
        
        <TabsContent value="table">
          <Card>
            <CardContent>
              <marketTable items={filteredMarkets} onSelect={setSelectedSymbol} / />
          </Card />
      </TabsTrigger>
      
      {filteredMarkets.length === 0 && (
        <Div className="text-center py-12">
          <P className="text-gray-400"></Div></Div></Div></Div></Div>No markets found matching your criteria.</Div>
          <Button variant="ghost" onClick={() => {
            setSearchTerm('');
            setSelectedCategory('all');
          }} className="mt-4">
            Reset Filters
          </Button>
        </Div>
      )}
    </Div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
