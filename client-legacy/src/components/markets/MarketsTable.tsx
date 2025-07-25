
import * as React from "react";
import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronUp, ChevronDown, Search, Star } from "lucide-react";

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
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"/>
        <Input placeholder="Search by symbol..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-black/30 border-white/10 text-white"
        />
      </div>
      
      {/* Tickers Table */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-white/5 bg-black/40">
                <TableHead className="w-10"></TableHead>
                <TableHead 
                  onClick={() => handleSort("symbol")} 
                  className="cursor-pointer hover:text-cyan-400"
                >
                  <div className="flex items-center gap-2">
                    Symbol
                    {sortField === "symbol" && (
                      sortDirection === "asc" ? 
                      <ChevronUp className="h-4 w-4"/> :
                      <ChevronDown className="h-4 w-4"/>
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  onClick={() => handleSort("price")}
                  className="cursor-pointer hover:text-cyan-400 text-right"
                >
                  <div className="flex items-center justify-end gap-2">
                    Price
                    {sortField === "price" && (
                      sortDirection === "asc" ? 
                      <ChevronUp className="h-4 w-4"/> :
                      <ChevronDown className="h-4 w-4"/>
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  onClick={() => handleSort("change")}
                  className="cursor-pointer hover:text-cyan-400 text-right"
                >
                  <div className="flex items-center justify-end gap-2">
                    Change 24h
                    {sortField === "change" && (
                      sortDirection === "asc" ? 
                      <ChevronUp className="h-4 w-4"/> :
                      <ChevronDown className="h-4 w-4"/>
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  onClick={() => handleSort("volume")}
                  className="cursor-pointer hover:text-cyan-400 text-right"
                >
                  <div className="flex items-center justify-end gap-2">
                    Volume
                    {sortField === "volume" && (
                      sortDirection === "asc" ? 
                      <ChevronUp className="h-4 w-4"/> :
                      <ChevronDown className="h-4 w-4"/>
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
                  <TableCell className="w-10">
                    <Button variant="ghost" size="icon"
                      onClick={(e) => toggleFavorite(ticker.symbol, e)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-4 w-4 ${
                          favorites.has(ticker.symbol)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-500"
                        }`}
                      />
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{ticker.symbol}</TableCell>
                  <TableCell className="text-right">${formatPrice(ticker.price)}</TableCell>
                  <TableCell className={`text-right ${
                    ticker.change > 0 ? "text-green-400" : 
                    ticker.change < 0 ? "text-red-400" : "text-gray-400"
                  }`}>
                    {formatPercent(ticker.change)}
                  </TableCell>
                  <TableCell className="text-right">{formatVolume(ticker.volume)}</TableCell>
                </TableRow>
              ))}
              
              {filteredTickers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No markets found matching "{search}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 flex justify-between">
        <span>Showing {filteredTickers.length} of {tickers.length} markets</span>
        <span>{favorites.size} favorites</span>
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
