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
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
              {item.type === 'crypto' && <Bitcoin />}
              {item.type === 'forex' && <DollarSign />}
              {item.type === 'stock' && <BarChart3 />}
              {item.type === 'commodity' && <Coins />}
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                {item.symbol}
              </h3>
              <p className="text-xs text-gray-400">{item.name}</p>
            </div>
          </div>
          <ChevronRight />
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xl font-bold text-white">
              {item.type === 'forex' ? item.price.toFixed(4) : 
               item.type === 'commodity' ? `$${item.price.toFixed(2)}` :
               `$${item.price.toLocaleString()}`}
            </p>
            {item.volume && (
              <p className="text-xs text-gray-400">
                Vol: {(item.volume / 1000000).toFixed(1)}M
              </p>
            )}
          </div>
          <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp /> : <TrendingDown />}
            <span className="font-semibold">{isPositive ? '+' : ''}{item.change.toFixed(2)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MarketTable = ({ items, onSelect }: { items: MarketItem[]; onSelect: (symbol: string) => void }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Asset</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Price</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">24h Change</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-400 hidden md:table-cell">Volume</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-400 hidden lg:table-cell">Market Cap</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const isPositive = item.change >= 0;
            return (
              <tr key={item.symbol} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                      {item.type === 'crypto' && <Bitcoin />}
                      {item.type === 'forex' && <DollarSign />}
                      {item.type === 'stock' && <BarChart3 />}
                      {item.type === 'commodity' && <Coins />}
                    </div>
                    <div>
                      <p className="font-medium text-white">{item.symbol}</p>
                      <p className="text-sm text-gray-400">{item.name}</p>
                    </div>
                  </div>
                </td>
                <td className="text-right py-3 px-4">
                  <p className="font-medium text-white">
                    {item.type === 'forex' ? item.price.toFixed(4) : 
                     item.type === 'commodity' ? `$${item.price.toFixed(2)}` :
                     `$${item.price.toLocaleString()}`}
                  </p>
                </td>
                <td className="text-right py-3 px-4">
                  <div className={`flex items-center justify-end gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? <TrendingUp /> : <TrendingDown />}
                    <span className="font-medium">{isPositive ? '+' : ''}{item.change.toFixed(2)}%</span>
                  </div>
                </td>
                <td className="text-right py-3 px-4 hidden md:table-cell">
                  <p className="text-gray-400">
                    {item.volume ? `${(item.volume / 1000000).toFixed(1)}M` : '-'}
                  </p>
                </td>
                <td className="text-right py-3 px-4 hidden lg:table-cell">
                  <p className="text-gray-400">
                    {item.marketCap ? `$${(item.marketCap / 1000000000).toFixed(1)}B` : '-'}
                  </p>
                </td>
                <td className="text-right py-3 px-4">
                  <button size="sm" variant="ghost" onClick={() => onSelect(item.symbol)} className="hover:text-blue-400">
                    View
                    <ChevronRight />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
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
    return <MarketDetailPage symbol={selectedSymbol} onClose={() => setSelectedSymbol(null)} />;
  }
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Activity />
          Markets Overview
        </h1>
        <p className="text-gray-400">
          Real-time market data across cryptocurrencies, forex, stocks, and commodities
        </p>
      </div>
      
      {/* Market Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent style={{ padding: "1rem" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Markets</p>
                <p className="text-2xl font-bold text-white">{allMarkets.length}</p>
              </div>
              <BarChart3 />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent style={{ padding: "1rem" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">24h Volume</p>
                <p className="text-2xl font-bold text-white">$2.3T</p>
              </div>
              <Volume2 />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent style={{ padding: "1rem" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Gainers</p>
                <p className="text-2xl font-bold text-green-400">
                  {allMarkets.filter(m => m.change > 0).length}
                </p>
              </div>
              <TrendingUp />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent style={{ padding: "1rem" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Losers</p>
                <p className="text-2xl font-bold text-red-400">
                  {allMarkets.filter(m => m.change < 0).length}
                </p>
              </div>
              <TrendingDown />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Top Movers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle style={{ color: "white", display: "flex", alignItems: "center" }}>
              <TrendingUp />
              Top Gainers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topGainers.map((market) => (
                <div 
                  key={market.symbol} 
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => setSelectedSymbol(market.symbol)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-400/20 rounded-full flex items-center justify-center">
                      {market.type === 'crypto' && <Bitcoin />}
                      {market.type === 'forex' && <DollarSign />}
                      {market.type === 'stock' && <BarChart3 />}
                      {market.type === 'commodity' && <Coins />}
                    </div>
                    <div>
                      <p className="font-medium text-white">{market.symbol}</p>
                      <p className="text-xs text-gray-400">{market.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">${market.price.toFixed(2)}</p>
                    <p className="text-sm text-green-400">+{market.change.toFixed(2)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle style={{ color: "white", display: "flex", alignItems: "center" }}>
              <TrendingDown />
              Top Losers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topLosers.map((market) => (
                <div 
                  key={market.symbol} 
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => setSelectedSymbol(market.symbol)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-400/20 rounded-full flex items-center justify-center">
                      {market.type === 'crypto' && <Bitcoin />}
                      {market.type === 'forex' && <DollarSign />}
                      {market.type === 'stock' && <BarChart3 />}
                      {market.type === 'commodity' && <Coins />}
                    </div>
                    <div>
                      <p className="font-medium text-white">{market.symbol}</p>
                      <p className="text-xs text-gray-400">{market.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">${market.price.toFixed(2)}</p>
                    <p className="text-sm text-red-400">{market.change.toFixed(2)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search />
          <input placeholder="Search markets..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-white/5 border-white/10 text-white" />
        </div>
        <Tabs>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
            <TabsTrigger value="forex">Forex</TabsTrigger>
            <TabsTrigger value="stock">Stocks</TabsTrigger>
            <TabsTrigger value="commodity">Commodities</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Markets Grid/Table */}
      <Tabs defaultValue="grid" style={{ width: "100%" }}>
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMarkets.map((market) => (
              <div key={market.symbol} onClick={() => setSelectedSymbol(market.symbol)}>
                <MarketCard item={market} onClick={setSelectedSymbol} />
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="table">
          <Card>
            <CardContent>
              <MarketTable items={filteredMarkets} onSelect={setSelectedSymbol} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {filteredMarkets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No markets found matching your criteria.</p>
          <button variant="ghost" onClick={() => {
            setSearchTerm('');
            setSelectedCategory('all');
          }} className="mt-4">
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

export const lovable = { component: true };
