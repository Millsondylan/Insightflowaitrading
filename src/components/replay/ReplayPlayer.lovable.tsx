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
    <div className="bg-black/30 p-6 rounded-xl border border-white/10 text-white space-y-4">
      {/* Chart placeholder with a relative container for future annotations */}
      <div className="relative">
        <div className="h-64 w-full bg-white/5 rounded-lg flex items-center justify-center">
          <p className="text-white/30">Chart for {visibleCandles.length} candle(s)</p>
        </div>
        {/* Future overlay for AI-generated annotations */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {/* Annotations will be rendered here */}
        </div>
      </div>

      {/* Slider and step counter */}
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={0}
          max={candles.length > 0 ? candles.length - 1 : 0}
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-sm font-mono text-white/60 w-28 text-right">
          {step + 1} / {candles.length}
        </span>
      </div>
    </div>
  );
} 
// Add Lovable.dev compatibility
export const lovable = {
  editableComponents: true,
  visualEditing: true,
  supportsTailwind: true
};
