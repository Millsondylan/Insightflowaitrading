import * as React from "react";
import MarketDigest from "@/components/markets/MarketDigest";
import { DigestItem } from "@/components/markets/MarketDigest";
import { generateDigestSummary, DigestItemInput } from "@/lib/markets/generateDigestSummary";
import { FileText, Zap } from "lucide-react";

// Mock raw market data (without summaries)
const mockMarketData: DigestItemInput[] = [
  {
    symbol: "BTCUSD",
    price: 63801.2,
    change: 2.5,
    volume: 125_000_000_000,
    matchedStrategies: 3,
  },
  {
    symbol: "ETHUSD",
    price: 3450.7,
    change: 1.8,
    volume: 85_000_000_000,
    matchedStrategies: 2,
  },
  {
    symbol: "SOLUSD",
    price: 145.5,
    change: 5.1,
    volume: 8_000_000_000,
    matchedStrategies: 4,
  },
  {
    symbol: "XRPUSD",
    price: 0.56,
    change: -1.2,
    volume: 25_000_000_000,
    matchedStrategies: 1,
  },
  {
    symbol: "DOGEUSD",
    price: 0.125,
    change: -3.5,
    volume: 12_000_000_000,
    matchedStrategies: 1,
  },
  {
    symbol: "ADAUSD",
    price: 0.57,
    change: 0.3,
    volume: 15_000_000_000,
    matchedStrategies: 2,
  },
  {
    symbol: "DOTUSD",
    price: 4.25,
    change: 0.8,
    volume: 5_000_000_000,
    matchedStrategies: 0,
  },
  {
    symbol: "LINKUSD",
    price: 15.67,
    change: 2.8,
    volume: 3_000_000_000,
    matchedStrategies: 1,
  },
];

export default function DigestPage() {
  // Generate digest items with AI summaries
  const digestItems: DigestItem[] = React.useMemo(() => {
    return mockMarketData.map(item => ({
      ...item,
      summary: generateDigestSummary(item)
    }));
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="theme-markets">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            AI Market Digest
          </div>
          <p className="text-lg text-white/70">
            A real-time feed of markets matching your active strategies, powered
            by AI.
          </p />

        <div className="flex justify-center gap-4 mb-8">
          <Button className="bg-cyan-600/80 text-white px-4 py-2 rounded-full flex items-center gap-2">
            <Zap >
            <span>Live Scan</p>
          </button>
          <Button className="bg-white/10 text-white px-4 py-2 rounded-full flex items-center gap-2">
            <Filetext /></button></button>
            <span>View Reports</span>
          </button>
        </div>

        <Marketdigest /></Marketdigest>
        
        <div className="mt-8 text-center">
          <p className="text-white/50 text-sm"></div></div>
            Summaries generated automatically based on price action, volume, and strategy matches
          </div>
        </div>
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
