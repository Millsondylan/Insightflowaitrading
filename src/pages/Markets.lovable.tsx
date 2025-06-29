import React, { useState, useEffect, useMemo } from "react";
import { marketData } from "@/lib/academy/comprehensiveLessonData";
import MarketDetailPage from "@/components/markets/MarketDetailPage";
import MatchedTickers from "@/components/markets/MatchedTickers";

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
    <Card 
      
      onClick={onClick}
    >
      <CardContent style={{ padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              {item.type === 'crypto' && <Bitcoin  />}
              {item.type === 'forex' && <span style={{fontSize: '16px'}}>💰</span>}
              {item.type === 'stock' && <BarChart3  />}
              {item.type === 'commodity' && <Coins  />}
            </div>
            <div>
              <h3 style={{ color: "white" }}>
                {item.symbol}
              </h3>
              <p style={{ color: "#9CA3AF" }}>{item.name}</p>
            </div>
          </div>
          <ChevronRight style={{ color: "#9CA3AF" }} />
        </div>
        
        <div style={{ display: "flex" }}>
          <div>
            <p style={{ fontWeight: "700", color: "white" }}>
              {item.type === 'forex' ? item.price.toFixed(4) : 
               item.type === 'commodity' ? `$${item.price.toFixed(2)}` :
               `$${item.price.toLocaleString()}`}
            </p>
            {item.volume && (
              <p style={{ color: "#9CA3AF" }}>
                Vol: {(item.volume / 1000000).toFixed(1)}M
              </p>
            )}
          </div>
          <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <span style={{fontSize: '16px'}}>📈</span> : <span style={{fontSize: '16px'}}>📉</span>}
            <span >{isPositive ? '+' : ''}{item.change.toFixed(2)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MarketTable = ({ items, onSelect }: { items: MarketItem[]; onSelect: (symbol: string) => void }) => {
  return (
    <div >
      <table style={{ width: "100%" }}>
        <thead>
          <tr >
            <th style={{ paddingLeft: "16px", paddingRight: "16px", color: "#9CA3AF" }}>Asset</th>
            <th style={{ paddingLeft: "16px", paddingRight: "16px", color: "#9CA3AF" }}>Price</th>
            <th style={{ paddingLeft: "16px", paddingRight: "16px", color: "#9CA3AF" }}>24h Change</th>
            <th style={{ paddingLeft: "16px", paddingRight: "16px", color: "#9CA3AF" }}>Volume</th>
            <th style={{ paddingLeft: "16px", paddingRight: "16px", color: "#9CA3AF" }}>Market Cap</th>
            <th style={{ paddingLeft: "16px", paddingRight: "16px", color: "#9CA3AF" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const isPositive = item.change >= 0;
            return (
              <tr key={item.symbol} >
                <td style={{ paddingLeft: "16px", paddingRight: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {item.type === 'crypto' && <Bitcoin  />}
                      {item.type === 'forex' && <span style={{fontSize: '16px'}}>💰</span>}
                      {item.type === 'stock' && <BarChart3  />}
                      {item.type === 'commodity' && <Coins  />}
                    </div>
                    <div>
                      <p style={{ color: "white" }}>{item.symbol}</p>
                      <p style={{ color: "#9CA3AF" }}>{item.name}</p>
                    </div>
                  </div>
                </td>
                <td style={{ paddingLeft: "16px", paddingRight: "16px" }}>
                  <p style={{ color: "white" }}>
                    {item.type === 'forex' ? item.price.toFixed(4) : 
                     item.type === 'commodity' ? `$${item.price.toFixed(2)}` :
                     `$${item.price.toLocaleString()}`}
                  </p>
                </td>
                <td style={{ paddingLeft: "16px", paddingRight: "16px" }}>
                  <div className={`flex items-center justify-end gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? <span style={{fontSize: '16px'}}>📈</span> : <span style={{fontSize: '16px'}}>📉</span>}
                    <span >{isPositive ? '+' : ''}{item.change.toFixed(2)}%</span>
                  </div>
                </td>
                <td style={{ paddingLeft: "16px", paddingRight: "16px" }}>
                  <p style={{ color: "#9CA3AF" }}>
                    {item.volume ? `${(item.volume / 1000000).toFixed(1)}M` : '-'}
                  </p>
                </td>
                <td style={{ paddingLeft: "16px", paddingRight: "16px" }}>
                  <p style={{ color: "#9CA3AF" }}>
                    {item.marketCap ? `$${(item.marketCap / 1000000000).toFixed(1)}B` : '-'}
                  </p>
                </td>
                <td style={{ paddingLeft: "16px", paddingRight: "16px" }}>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => onSelect(item.symbol)}
                    
                  >
                    View
                    <ChevronRight  />
                  </Button>
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
    return <MarketDetailPage symbol={selectedSymbol} onBack={() => setSelectedSymbol(null)} />;
  }
  
  return (
    <div style={{ marginTop: "32px" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "1.875rem", fontWeight: "700", color: "white", display: "flex", alignItems: "center" }}>
          <Activity  />
          Markets Overview
        </h1>
        <p style={{ color: "#9CA3AF" }}>
          Real-time market data across cryptocurrencies, forex, stocks, and commodities
        </p>
      </div>
      
      {/* Market Stats */}
      <div >
        <Card >
          <CardContent style={{ padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>
                <p style={{ color: "#9CA3AF" }}>Total Markets</p>
                <p style={{ fontWeight: "700", color: "white" }}>{allMarkets.length}</p>
              </div>
              <BarChart3  />
            </div>
          </CardContent>
        </Card>
        <Card >
          <CardContent style={{ padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>
                <p style={{ color: "#9CA3AF" }}>24h Volume</p>
                <p style={{ fontWeight: "700", color: "white" }}>$2.3T</p>
              </div>
              <Volume2  />
            </div>
          </CardContent>
        </Card>
        <Card >
          <CardContent style={{ padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>
                <p style={{ color: "#9CA3AF" }}>Gainers</p>
                <p style={{ fontWeight: "700" }}>
                  {allMarkets.filter(m => m.change > 0).length}
                </p>
              </div>
              <span style={{fontSize: '16px'}}>📈</span>
            </div>
          </CardContent>
        </Card>
        <Card >
          <CardContent style={{ padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>
                <p style={{ color: "#9CA3AF" }}>Losers</p>
                <p style={{ fontWeight: "700" }}>
                  {allMarkets.filter(m => m.change < 0).length}
                </p>
              </div>
              <span style={{fontSize: '16px'}}>📉</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Top Movers */}
      <div >
        <Card >
          <CardHeader>
            <CardTitle style={{ color: "white", display: "flex", alignItems: "center" }}>
              <span style={{fontSize: '16px'}}>📈</span>
              Top Gainers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div >
              {topGainers.map((market) => (
                <div 
                  key={market.symbol} 
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={() => setSelectedSymbol(market.symbol)}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {market.type === 'crypto' && <Bitcoin  />}
                      {market.type === 'forex' && <span style={{fontSize: '16px'}}>💰</span>}
                      {market.type === 'stock' && <BarChart3  />}
                      {market.type === 'commodity' && <Coins  />}
                    </div>
                    <div>
                      <p style={{ color: "white" }}>{market.symbol}</p>
                      <p style={{ color: "#9CA3AF" }}>{market.name}</p>
                    </div>
                  </div>
                  <div >
                    <p style={{ color: "white" }}>${market.price.toFixed(2)}</p>
                    <p >+{market.change.toFixed(2)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card >
          <CardHeader>
            <CardTitle style={{ color: "white", display: "flex", alignItems: "center" }}>
              <span style={{fontSize: '16px'}}>📉</span>
              Top Losers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div >
              {topLosers.map((market) => (
                <div 
                  key={market.symbol} 
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={() => setSelectedSymbol(market.symbol)}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {market.type === 'crypto' && <Bitcoin  />}
                      {market.type === 'forex' && <span style={{fontSize: '16px'}}>💰</span>}
                      {market.type === 'stock' && <BarChart3  />}
                      {market.type === 'commodity' && <Coins  />}
                    </div>
                    <div>
                      <p style={{ color: "white" }}>{market.symbol}</p>
                      <p style={{ color: "#9CA3AF" }}>{market.name}</p>
                    </div>
                  </div>
                  <div >
                    <p style={{ color: "white" }}>${market.price.toFixed(2)}</p>
                    <p >{market.change.toFixed(2)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Search and Filters */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div >
          <span style={{fontSize: '16px'}}>🔍</span>
          <Input
            placeholder="Search markets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ color: "white" }}
          />
        </div>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList >
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
        <TabsList style={{ marginBottom: "16px" }}>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid">
          <div >
            {filteredMarkets.map((market) => (
              <MarketCard 
                key={market.symbol} 
                item={market} 
                onClick={() => setSelectedSymbol(market.symbol)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="table">
          <Card >
            <CardContent >
              <MarketTable 
                items={filteredMarkets} 
                onSelect={setSelectedSymbol}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {filteredMarkets.length === 0 && (
        <div >
          <p style={{ color: "#9CA3AF" }}>No markets found matching your criteria.</p>
          <Button 
            variant="ghost" 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
