import * as React from "react";
import MarketDigest from "@/components/markets/MarketDigest";
import { DigestItem } from "@/components/markets/MarketDigest";
import { generateDigestSummary, DigestItemInput } from "@/lib/markets/generateDigestSummary";

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
    <div style={{ width: "100%", marginLeft: "auto", marginRight: "auto", paddingTop: "32px", paddingBottom: "32px", paddingLeft: "16px", paddingRight: "16px" }}>
      <div >
        <header style={{ marginBottom: "32px" }}>
          <h1 style={{ fontWeight: "700", color: "white" }}>
            AI Market Digest
          </h1>
          <p >
            A real-time feed of markets matching your active strategies, powered
            by AI.
          </p>
        </header>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
          <button style={{ color: "white", paddingLeft: "16px", paddingRight: "16px", display: "flex", alignItems: "center" }}>
            <span style={{fontSize: '16px'}}>⚡</span>
            <span>Live Scan</span>
          </button>
          <button style={{ color: "white", paddingLeft: "16px", paddingRight: "16px", display: "flex", alignItems: "center" }}>
            <span style={{fontSize: '16px'}}>📄</span>
            <span>View Reports</span>
          </button>
        </div>

        <MarketDigest digest={digestItems} />
        
        <div >
          <p >
            Summaries generated automatically based on price action, volume, and strategy matches
          </p>
        </div>
      </div>
    </div>
  );
}
