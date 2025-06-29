import * as React from "react";
import { useState, useMemo } from "react";

export type Ticker = {
  symbol: string;
  price: number;
  change: number;
  volume: number;
};

type SortField = "symbol" | "price" | "change" | "volume";
type SortDirection = "asc" | "desc";

type Props = {
  tickers: Ticker[];
  onSelect?: (symbol: string) => void;
};

export default function MarketsTable({ tickers, onSelect }: Props) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("symbol");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Filter and sort tickers
  const filteredTickers = useMemo(() => {
    let filtered = [...tickers];

    // Apply search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(ticker =>
        ticker.symbol.toLowerCase().includes(searchLower)
      );
    }

    // Sort by selected field
    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortField === "symbol") {
        comparison = a.symbol.localeCompare(b.symbol);
      } else if (sortField === "price") {
        comparison = a.price - b.price;
      } else if (sortField === "change") {
        comparison = a.change - b.change;
      } else if (sortField === "volume") {
        comparison = a.volume - b.volume;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
    
    // Move favorites to top
    if (favorites.size > 0) {
      filtered.sort((a, b) => {
        const aIsFav = favorites.has(a.symbol);
        const bIsFav = favorites.has(b.symbol);
        
        if (aIsFav && !bIsFav) return -1;
        if (!aIsFav && bIsFav) return 1;
        return 0;
      });
    }

    return filtered;
  }, [tickers, search, sortField, sortDirection, favorites]);

  // Toggle sort direction or set new sort field
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Toggle favorite status
  const toggleFavorite = (symbol: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    const newFavorites = new Set(favorites);
    if (newFavorites.has(symbol)) {
      newFavorites.delete(symbol);
    } else {
      newFavorites.add(symbol);
    }
    
    setFavorites(newFavorites);
  };

  // Format numbers for display
  const formatPrice = (price: number) => {
    if (price > 1000) {
      return price.toLocaleString('en-US', { maximumFractionDigits: 2 });
    } else if (price > 1) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else {
      return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 });
    }
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1_000_000_000) {
      return `${(volume / 1_000_000_000).toFixed(1)}B`;
    } else if (volume >= 1_000_000) {
      return `${(volume / 1_000_000).toFixed(1)}M`;
    } else if (volume >= 1_000) {
      return `${(volume / 1_000).toFixed(1)}K`;
    } else {
      return volume.toString();
    }
  };

  return (
    <div >
      {/* Search Bar */}
      <div >
        <span style={{fontSize: '16px'}}>🔍</span>
        <Input
          placeholder="Search by symbol..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ color: "white" }}
        />
      </div>
      
      {/* Tickers Table */}
      <div style={{ borderRadius: "0.75rem", border: "1px solid #374151" }}>
        <div >
          <Table>
            <TableHeader>
              <TableRow >
                <TableHead ></TableHead>
                <TableHead 
                  onClick={() => handleSort("symbol")} 
                  
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    Symbol
                    {sortField === "symbol" && (
                      sortDirection === "asc" ? 
                      <ChevronUp  /> :
                      <ChevronDown  />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  onClick={() => handleSort("price")}
                  
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    Price
                    {sortField === "price" && (
                      sortDirection === "asc" ? 
                      <ChevronUp  /> :
                      <ChevronDown  />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  onClick={() => handleSort("change")}
                  
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    Change 24h
                    {sortField === "change" && (
                      sortDirection === "asc" ? 
                      <ChevronUp  /> :
                      <ChevronDown  />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  onClick={() => handleSort("volume")}
                  
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    Volume
                    {sortField === "volume" && (
                      sortDirection === "asc" ? 
                      <ChevronUp  /> :
                      <ChevronDown  />
                    )}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickers.map((ticker) => (
                <TableRow
                  key={ticker.symbol}
                  onClick={() => onSelect?.(ticker.symbol)}
                  className={`hover:bg-white/10 cursor-pointer transition-colors ${
                    favorites.has(ticker.symbol) ? "bg-cyan-950/20" : ""
                  }`}
                >
                  <TableCell >
                    <button 
                      onClick={(e) => toggleFavorite(ticker.symbol, e)}
                      
                    >
                      <span style={{fontSize: '16px'}}>⭐</span>
                    </button>
                  </TableCell>
                  <TableCell >{ticker.symbol}</TableCell>
                  <TableCell >${formatPrice(ticker.price)}</TableCell>
                  <TableCell className={`text-right ${
                    ticker.change > 0 ? "text-green-400" : 
                    ticker.change < 0 ? "text-red-400" : "text-gray-400"
                  }`}>
                    {formatPercent(ticker.change)}
                  </TableCell>
                  <TableCell >{formatVolume(ticker.volume)}</TableCell>
                </TableRow>
              ))}
              
              {filteredTickers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} style={{ paddingTop: "32px", paddingBottom: "32px" }}>
                    No markets found matching "{search}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <div style={{ display: "flex" }}>
        <span>Showing {filteredTickers.length} of {tickers.length} markets</span>
        <span>{favorites.size} favorites</span>
      </div>
    </div>
  );
} 