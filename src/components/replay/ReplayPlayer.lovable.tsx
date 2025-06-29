import { useState } from "react";

// /components/replay/ReplayPlayer.tsx

type Candle = {
  time: string; // ISO
  open: number;
  high: number;
  low: number;
  close: number;
};

type Props = {
  candles: Candle[];
  entryTime: string;
  exitTime: string;
};

export default function ReplayPlayer({ candles, entryTime, exitTime }: Props) {
  const [step, setStep] = useState(0);

  // The slice of candles to be rendered based on the current step
  const visibleCandles = candles.slice(0, step + 1);

  return (
    <div style={{ padding: "24px", borderRadius: "0.75rem", border: "1px solid #374151", color: "white" }}>
      {/* Chart placeholder with a relative container for future annotations */}
      <div >
        <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p >Chart for {visibleCandles.length} candle(s)</p>
        </div>
        {/* Future overlay for AI-generated annotations */}
        <div style={{ width: "100%" }}>
          {/* Annotations will be rendered here */}
        </div>
      </div>

      {/* Slider and step counter */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="range"
          min={0}
          max={candles.length > 0 ? candles.length - 1 : 0}
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
          style={{ width: "100%" }}
        />
        <span >
          {step + 1} / {candles.length}
        </span>
      </div>
    </div>
  );
} 